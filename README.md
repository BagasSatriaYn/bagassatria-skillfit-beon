🏠 WargaHub - Smart RT Management System
WargaHub adalah sistem manajemen administrasi RT modern yang dirancang untuk mempermudah pengelolaan data warga, hunian, serta laporan keuangan iuran secara transparan dan real-time.

🚀 Tech Stack
Backend
Laravel 11 (REST API)

MySQL (Database)

Sanctum (Authentication)

Frontend
React.js (Vite)

Chart.js (Data Visualization)

Context API (State Management)

📦 Fitur Unggulan
Dashboard Interaktif: Monitoring kas RT, status hunian, dan grafik tren arus kas tahunan.

Manajemen Hunian: Tracking riwayat penghuni rumah (tetap/kontrak) secara historis.

Sistem Iuran Fleksibel: Pengelolaan iuran satpam & kebersihan dengan dukungan pembayaran cicilan (unpaid, partial, paid).

Laporan Keuangan: Rekapitulasi pemasukan dan pengeluaran yang dapat difilter per tahun.

Branding Modern: UI/UX bersih dengan tema warna Emerald & Orange yang profesional.

⚙️ Panduan Instalasi (WAJIB DIIKUTI)
Pastikan Anda memiliki PHP >= 8.2, Composer, Node.js, dan MySQL terinstal.

1. Persiapan Repository
Bash
git clone https://github.com/BagasSatriaYn/bagassatria-skillfit-beon.git
cd bagassatria-skillfit-beon

2. Instalasi Backend (Laravel)
Bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
Catatan: Atur konfigurasi database Anda di file .env.

Jalankan migrasi, seeder, dan link storage:

Bash
php artisan migrate --seed
php artisan storage:link
php artisan serve

3. Instalasi Frontend (React)
Buka terminal baru:

Bash
cd frontend
npm install
npm run dev

🔐 Akun Akses Demo
Gunakan kredensial berikut untuk menguji sistem:

Email: admin@rt.com

Password: password

🧪 Pengujian Sistem
Laporan pengujian detail dapat dilihat pada file berikut:

FRONTEND_SUMMARY.md: Ringkasan teknis komponen UI.

👨‍💻 Author
Bagas Satria Yudho Nugraha
Project ini dibuat untuk Skill Fit Test Fullstack Programmer Apprentice PT Beon Intermedia.
