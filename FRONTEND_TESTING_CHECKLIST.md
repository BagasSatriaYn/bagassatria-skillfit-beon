# ✅ Frontend Testing Checklist

**Application:** Smart RT Dashboard  
**Last Updated:** May 4, 2026

---

## 🚀 Pre-Launch Checklist

### Prerequisites
- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] Backend Laravel running (`php artisan serve`)
- [ ] Database migrated (`php artisan migrate`)
- [ ] Test data seeded (optional but recommended)

---

## 📦 Installation Verification

### Step 1: Dependencies
```bash
cd frontend
npm install
```

Verify:
- [ ] No dependency conflicts
- [ ] All packages installed successfully
- [ ] node_modules created (size ~300MB)
- [ ] package-lock.json updated

### Step 2: Start Server
```bash
npm run dev
```

Verify:
- [ ] Server starts without errors
- [ ] Port 5173 available
- [ ] Output shows "Local: http://localhost:5173"
- [ ] No missing module errors

---

## 🌐 Browser Testing

### Dashboard Page (`/`)
**Functionality**
- [ ] Page loads without errors
- [ ] Navbar visible with 5 menu items
- [ ] Dashboard title shows "🏠 Smart RT Dashboard"
- [ ] Statistics display (or dummy data if API fails)
- [ ] Finance table visible
- [ ] Quick action buttons clickable

**Data Display**
- [ ] Total Penghuni showing number
- [ ] Total Rumah showing number
- [ ] Houses occupied/empty stats showing
- [ ] Finance summary table has 4 rows
- [ ] Saldo calculation correct

**Navigation**
- [ ] Navbar links highlight active page
- [ ] Quick action buttons navigate correctly

---

### Residents Page (`/residents`)

#### List View (`/residents`)
- [ ] Page loads with "👥 Daftar Penghuni"
- [ ] "+ Tambah Penghuni" button visible
- [ ] Table headers: Nama, Telepon, Status, Perkawinan, KTP, Aksi
- [ ] Edit button per row
- [ ] Hapus button per row
- [ ] Status badges showing (tetap/kontrak)
- [ ] Empty state message if no data

#### Add Resident (`/residents/add`)
- [ ] Form loads with empty fields
- [ ] Nama Lengkap input required
- [ ] Nomor Telepon input required
- [ ] Status dropdown (tetap/kontrak)
- [ ] Perkawinan dropdown (sudah/belum)
- [ ] KTP file upload
- [ ] Batal button navigates back
- [ ] Submit creates resident

#### Edit Resident (`/residents/edit/:id`)
- [ ] Form loads with populated data
- [ ] Can modify all fields
- [ ] Submit updates resident
- [ ] Navigates back to list after save

#### Delete Resident
- [ ] Confirmation dialog appears
- [ ] Cancel stays on page
- [ ] Confirm removes from list
- [ ] Update successful message

---

### Houses Page (`/houses`)

#### List View (`/houses`)
- [ ] Page loads with statistics (Total, Dihuni, Kosong)
- [ ] "+ Tambah Rumah" button visible
- [ ] Table shows: Nomor, Status, Penghuni, Alamat, Aksi
- [ ] Detail button opens detail page
- [ ] Edit button opens edit form
- [ ] Hapus button deletes house

#### Add House (`/houses/add`)
- [ ] Form loads with empty fields
- [ ] Nomor Rumah input required
- [ ] Status dropdown (dihuni/kosong)
- [ ] Alamat input required
- [ ] Penghuni dropdown populated from residents
- [ ] Submit creates house

#### Edit House (`/houses/edit/:id`)
- [ ] Form loads with house data
- [ ] Can modify all fields
- [ ] Submit updates house

#### Detail View (`/houses/detail/:id`)
- [ ] Shows "Detail Rumah {nomor}"
- [ ] Displays house info (nomor, alamat, status)
- [ ] Shows current resident info (if any)
- [ ] Displays historical residents (if any)
- [ ] Shows payment history (if any)
- [ ] Back button returns to list

