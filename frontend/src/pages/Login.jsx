import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/wargahub(1).png'; // Pastikan logo teks WargaHub kamu transparan

export default function Login() {
  const [email, setEmail] = useState('admin@rt.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Kredensial salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#F4F7F6', // Sesuai var(--color-bg-body)
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="login-card" style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB'
      }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            backgroundColor: '#0D4E2D', // Hijau Tua Sidebar
            padding: '20px',
            borderRadius: '12px',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            <img src={logo} alt="WargaHub Logo" style={{ height: '40px', display: 'block' }} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
            Selamat Datang
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>
            Silakan masuk ke Panel Administrasi RT
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '0.875rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center',
            border: '1px solid #FECACA'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Adress
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0D4E2D';
                e.target.style.boxShadow = '0 0 0 4px rgba(13, 78, 45, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0D4E2D';
                e.target.style.boxShadow = '0 0 0 4px rgba(13, 78, 45, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#FF6600', // Warna Oranye Sidebar Aktif
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(255, 102, 0, 0.2)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#E65C00'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FF6600'}
          >
            {loading ? 'Memproses...' : 'MASUK KE DASHBOARD'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>
          &copy; 2026 <strong>WargaHub</strong>. Sistem Informasi Smart RT.
        </div>
      </div>
    </div>
  );
}