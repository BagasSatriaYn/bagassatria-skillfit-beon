# 🏠 RT Management System (Fullstack)

Sistem manajemen RT berbasis web untuk mengelola data penghuni, rumah, iuran, serta pembayaran dengan fitur historis dan dashboard monitoring.

---

## 🚀 Tech Stack

### Backend

* Laravel (REST API)
* MySQL

### Frontend *(in progress / optional)*

* React JS

---

## 📦 Fitur Utama

### 👤 Manajemen Penghuni

* CRUD data penghuni
* Status penghuni (tetap / kontrak)

### 🏠 Manajemen Rumah

* CRUD data rumah
* Status rumah (terisi / kosong)

### 🔄 Assign Penghuni ke Rumah (Core Feature)

* Assign penghuni ke rumah
* Otomatis mengakhiri penghuni sebelumnya
* Menyimpan **riwayat penghuni (historical data)**

### 💰 Sistem Iuran (Dues)

* Iuran satpam & kebersihan
* Per bulan
* Status: unpaid, partial, paid

### 💳 Sistem Pembayaran

* Mendukung pembayaran cicilan
* Update status otomatis:

  * unpaid → partial → paid

### 📊 Dashboard

* Total rumah
* Rumah terisi & kosong
* Total pemasukan
* Total pengeluaran
* Total tunggakan

---

## 🌐 API Endpoint

Base URL:

```
http://127.0.0.1:8000/api
```

### Houses

* GET `/houses`
* POST `/houses`
* GET `/houses/{id}`
* PUT `/houses/{id}`
* DELETE `/houses/{id}`

### Residents

* GET `/residents`
* POST `/residents`
* GET `/residents/{id}`
* PUT `/residents/{id}`
* DELETE `/residents/{id}`

### Assignment

* POST `/assign-house`

### Dues

* GET `/dues`
* POST `/dues`

### Payment

* POST `/pay`

### Dashboard

* GET `/dashboard`

---

## ⚙️ Installation (Backend)

```bash
git clone <repo-url>
cd backend

composer install
cp .env.example .env
php artisan key:generate

# setup database di .env
php artisan migrate

php artisan serve
```

---

## 🧪 Testing API

Gunakan Postman / tools lain dengan header:

```
Accept: application/json
Content-Type: application/json
```

---

## 🧠 System Flow

```
Residents + Houses
        ↓
   Assign House
        ↓
  House Histories
        ↓
     Create Due
        ↓
     Payment
        ↓
     Dashboard
```

---

## ✨ Highlight

* Relasi database kompleks (ERD-based)
* Business logic nyata (bukan sekadar CRUD)
* Mendukung pembayaran cicilan
* Historical tracking penghuni
* Siap dikembangkan ke frontend

---

## 👨‍💻 Author

Bagas Satria Yudho Nugraha

---

## 📌 Notes

Project ini dibuat sebagai bagian dari **Skill Fit Test Fullstack Programmer Apprentice**.