---

### Payments Page (`/payments`)

#### List View (`/payments`)
- [ ] Page loads with statistics (Total, Lunas, Belum Lunas)
- [ ] "+ Tambah Pembayaran" button visible
- [ ] "📊 Laporan" button visible
- [ ] Table shows: Penghuni, Iuran, Bulan, Jumlah, Status, Tanggal, Aksi
- [ ] Edit button works
- [ ] Hapus button deletes with confirmation

#### Add Payment (`/payments/add`)
- [ ] Form loads with empty fields
- [ ] Penghuni dropdown populated
- [ ] Jenis Iuran options: Satpam (100k), Kebersihan (15k)
- [ ] Jumlah auto-populates based on type
- [ ] Bulan month picker works
- [ ] Status dropdown (belum/lunas)
- [ ] Tanggal Bayar date picker (optional)
- [ ] Submit creates payment

#### Edit Payment (`/payments/edit/:id`)
- [ ] Form loads with payment data
- [ ] Can modify fields
- [ ] Submit updates payment

#### Payment Report (`/payments/report`)
- [ ] Year selector visible
- [ ] Monthly summary table shows 12 months
- [ ] Statistics visible (Lunas, Belum Lunas, Total)
- [ ] Month selector visible
- [ ] Monthly detail table shows transactions
- [ ] Calculations appear correct

---

### Reports Page (`/reports`)

#### Financial Charts
- [ ] Year selector visible
- [ ] Statistics visible (Income, Expense, Balance)
- [ ] Line chart renders (2 lines for income & expense)
- [ ] Bar chart renders (income vs expense)
- [ ] Legend shows correctly
- [ ] Y-axis shows Rupiah format
- [ ] Monthly data points visible

#### Expense Report
- [ ] Month selector visible
- [ ] Expense total shows correctly
- [ ] Table shows expense items (if any)
- [ ] Columns: Tanggal, Nama, Jumlah, Keterangan

---

## 🎨 UI/UX Testing

### Visual Design
- [ ] Navbar gradient looks good
- [ ] Colors consistent throughout
- [ ] Text readable on all backgrounds
- [ ] Buttons have hover effects
- [ ] Tables properly formatted

### Responsiveness
**Desktop (1200px+)**
- [ ] All 3-column grids show 3 columns
- [ ] Navigation sidebar visible
- [ ] Tables readable

**Tablet (768px - 1200px)**
- [ ] 2-column grids working
- [ ] Mobile menu appears if needed
- [ ] Tables responsive

**Mobile (<768px)**
- [ ] 1-column layout
- [ ] Buttons full width
- [ ] Forms single column
- [ ] Navigation accessible

### Accessibility
- [ ] Tab navigation works
- [ ] Form labels connected to inputs
- [ ] Color contrast sufficient
- [ ] Error messages clear

---

## 🔌 API Integration Testing

### Connection Test
- [ ] Backend running at http://127.0.0.1:8000
- [ ] Check browser Network tab (F12)
- [ ] API calls show in Network tab
- [ ] Response status 200 (or 422 for validation)

### Residents API
- [ ] GET /residents - fetches list
- [ ] POST /residents - creates new
- [ ] PUT /residents/:id - updates
- [ ] DELETE /residents/:id - deletes

### Houses API
- [ ] GET /houses - fetches list
- [ ] POST /houses - creates new
- [ ] PUT /houses/:id - updates
- [ ] DELETE /houses/:id - deletes
- [ ] GET /houses/:id/history - gets history

### Payments API
- [ ] GET /payments - fetches list
- [ ] POST /payments - creates new
- [ ] PUT /payments/:id - updates
- [ ] DELETE /payments/:id - deletes

