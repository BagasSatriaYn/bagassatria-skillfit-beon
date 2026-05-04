import { Link, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Pastikan file ini ada
import Navbar from './Navbar';   // Pastikan file ini ada

export default function MainLayout() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Penghuni', path: '/residents', icon: '👥' },
    { label: 'Rumah', path: '/houses', icon: '🏠' },
    { label: 'Pembayaran', path: '/payments', icon: '💳' },
    { label: 'Laporan', path: '/reports', icon: '📑' },
  ];

  return (
    <div className="app-container">
      {/* Kamu bisa memanggil Sidebar/Navbar di sini atau menggabungkan logikanya */}
      <nav className="navbar">
        <div className="nav-brand">
          <h1>🏠 Smart RT</h1>
        </div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="main-content">
        {/* Outlet adalah tempat di mana halaman (Dashboard, Residents, dll) akan muncul */}
        <Outlet />
      </main>
    </div>
  );
}