import { useAuth } from "../../context/AuthContext";

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <span className="hamburger-icon" onClick={toggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </span>
      </div>
      
      {/* User Profile Area */}
      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="user-info" style={{ textAlign: 'right' }}>
            <span className="user-name" style={{ display: 'block', fontWeight: 'bold' }}>{user?.name || 'User'}</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Administrator</span>
          </div>
          <div className="user-icon" style={{ marginLeft: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>
      </div>
    </header>
  );
}