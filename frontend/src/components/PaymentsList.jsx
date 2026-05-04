import { useNavigate } from 'react-router-dom';

export default function PaymentsList({ payments, loading, error, onDelete }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">⏳ Memuat data pembayaran...</div>;
  }

  const totalRevenue = payments.reduce((sum, p) => sum + (p.jumlah || 0), 0);
  const lunas = payments.filter(p => p.status === 'lunas').length;
  const belumLunas = payments.filter(p => p.status === 'belum').length;

  return (
    <div className="card">
      <div className="card-header">
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

      {error && <div className="error">⚠️ {error}</div>}

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <h3>Total Pembayaran</h3>
          <p className="value">Rp {totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="stat-card success">
          <h3>Lunas</h3>
          <p className="value">{lunas}</p>
        </div>
        <div className="stat-card warning">
          <h3>Belum Lunas</h3>
          <p className="value">{belumLunas}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Tidak ada data pembayaran. Mulai dengan menambahkan pembayaran baru.
        </p>
      ) : (
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
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.resident?.nama_lengkap || '-'}</td>
                <td>{payment.jenis_iuran}</td>
                <td>{payment.bulan}</td>
                <td>Rp {payment.jumlah?.toLocaleString('id-ID')}</td>
                <td>
                  <span className={`badge ${
                    payment.status === 'lunas' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td>{payment.tanggal_bayar ? new Date(payment.tanggal_bayar).toLocaleDateString('id-ID') : '-'}</td>
                <td>
                  <div className="action-buttons">
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
      )}
    </div>
  );
}
