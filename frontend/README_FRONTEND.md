# Smart RT Dashboard - Frontend (React)

Aplikasi web untuk mengelola administrasi Rukun Tetangga (RT) termasuk manajemen penghuni, rumah, dan pembayaran iuran bulanan.

## 🚀 Fitur Utama

### 1. **Dashboard** 📊
- Ringkasan overview perumahan
- Statistik penghuni dan rumah
- Ringkasan keuangan bulanan
- Quick action buttons untuk navigasi cepat

### 2. **Kelola Penghuni** 👥
- **List Penghuni**: Lihat daftar semua penghuni
- **Tambah Penghuni**: Input data penghuni baru
  - Nama Lengkap
  - Nomor Telepon
  - Status (Tetap/Kontrak)
  - Status Perkawinan
  - Foto KTP (upload image)
- **Edit Penghuni**: Ubah informasi penghuni
- **Hapus Penghuni**: Hapus data penghuni

### 3. **Kelola Rumah** 🏠
- **List Rumah**: Daftar semua rumah dengan status
  - Statistik: Total, Dihuni, Kosong
- **Tambah/Edit Rumah**:
  - Nomor Rumah
  - Alamat
  - Status (Dihuni/Kosong)
  - Assign Penghuni
- **Detail Rumah**:
  - Informasi rumah
  - Penghuni saat ini
  - Riwayat penghuni (historical)
  - Riwayat pembayaran
- **Hapus Rumah**: Hapus data rumah

### 4. **Kelola Pembayaran** 💰
- **List Pembayaran**: Daftar semua transaksi pembayaran
  - Filter berdasarkan status (Lunas/Belum Lunas)
  - Statistik: Total, Lunas, Belum Lunas
- **Tambah/Edit Pembayaran**:
  - Pilih Penghuni
  - Jenis Iuran (Satpam Rp 100k / Kebersihan Rp 15k)
  - Bulan pembayaran
  - Status pembayaran
  - Tanggal bayar
- **Hapus Pembayaran**: Hapus transaksi pembayaran
- **Report Pembayaran**:
  - Ringkasan tahunan per bulan
  - Detail pembayaran per bulan
  - Visualisasi data Lunas vs Belum Lunas

### 5. **Laporan Keuangan** 📈
- **Grafik Tahunan**:
  - Line chart: Pemasukan & Pengeluaran
  - Bar chart: Perbandingan Pemasukan vs Pengeluaran
  - Pilih tahun untuk melihat data historis
- **Ringkasan Keuangan**:
  - Total Pemasukan
  - Total Pengeluaran
  - Saldo (Balance)
- **Detail Pengeluaran**:
  - Lihat pengeluaran per bulan
  - Nama pengeluaran, jumlah, tanggal, keterangan
  - Filter berdasarkan bulan

## 📋 Struktur Project

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx          # Halaman utama
│   │   ├── Residents.jsx          # Manajemen penghuni
│   │   ├── Houses.jsx             # Manajemen rumah
│   │   ├── Payments.jsx           # Manajemen pembayaran
│   │   └── Reports.jsx            # Laporan keuangan
│   ├── components/
│   │   ├── ResidentsList.jsx      # Daftar penghuni
│   │   ├── ResidentForm.jsx       # Form tambah/edit penghuni
│   │   ├── HousesList.jsx         # Daftar rumah
│   │   ├── HouseForm.jsx          # Form tambah/edit rumah
│   │   ├── HouseDetail.jsx        # Detail rumah & riwayat
│   │   ├── PaymentsList.jsx       # Daftar pembayaran
│   │   ├── PaymentForm.jsx        # Form tambah/edit pembayaran
│   │   ├── PaymentReport.jsx      # Report pembayaran
│   │   ├── FinancialChart.jsx     # Grafik keuangan
│   │   └── ExpenseReport.jsx      # Report pengeluaran
│   ├── services/
│   │   └── api.js                 # API client & endpoints
│   ├── App.jsx                    # Main app component dengan routing
│   ├── App.css                    # Global styles
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Base styles
├── package.json
├── vite.config.js
└── index.html
```

## 🛠 Tech Stack

- **React 19.2.5**: UI framework
- **React Router DOM 6.20.0**: Client-side routing
- **Axios 1.16.0**: HTTP client
- **Chart.js 4.4.1**: Data visualization
- **React ChartJS 2**: React wrapper for Chart.js
- **Vite 8.0.10**: Build tool & dev server

## 🚀 Setup & Running

### Prerequisites
- Node.js 18+ dan npm
- Backend Laravel sudah running di `http://127.0.0.1:8000`

