# 🏠 WargaHub - Smart RT Management System

**WargaHub** adalah sistem manajemen administrasi RT modern yang dirancang untuk mempermudah pengelolaan data warga, hunian, serta laporan keuangan iuran secara transparan dan real-time.

---

## 🚀 Tech Stack

### 🧩 Backend
- Laravel 11 (REST API)
- MySQL (Database)
- Laravel Sanctum (Authentication)

### 🎨 Frontend
- React.js (Vite)
- Chart.js (Data Visualization)
- Context API (State Management)

---

## 📦 Fitur Unggulan

- 📊 **Dashboard Interaktif**  
  Monitoring kas RT, status hunian, dan grafik tren arus kas tahunan.

- 🏘️ **Manajemen Hunian**  
  Tracking riwayat penghuni rumah (tetap/kontrak) secara historis.

- 💰 **Sistem Iuran Fleksibel**  
  Pengelolaan iuran satpam & kebersihan dengan dukungan pembayaran:
  - Unpaid
  - Partial
  - Paid

- 📑 **Laporan Keuangan**  
  Rekap pemasukan dan pengeluaran dengan filter per tahun.

- 🎯 **Branding Modern**  
  UI/UX bersih dengan tema warna **Emerald & Orange** yang profesional.

---

## ⚙️ Panduan Instalasi (WAJIB DIIKUTI)

Pastikan sudah terinstall:
- PHP >= 8.2
- Composer
- Node.js
- MySQL


### 1️⃣ Clone Repository

bash
git clone https://github.com/BagasSatriaYn/bagassatria-skillfit-beon.git
cd bagassatria-skillfit-beon



### 2️⃣ Instalasi Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate


### 📌 Konfigurasi Database

Edit file .env
Sesuaikan DB_DATABASE, DB_USERNAME, DB_PASSWORD

Jalankan migrasi & seeder:

php artisan migrate --seed
php artisan storage:link
php artisan serve


### 3️⃣ Instalasi Frontend (React)

Buka terminal baru:

cd frontend
npm install
npm run dev


### 🔐 Akun Demo

Gunakan akun berikut untuk login:

Email    : admin@rt.com
Password : password


### 🧪 Pengujian Sistem

Dokumentasi pengujian tersedia pada:

FRONTEND_SUMMARY.md → Ringkasan teknis komponen UI


### 👨‍💻 Author

Bagas Satria Yudho Nugraha
Project ini dibuat untuk kebutuhan:

🎯 Skill Fit Test Fullstack Programmer Apprentice
PT Beon Intermedia
