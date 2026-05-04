import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import Houses from './pages/Houses';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Semua halaman di bawah ini akan otomatis memiliki Sidebar & Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/residents/*" element={<Residents />} />
        <Route path="/houses/*" element={<Houses />} />
        <Route path="/payments/*" element={<Payments />} />
        <Route path="/reports/*" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;