### Reports API
- [ ] GET /dashboard - dashboard data
- [ ] GET /reports/yearly/:year - yearly data
- [ ] GET /reports/monthly-detail/:year/:month - monthly data

---

## 🐛 Error Handling Testing

### Network Errors
- [ ] Display error message if backend down
- [ ] Show user-friendly error (not stack trace)
- [ ] Provide fallback (dummy data or retry)
- [ ] Network error doesn't crash app

### Validation Errors
- [ ] Required fields show error on submit
- [ ] Error messages clear and helpful
- [ ] Form doesn't submit with errors
- [ ] Invalid data types handled

### Data Errors
- [ ] Handle missing data gracefully
- [ ] Handle null/undefined values
- [ ] Display "No data" messages
- [ ] Calculations handle zero values

---

## ⚡ Performance Testing

### Page Load Time
- [ ] Dashboard loads in <2s
- [ ] List pages load in <1s
- [ ] Form pages load in <1s

### Responsiveness
- [ ] Button clicks register immediately
- [ ] No lag when typing forms
- [ ] Tables render smoothly
- [ ] Charts render without delay

### Memory Usage
- [ ] App doesn't accumulate memory leak
- [ ] Navigation doesn't create memory bloat
- [ ] Long lists handle many items

---

## ✨ Feature Testing

### CRUD Operations
- [ ] ✅ Create (Add) - All modules
- [ ] ✅ Read (List, Detail) - All modules
- [ ] ✅ Update (Edit) - All modules
- [ ] ✅ Delete - All modules

### Data Integrity
- [ ] Deleted items removed from lists
- [ ] Edited items reflect changes immediately
- [ ] New items appear in lists
- [ ] Relationships maintained (resident-house)

### User Workflows
- [ ] Add resident → Add house → Assign resident → Add payment
- [ ] View house detail → See payment history
- [ ] View payment report → See monthly data
- [ ] View financial report → See trends

---

## 📱 Browser Compatibility

Test on:
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 🚀 Production Readiness

### Code Quality
- [ ] No console errors
- [ ] No console warnings (except 3rd party)
- [ ] No broken images
- [ ] No 404 errors

### Build Process
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] dist/ folder created
- [ ] dist/index.html exists
- [ ] dist/ contains all necessary files

### Performance Optimization
- [ ] CSS minified in build
- [ ] JavaScript minified in build
- [ ] Source maps generated
- [ ] Images optimized

---

## 📋 Final Checklist

### Before Going Live
- [ ] All features tested
- [ ] All error cases handled
- [ ] All pages responsive
- [ ] API integration verified
- [ ] Performance acceptable
- [ ] Browser compatibility checked
- [ ] Documentation complete
- [ ] Build process works

### Deployment
- [ ] Backend deployed and running
- [ ] Frontend build ready
- [ ] CORS properly configured
- [ ] API endpoints verified
- [ ] Database migrations complete
- [ ] Environment variables set

---

## 🎉 Testing Complete

Once all checkboxes are checked:

```bash
# Build for production
npm run build

# Deploy dist/ folder to server
# Update API base URL if needed
```

---

## 📝 Test Results Template

| Test Category | Status | Notes |
|---------------|--------|-------|
| Installation | ✅/❌ | |
| Dashboard | ✅/❌ | |
| Residents | ✅/❌ | |
| Houses | ✅/❌ | |
| Payments | ✅/❌ | |
| Reports | ✅/❌ | |
| API Integration | ✅/❌ | |
| Error Handling | ✅/❌ | |
| Performance | ✅/❌ | |
| Responsiveness | ✅/❌ | |
| **OVERALL** | ✅/❌ | |

---

## ✅ Test Sign-Off

- **Tester Name:** _________________
- **Date:** _________________
- **Status:** [ ] PASS [ ] FAIL
- **Comments:** ________________

---

**Ready to launch when all items are ✅**

Skill Fit Test - Jagoan Hosting Apprentice 2026
