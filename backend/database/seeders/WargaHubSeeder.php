<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Carbon\Carbon;

class WargaHubSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Disable foreign key checks for clean sweep
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('payments')->truncate();
        DB::table('dues')->truncate();
        DB::table('house_histories')->truncate();
        DB::table('residents')->truncate();
        DB::table('houses')->truncate();
        DB::table('expenses')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $faker = Faker::create('id_ID');

        // 1. Create Admin
        User::create([
            'name' => 'Ketua RT',
            'email' => 'admin@rt.com',
            'password' => Hash::make('password'),
        ]);

        // 2. Create 20 Houses (A01 - A20)
        $houseIds = [];
        for ($i = 1; $i <= 20; $i++) {
            $status = ($i <= 15) ? 'occupied' : ($i <= 18 ? 'occupied' : 'empty');
            $houseIds[] = DB::table('houses')->insertGetId([
                'house_number' => 'A' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'status' => $status,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Create Residents
        // 15 Permanent residents for A01-A15
        for ($i = 0; $i < 15; $i++) {
            $this->seedHouse($houseIds[$i], 'permanent', true, $faker);
        }

        // 3 temporary/contract residents for A16-A18
        for ($i = 15; $i < 18; $i++) {
            $this->seedHouse($houseIds[$i], 'contract', true, $faker);
        }

        // 2 empty houses (A19-A20) but with old history
        for ($i = 18; $i < 20; $i++) {
            $this->seedHouse($houseIds[$i], 'contract', false, $faker);
        }

        // 4. Seed some expenses (Realistic for an RT)
        $categories = [
            ['cat' => 'Gaji Satpam', 'amt' => 2000000],
            ['cat' => 'Gaji Petugas Kebersihan', 'amt' => 1200000],
            ['cat' => 'Listrik Pos Keamanan', 'amt' => 150000],
            ['cat' => 'Air Musholla', 'amt' => 75000],
            ['cat' => 'Konsumsi Rapat RT', 'amt' => 300000],
            ['cat' => 'Perbaikan Pagar Gerbang', 'amt' => 500000],
        ];

        for ($m = 0; $m < 6; $m++) {
            $date = Carbon::now()->subMonths($m);
            foreach ($categories as $c) {
                if ($c['cat'] === 'Perbaikan Pagar Gerbang' && $m !== 2) continue; // One time expense
                
                DB::table('expenses')->insert([
                    'expense_category' => $c['cat'],
                    'description' => $c['cat'] . ' periode ' . $date->translatedFormat('F Y'),
                    'amount' => $c['amt'],
                    'expense_date' => $date->startOfMonth()->addDays(rand(1, 10))->format('Y-m-d'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function seedHouse($houseId, $status, $isCurrentlyOccupied, $faker)
    {
        $residentId = DB::table('residents')->insertGetId([
            'full_name' => $faker->name(),
            'ktp_photo' => null,
            'status' => $status,
            'phone_number' => $faker->phoneNumber(),
            'is_married' => $faker->boolean(80),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $startDate = Carbon::now()->subYears(rand(1, 3))->subMonths(rand(1, 11));
        $endDate = $isCurrentlyOccupied ? null : Carbon::now()->subMonths(rand(1, 3));

        DB::table('house_histories')->insert([
            'house_id' => $houseId,
            'resident_id' => $residentId,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed dues for the last 12 months
        if ($isCurrentlyOccupied) {
            for ($m = 0; $m < 12; $m++) {
                $dueMonth = Carbon::now()->subMonths($m)->startOfMonth()->format('Y-m-d');
                
                // Security Due (Realistic: 100k)
                $this->createDueAndPayment($houseId, $residentId, 'security', $dueMonth, 100000, $m);
                
                // Cleaning Due (Realistic: 30k)
                $this->createDueAndPayment($houseId, $residentId, 'cleaning', $dueMonth, 30000, $m);
            }
        }
    }

    private function createDueAndPayment($houseId, $residentId, $type, $month, $amount, $monthsAgo)
    {
        // 90% chance of being paid if it's an old month, 50% if it's the current month
        $isPaid = ($monthsAgo > 0) ? (rand(1, 10) <= 9) : (rand(1, 10) <= 6);
        
        $dueId = DB::table('dues')->insertGetId([
            'house_id' => $houseId,
            'resident_id' => $residentId,
            'due_type' => $type,
            'due_month' => $month,
            'amount' => $amount,
            'status' => $isPaid ? 'paid' : 'unpaid',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($isPaid) {
            DB::table('payments')->insert([
                'due_id' => $dueId,
                'amount_paid' => $amount,
                'payment_date' => Carbon::parse($month)->addDays(rand(1, 15))->format('Y-m-d H:i:s'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
