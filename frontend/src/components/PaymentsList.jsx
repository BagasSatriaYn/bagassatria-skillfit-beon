import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentsList({ payments, loading, error, onDelete }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = payments.filter(payment => 
    payment.resident?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.house?.house_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner"></div>
        <p>⏳ Memuat data pembayaran...</p>
      </div>
    );
  }

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const lunas = payments.filter(p => p.status === 'paid').length;
  const belumLunas = payments.filter(p => p.status !== 'paid').length;

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>💰 Daftar Pembayaran</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/payments/add')}
          >
            + Tambah Pembayaran
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/payments/report')}
          >
            📊 Laporan
          </button>
        </div>
      </div>

      {error && <div className="error" style={{ margin: '1rem' }}>⚠️ {error}</div>}

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Total Pembayaran</h3>
            <p className="value">Rp {totalRevenue.toLocaleString('id-ID')}</p>
            <p className="sub-text">Total seluruh transaksi</p>
          </div>
          <div className="stat-card-icon icon-bg-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Lunas</h3>
            <p className="value" style={{ color: 'var(--color-accent-success)' }}>{lunas}</p>
            <p className="sub-text">Transaksi berhasil</p>
          </div>
          <div className="stat-card-icon icon-bg-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Belum Lunas</h3>
            <p className="value" style={{ color: 'var(--color-accent-warning)' }}>{belumLunas}</p>
            <p className="sub-text">Transaksi tertunda</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Cari nama penghuni atau nomor rumah..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px 10px 40px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-success)'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
          <svg 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {!Array.isArray(payments) || payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <p>Tidak ada data pembayaran.</p>
          <small>Mulai dengan menambahkan data pembayaran baru.</small>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Penghuni</th>
                <th>Jenis Iuran</th>
                <th>Bulan</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Tanggal Bayar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id}>
                  <td><strong>{payment.resident?.full_name || '-'}</strong></td>
                  <td>{payment.due_type === 'security' ? 'Satpam' : 'Kebersihan'}</td>
                  <td>{payment.due_month?.substring(0, 7)}</td>
                  <td>Rp {payment.amount?.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge ${
                      payment.status === 'paid' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {payment.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </td>
                  <td>
                    {payment.payments && payment.payments.length > 0 
                      ? new Date(payment.payments[0].payment_date).toLocaleDateString('id-ID') 
                      : '-'}
                  </td>
                  <td>
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/payments/edit/${payment.id}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(payment.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
