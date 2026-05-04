# 🚀 Quick Start Guide - Smart RT Dashboard

Panduan cepat untuk menjalankan aplikasi Smart RT Dashboard (Frontend).

## Prerequisites

Pastikan sudah install:
- Node.js 18+ (download dari [nodejs.org](https://nodejs.org))
- npm (included dengan Node.js)
- Backend Laravel sudah running di port 8000

## ⚡ Quick Start (3 Langkah)

### 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```
⏱️ Waktu: ~2-3 menit

### 2️⃣ Jalankan Development Server
```bash
npm run dev
```
✅ Aplikasi akan buka di: `http://localhost:5173`

### 3️⃣ Buka di Browser
Aplikasi siap digunakan! 🎉

---

## 📋 Checklist Sebelum Jalankan

- [ ] Node.js 18+ terinstall (`node -v`)
- [ ] npm terinstall (`npm -v`)
- [ ] Backend Laravel running (`php artisan serve` di folder backend)
- [ ] Database Laravel sudah migrasi
- [ ] CORS enabled di Laravel (jika berbeda domain)

---

## 🔌 Koneksi Backend

Backend harus running di: `http://127.0.0.1:8000`

Jika URL berbeda, update di file:
```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://YOUR_API_URL/api';
```

---

## 🌐 Akses Aplikasi

Setelah `npm run dev`:

| Halaman | URL |
|---------|-----|
| Dashboard | `http://localhost:5173` |
| Penghuni | `http://localhost:5173/residents` |
| Rumah | `http://localhost:5173/houses` |
| Pembayaran | `http://localhost:5173/payments` |
| Laporan | `http://localhost:5173/reports` |

---

## 📱 Navigasi Aplikasi

```
Dashboard (Home)
├── 👥 Penghuni
│   ├── Lihat Daftar
│   ├── Tambah Penghuni
│   └── Edit/Hapus
├── 🏠 Rumah
│   ├── Lihat Daftar
│   ├── Tambah Rumah
│   ├── Edit/Hapus
│   └── Detail (History + Pembayaran)
├── 💰 Pembayaran
│   ├── Lihat Daftar
│   ├── Tambah Pembayaran
│   ├── Edit/Hapus
│   └── Report Pembayaran
└── 📊 Laporan
    ├── Grafik Tahunan
    └── Detail Pengeluaran
```

---

## 🎨 Features

✅ Dashboard dengan statistik overview
✅ CRUD Penghuni (Create, Read, Update, Delete)
✅ CRUD Rumah dengan historical data
✅ CRUD Pembayaran
✅ Report keuangan dengan grafik
✅ Responsive design (Desktop, Tablet, Mobile)
✅ Error handling & validation
✅ Loading states
✅ Dummy data fallback

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot find module 'react-router-dom'"
```bash
npm install react-router-dom chart.js react-chartjs-2
```

### ❌ API Connection Failed
1. Check backend running: `php artisan serve`
2. Check API URL di `src/services/api.js`
3. Check CORS configuration di Laravel

### ❌ Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### ❌ Blank Page
- Check browser console (F12)
- Clear browser cache
- Try hard refresh (Ctrl+Shift+R)

---

## 📚 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code dengan ESLint |

---

## 📊 Data Requirements

Pastikan backend sudah create minimum data:

### Penghuni (Residents)
```json
{
  "nama_lengkap": "John Doe",
  "nomor_telepon": "081234567890",
  "status": "tetap",
  "status_perkawinan": "sudah"
}
```

### Rumah (Houses)
```json
{
  "nomor_rumah": "01",
  "alamat": "Jl. Merdeka No. 1",
  "status": "dihuni"
}
```

### Pembayaran (Payments)
```json
{
  "resident_id": 1,
  "jenis_iuran": "satpam",
  "bulan": "2024-01",
  "jumlah": 100000,
  "status": "lunas"
}
```

---

## 🚀 Production Build

```bash
# Build
npm run build

# Output akan di folder 'dist'
# Deploy 'dist' folder ke web server
```

---

## 📞 Support

Jika ada masalah:
1. Check README_FRONTEND.md untuk info lengkap
2. Check browser console (F12 > Console)
3. Check backend logs

---

**Selamat menggunakan Smart RT Dashboard! 🎉**

Skill Fit Test - Jagoan Hosting Apprentice 2026
