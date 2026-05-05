<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        User::factory()->create([
            'name' => 'Ketua RT',
            'email' => 'admin@rt.com',
            'password' => bcrypt('password')
        ]);

        $faker = Faker::create('id_ID');

        // 2. Create Houses
        $houseIds = [];
        for ($i = 1; $i <= 20; $i++) {
            $houseIds[] = DB::table('houses')->insertGetId([
                'house_number' => 'A' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'status' => $faker->randomElement(['occupied', 'occupied', 'occupied', 'empty']), // mostly occupied
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Create Residents and link to occupied houses
        $occupiedHouses = DB::table('houses')->where('status', 'occupied')->get();
        
        foreach ($occupiedHouses as $house) {
            $residentId = DB::table('residents')->insertGetId([
                'full_name' => $faker->name(),
                'ktp_photo' => null,
                'status' => $faker->randomElement(['permanent', 'contract']),
                'phone_number' => $faker->phoneNumber(),
                'is_married' => $faker->boolean(70), // 70% chance married
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create house history
            DB::table('house_histories')->insert([
                'house_id' => $house->id,
                'resident_id' => $residentId,
                'start_date' => $faker->dateTimeBetween('-2 years', '-1 month')->format('Y-m-d'),
                'end_date' => null, // currently occupied
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create Dues and Payments for the last 6 months
            for ($month = 0; $month <= 6; $month++) {
                $dueMonth = Carbon::now()->subMonths($month)->startOfMonth()->format('Y-m-d');
                
                // Security Due
                $dueSecurityId = DB::table('dues')->insertGetId([
                    'house_id' => $house->id,
                    'resident_id' => $residentId,
                    'due_type' => 'security',
                    'due_month' => $dueMonth,
                    'amount' => 100000,
                    'status' => 'paid',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('payments')->insert([
                    'due_id' => $dueSecurityId,
                    'amount_paid' => 100000,
                    'payment_date' => Carbon::now()->subMonths($month)->addDays(rand(1, 10))->format('Y-m-d H:i:s'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Cleaning Due
                $dueCleaningId = DB::table('dues')->insertGetId([
                    'house_id' => $house->id,
                    'resident_id' => $residentId,
                    'due_type' => 'cleaning',
                    'due_month' => $dueMonth,
                    'amount' => 15000,
                    'status' => 'paid',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('payments')->insert([
                    'due_id' => $dueCleaningId,
                    'amount_paid' => 15000,
                    'payment_date' => Carbon::now()->subMonths($month)->addDays(rand(1, 10))->format('Y-m-d H:i:s'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Add some empty houses with old histories
        $emptyHouses = DB::table('houses')->where('status', 'empty')->get();
        foreach ($emptyHouses as $house) {
            $residentId = DB::table('residents')->insertGetId([
                'full_name' => $faker->name(),
                'ktp_photo' => null,
                'status' => 'contract',
                'phone_number' => $faker->phoneNumber(),
                'is_married' => $faker->boolean(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('house_histories')->insert([
                'house_id' => $house->id,
                'resident_id' => $residentId,
                'start_date' => $faker->dateTimeBetween('-3 years', '-2 years')->format('Y-m-d'),
                'end_date' => $faker->dateTimeBetween('-1 year', '-1 month')->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 4. Create Expenses
        for ($month = 0; $month <= 6; $month++) {
            $expenseDate = Carbon::now()->subMonths($month)->addDays(rand(1, 28))->format('Y-m-d');
            
            DB::table('expenses')->insert([
                'expense_category' => 'Gaji Satpam',
                'description' => 'Gaji satpam bulan ' . Carbon::parse($expenseDate)->translatedFormat('F'),
                'amount' => 1500000,
                'expense_date' => $expenseDate,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($faker->boolean(70)) {
                DB::table('expenses')->insert([
                    'expense_category' => $faker->randomElement(['Listrik Pos', 'Perbaikan Jalan', 'Konsumsi Rapat', 'Lainnya']),
                    'description' => $faker->sentence(),
                    'amount' => $faker->numberBetween(5, 50) * 10000,
                    'expense_date' => $expenseDate,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
