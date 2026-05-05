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

  const totalRevenue = payments.reduce((sum, p) => {
    const paid = p.payments?.reduce((s, pay) => s + pay.amount_paid, 0) || 0;
    return sum + paid;
  }, 0);
  
  const lunas = payments.filter(p => p.status === 'paid').length;
  const cicilan = payments.filter(p => p.status === 'partial').length;
  const belumLunas = payments.filter(p => p.status === 'unpaid').length;

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

      <div className="grid-4" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Total Masuk</h3>
            <p className="value">Rp {totalRevenue.toLocaleString('id-ID')}</p>
            <p className="sub-text">Dana terkumpul</p>
          </div>
          <div className="stat-card-icon icon-bg-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Lunas</h3>
            <p className="value" style={{ color: 'var(--color-accent-success)' }}>{lunas}</p>
            <p className="sub-text">Tagihan selesai</p>
          </div>
          <div className="stat-card-icon icon-bg-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Cicilan</h3>
            <p className="value" style={{ color: '#3B82F6' }}>{cicilan}</p>
            <p className="sub-text">Proses bayar</p>
          </div>
          <div className="stat-card-icon" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '10px', borderRadius: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Belum Bayar</h3>
            <p className="value" style={{ color: 'var(--color-accent-warning)' }}>{belumLunas}</p>
            <p className="sub-text">Sama sekali belum</p>
          </div>
          <div className="stat-card-icon icon-bg-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className={`badge ${
                        payment.status === 'paid' ? 'badge-success' : 
                        payment.status === 'partial' ? 'badge-info' : 'badge-warning'
                      }`} style={payment.status === 'partial' ? { backgroundColor: '#3B82F6', color: 'white' } : {}}>
                        {payment.status === 'paid' ? 'Lunas' : 
                         payment.status === 'partial' ? 'Cicilan' : 'Belum Lunas'}
                      </span>
                      {payment.status !== 'paid' && (
                        <small style={{ color: '#64748B', fontSize: '0.75rem' }}>
                          Kurang: Rp {(payment.amount - (payment.payments?.reduce((sum, p) => sum + p.amount_paid, 0) || 0)).toLocaleString('id-ID')}
                        </small>
                      )}
                    </div>
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
