# 🏗️ Frontend Architecture Guide

Panduan lengkap tentang struktur, arsitektur, dan cara develop aplikasi Smart RT Dashboard.

## 📐 Aplikasi Architecture

```
┌─────────────────────────────────────────────┐
│          Browser / User Interface           │
├─────────────────────────────────────────────┤
│                  React App                  │
│  ┌───────────────────────────────────────┐  │
│  │  App.jsx (Router + Navbar)            │  │
│  └─────────────┬───────────────────────┬┘  │
│                │                       │    │
│         ┌──────▼──────┐         ┌──────▼──────┐
│         │ Pages Layer │         │ Components  │
│         ├─────────────┤         ├─────────────┤
│         │Dashboard    │         │Lists        │
│         │Residents    │         │Forms        │
│         │Houses       │         │Details      │
│         │Payments     │         │Charts       │
│         │Reports      │         │Reports      │
│         └──────┬──────┘         └──────┬──────┘
│                │                       │
│         ┌──────▼───────────────────────▼──────┐
│         │       Services (API Client)        │
│         │   axios + API endpoint configs     │
│         └──────┬──────────────────────────┬──┘
│                │                          │
│  ┌─────────────▼─────────────────────────▼──┐
│  │    HTTP Requests to Backend API           │
│  └─────────────────────────────────────────┘
│
└─────────────────────────────────────────────┘
          │
          │ (Network)
          │
┌─────────▼─────────────────────────────────────┐
│        Backend (Laravel API)                  │
│  - Residents endpoints                        │
│  - Houses endpoints                           │
│  - Payments endpoints                         │
│  - Reports endpoints                          │
│  - Dashboard endpoint                         │
└───────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
frontend/src/
│
├── pages/                      # Page components (full-screen views)
│   ├── Dashboard.jsx           # 📊 Dashboard overview
│   ├── Residents.jsx           # 👥 Residents management
│   ├── Houses.jsx              # 🏠 Houses management
│   ├── Payments.jsx            # 💰 Payments management
│   └── Reports.jsx             # 📈 Financial reports
│
├── components/                 # Reusable components
│   ├── ResidentsList.jsx       # List residents table
│   ├── ResidentForm.jsx        # Add/Edit resident form
│   ├── HousesList.jsx          # List houses table
│   ├── HouseForm.jsx           # Add/Edit house form
│   ├── HouseDetail.jsx         # House detail + history
│   ├── PaymentsList.jsx        # List payments table
│   ├── PaymentForm.jsx         # Add/Edit payment form
│   ├── PaymentReport.jsx       # Monthly/yearly report
│   ├── FinancialChart.jsx      # Charts visualization
│   └── ExpenseReport.jsx       # Expense details
│
├── services/                   # API & utilities
│   └── api.js                  # Axios instance + endpoints
│
├── App.jsx                     # Main app with routing
├── App.css                     # Global styles
├── main.jsx                    # Entry point
├── index.css                   # Base CSS
│
└── assets/                     # Static assets (images, icons, etc)
```

---

## 🔄 Data Flow

### Add New Resident Flow

```
User Input
   │
   ▼
ResidentForm Component
   │
   ├─ State: formData
   ├─ handleChange: Update form
   └─ handleSubmit: Submit form
   │
   ▼
Residents Page (Parent)
   │
   └─ handleSave method
   │
   ▼
API Service (api.js)
   │
   └─ residentsAPI.create(data)
   │
   ▼
HTTP POST to Backend
   │
   ▼
Database
   │
   ▼
Success / Error Response
   │
   ▼
Reload Residents List
   │
   ▼
Navigate to /residents
```

---

## 🔌 API Service Pattern

### Structure

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Grouped API calls
export const residentsAPI = {
  getAll: () => api.get('/residents'),
  get: (id) => api.get(`/residents/${id}`),
  create: (data) => api.post('/residents', data),
  update: (id, data) => api.put(`/residents/${id}`, data),
  delete: (id) => api.delete(`/residents/${id}`),
};
```

### Usage in Components

```javascript
import { residentsAPI } from '../services/api';

// Get all residents
const residents = await residentsAPI.getAll();

// Get single resident
const resident = await residentsAPI.get(1);

// Create new resident
await residentsAPI.create({
  nama_lengkap: 'John Doe',
  nomor_telepon: '081234567890',
  status: 'tetap',
  status_perkawinan: 'sudah'
});

// Update resident
await residentsAPI.update(1, { nama_lengkap: 'Jane Doe' });