### Install Dependencies
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Aplikasi akan buka di `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

## 🔌 API Integration

Semua endpoint API sudah dikonfigurasi di `src/services/api.js`:

```javascript
// Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Endpoints
- GET/POST /residents
- PUT/DELETE /residents/:id
- GET/POST /houses
- PUT/DELETE /houses/:id
- GET /houses/:id/history
- GET/POST /payments
- PUT/DELETE /payments/:id
- GET /payments/month/:year/:month
- GET /payments/year/:year
- GET /reports/financial-summary/:year
- GET /reports/monthly-detail/:year/:month
- GET /dashboard
```

## 📐 Data Structure

### Resident (Penghuni)
```json
{
  "id": 1,
  "nama_lengkap": "John Doe",
  "nomor_telepon": "081234567890",
  "status": "tetap|kontrak",
  "status_perkawinan": "sudah|belum",
  "foto_ktp": "base64 atau URL"
}
```

### House (Rumah)
```json
{
  "id": 1,
  "nomor_rumah": "01",
  "alamat": "Jl. Merdeka No. 1",
  "status": "dihuni|kosong",
  "residents": [],
  "house_histories": [],
  "payments": []
}
```

### Payment (Pembayaran)
```json
{
  "id": 1,
  "resident_id": 1,
  "jenis_iuran": "satpam|kebersihan",
  "bulan": "2024-01",
  "jumlah": 100000,
  "status": "lunas|belum",
  "tanggal_bayar": "2024-01-10"
}
```

## 🎨 UI Components & Styles

### Global Styles
- Gradient navbar dengan logo aplikasi
- Card-based layout
- Responsive grid system (grid-2, grid-3)
- Badge system untuk status
- Statistical cards

### Reusable Components
- `btn` + variants: `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`, `btn-sm`
- `card`: White container dengan shadow
- `table`: Styled data table
- `form-group`: Form input wrapper
- `badge`: Status indicator
- `stat-card`: Statistical display card
- `action-buttons`: Button group untuk CRUD

### Color Scheme
- Primary: #667eea (Purple)
- Success: #28a745 (Green)
- Danger: #dc3545 (Red)
- Warning: #ffc107 (Yellow)
- Info: #0c5460 (Blue)
- Background: #f5f5f5 (Light Gray)

## 📱 Responsive Design

Aplikasi responsive untuk:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (<768px)

Grid layouts otomatis adjust:
- Desktop: 3 kolom
- Tablet: 2 kolom
- Mobile: 1 kolom

## 💡 Fitur Khusus

### Form Validation
- Required field validation
- Numeric input validation
- Month/Date picker
- File upload untuk foto KTP

### Data Handling
- Loading states pada setiap API call
- Error handling & user-friendly messages
- Optimistic UI updates
- Dummy data fallback jika API gagal

### User Experience
- Quick navigation via navbar
- Breadcrumb-like status display
- Confirmation dialog untuk delete
- Success/error notifications
- Smooth transitions & hover effects

## 🔧 Konfigurasi

### API Base URL
Edit di `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

### Monthly Charges
Edit di `src/components/PaymentForm.jsx`:
```javascript
const CHARGES = {
  satpam: 100000,
  kebersihan: 15000,
};
```

## 🐛 Troubleshooting

### API Connection Error
- Pastikan backend Laravel running: `php artisan serve`
- Check CORS configuration di Laravel
- Verify API base URL di `src/services/api.js`

### Build Errors
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Charts Not Showing
- Ensure Chart.js dan react-chartjs-2 installed
- Check console untuk error messages
- Verify data format dari API

## 📚 Resources

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Chart.js Docs](https://www.chartjs.org)
- [Axios Docs](https://axios-http.com)
- [Vite Docs](https://vitejs.dev)

## 📄 License

Skill Fit Test - Jagoan Hosting Apprentice 2026

---

**Dibuat untuk Skill Fit Test sebagai Full Stack Programmer**
