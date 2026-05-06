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

  🖼️ **Manajemen Data Warga**

  Pencatatan identitas warga yang terintegrasi dengan fitur upload dokumen pendukung.

  💡 Note: Untuk pengujian fitur Upload KTP, silakan unggah gambar mandiri dari perangkat Anda karena data awal pada seeder hanya menggunakan placeholder.

## 📊 Database Design (ERD)

Sistem ini dirancang dengan struktur database yang mendukung pelacakan historis hunian dan fleksibilitas pembayaran iuran.


### Penjelasan Struktur:

- **Manajemen Hunian (Historis):** 
  Melalui tabel `house_histories`, sistem dapat melacak riwayat penghuni rumah. Rumah dianggap dihuni secara aktif jika terdapat data dengan `end_date` bernilai `NULL`.
  
- **Sistem Iuran & Pembayaran:**
  - **Tabel `dues`**: Menyimpan tagihan iuran per rumah per bulan (misal: Keamanan/Kebersihan). Tagihan bersifat unik untuk kombinasi `house_id`, `due_type`, dan `due_month`.
  - **Tabel `payments`**: Memungkinkan satu tagihan (`dues`) dibayar melalui beberapa kali transaksi. Hal ini mendukung status pembayaran **Partial** (cicilan).

- **Pelacakan Pengeluaran:**
  Tabel `expenses` mencatat seluruh arus kas keluar RT secara mendetail untuk transparansi laporan keuangan.

---

## ⚙️ Panduan Instalasi (WAJIB DIIKUTI)

Pastikan sudah terinstall:
- PHP >= 8.2
- Composer
- Node.js
- MySQL


### 1️⃣ Clone Repository

bash
git clone https://github.com/BagasSatriaYn/bagassatria-skillfit-beon.git <br>
cd bagassatria-skillfit-beon



### 2️⃣ Instalasi Backend (Laravel)
cd backend <br>
composer install <br>
cp .env.example .env <br>
php artisan key:generate <br>


### 📌 Konfigurasi Database

Edit file .env <br>
Sesuaikan DB_DATABASE, DB_USERNAME, DB_PASSWORD

Jalankan migrasi & seeder:

php artisan migrate --seed <br>
php artisan storage:link <br>
php artisan serve <br>


### 3️⃣ Instalasi Frontend (React)

Buka terminal baru:

cd frontend <br>
npm install <br>
npm run dev <br>


### 🔐 Akun Demo

Gunakan akun berikut untuk login:

Email    : admin@rt.com <br>
Password : password

⚠️ Penting: Jika Anda mencoba menambah atau mengubah data warga, silakan unggah file gambar (JPG/PNG) sendiri pada kolom KTP untuk memvalidasi fungsi penyimpanan file di server lokal.


### 🧪 Pengujian Sistem

Dokumentasi pengujian tersedia pada:

FRONTEND_SUMMARY.md → Ringkasan teknis komponen UI


### 👨‍💻 Author

Bagas Satria Yudho Nugraha
Project ini dibuat untuk kebutuhan:

🎯 Skill Fit Test Fullstack Programmer Apprentice
PT Beon Intermedia