// Delete resident
await residentsAPI.delete(1);
```

---

## 🎯 Common Patterns

### Pattern 1: List Page

```jsx
// Page component (Residents.jsx)
export default function Residents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await residentsAPI.getAll();
      setItems(res.data.data || []);
      setError(null);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin?')) return;
    try {
      await residentsAPI.delete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Delete error: ' + err.message);
    }
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={
          <ResidentsList 
            items={items}
            loading={loading}
            error={error}
            onDelete={handleDelete}
          />
        } />
      </Routes>
    </div>
  );
}
```

### Pattern 2: Form Component

```jsx
export default function ResidentForm({ onSave, error: propError }) {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nomor_telepon: '',
    status: 'tetap',
    status_perkawinan: 'belum',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nama_lengkap) {
      setError('Nama harus diisi');
      return;
    }

    // Call parent handler
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nama Lengkap</label>
        <input
          name="nama_lengkap"
          value={formData.nama_lengkap}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Simpan</button>
    </form>
  );
}
```

### Pattern 3: List Table Component

```jsx
export default function ResidentsList({ items, loading, error, onDelete }) {
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="card">
      {error && <div className="error">{error}</div>}
      
      <table className="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Telepon</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.nama_lengkap}</td>
              <td>{item.nomor_telepon}</td>
              <td>
                <span className="badge badge-success">
                  {item.status}
                </span>
              </td>
              <td>
                <button onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🚀 How to Add New Feature

### Example: Add New Payment Type

#### Step 1: Update API Service
```javascript
// src/services/api.js
export const paymentsAPI = {
  // ... existing
  getTypes: () => api.get('/payments/types'),
};
```

#### Step 2: Update Form Component
```jsx
// src/components/PaymentForm.jsx
const [paymentTypes, setPaymentTypes] = useState([]);

useEffect(() => {
  loadPaymentTypes();
}, []);

const loadPaymentTypes = async () => {
  try {
    const res = await paymentsAPI.getTypes();
    setPaymentTypes(res.data.data);
  } catch (err) {
    console.error(err);
  }
};

// In JSX
<select name="jenis_iuran" value={formData.jenis_iuran}>
  {paymentTypes.map(type => (
    <option key={type.id} value={type.id}>
      {type.nama} (Rp {type.jumlah})
    </option>
  ))}
</select>
```

#### Step 3: Update List Component
```jsx
// src/components/PaymentsList.jsx
// Just display the payment type from API response
<td>{payment.jenis_iuran}</td>
```

---

## 🎨 Styling Guide

### Global Classes

```css
/* Buttons */
.btn              /* Base button */
.btn-primary      /* Main action (purple) */
.btn-secondary    /* Secondary (gray) */
.btn-success      /* Success (green) */
.btn-danger       /* Delete (red) */
.btn-sm           /* Small button */

/* Cards */
.card             /* White container with shadow */
.card-header      /* Card title area */
.stat-card        /* Statistical display */
.stat-card.success
.stat-card.danger
.stat-card.warning

/* Tables */
.table            /* Data table */
.table thead
.table th
.table td

/* Forms */
.form-group       /* Input wrapper */
.form-row         /* Grid of inputs */

/* Grids */
.grid-2           /* 2 column grid */
.grid-3           /* 3 column grid */

/* Status */
.badge            /* Status badge */
.badge-success    /* Green badge */
.badge-warning    /* Yellow badge */
.badge-danger     /* Red badge */
.badge-info       /* Blue badge */

/* Alerts */
.error            /* Red alert */
.success          /* Green alert */
.loading          /* Loading spinner */
```

### Color Variables
```css
Primary: #667eea
Secondary: #764ba2
Success: #28a745
Danger: #dc3545
Warning: #ffc107
Info: #0c5460
Background: #f5f5f5
Border: #ddd
Text: #333
```

---

## 🔧 Debugging Tips

### 1. Check API Response
```javascript
try {
  const res = await residentsAPI.getAll();
  console.log('API Response:', res.data);
} catch (err) {
  console.error('API Error:', err.response?.data || err.message);
}
```

### 2. Monitor State Changes
```javascript
useEffect(() => {
  console.log('Items changed:', items);
}, [items]);
```

### 3. Check Routing
```javascript
// In browser console
import { useLocation } from 'react-router-dom';
const location = useLocation();
console.log('Current path:', location.pathname);
```

### 4. Network Tab
- Open DevTools (F12)
- Go to Network tab
- Watch API calls
- Check request/response

---

## 📝 Code Style

### File Naming
- Pages: `PascalCase.jsx` (Dashboard.jsx)
- Components: `PascalCase.jsx` (ResidentsList.jsx)
- Services: `camelCase.js` (api.js)
- CSS: `camelCase.css` (App.css)

### Component Structure
```jsx
import React, { useState, useEffect } from 'react';

export default function MyComponent({ prop1, prop2 }) {
  // State
  const [data, setData] = useState(null);
  
  // Effects
  useEffect(() => {
    // Load data
  }, []);
  
  // Handlers
  const handleSubmit = () => {};
  
  // Render
  return (
    <div className="card">
      {/* JSX */}
    </div>
  );
}
```

---

## 🚦 Git Workflow

```bash
# Feature branch
git checkout -b feature/add-resident-export

# Make changes
git add .
git commit -m "feat: add resident export functionality"

# Push
git push origin feature/add-resident-export

# Create PR
# After review and merge, delete branch
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.5 | UI framework |
| react-router-dom | 6.20.0 | Routing |
| axios | 1.16.0 | HTTP client |
| chart.js | 4.4.1 | Charts |
| react-chartjs-2 | 5.2.0 | React Charts |
| vite | 8.0.10 | Build tool |

---

## 🚀 Performance Tips

1. **Lazy Load Images**: Use lazy loading for KTP photos
2. **Memoize Components**: Use React.memo for expensive renders
3. **Code Splitting**: Routes automatically code-split with React Router
4. **Minimize Re-renders**: Use useCallback for event handlers
5. **Optimize Lists**: Use keys properly in map()

---

## 🔒 Security Notes

1. **Input Validation**: Always validate user input
2. **XSS Prevention**: React auto-escapes by default
3. **CSRF**: Backend should handle CSRF tokens
4. **API Keys**: Never expose in frontend code
5. **Sensitive Data**: Don't log sensitive info to console

---

## 📚 Further Learning

- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Axios: https://axios-http.com
- Chart.js: https://www.chartjs.org
- Vite: https://vitejs.dev

---

**Happy Coding! 🚀**

Skill Fit Test - Jagoan Hosting Apprentice 2026
