import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentReport({ payments, loading, error }) {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Monthly Summary for the selected year
  const monthlyData = useMemo(() => {
    const data = {};
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    months.forEach(month => {
      const monthStr = `${selectedYear}-${String(month).padStart(2, '0')}`;
      const monthPayments = payments.filter(p => p.due_month?.startsWith(monthStr));
      
      const lunas = monthPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      
      const belum = monthPayments
        .filter(p => p.status !== 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      data[month] = {
        lunas,
        belum,
        total: lunas + belum,
        count: monthPayments.length,
      };
    });

    return data;
  }, [payments, selectedYear]);

  // Monthly Detail for selected month
  const monthlyDetail = useMemo(() => {
    return payments.filter(p => p.due_month?.startsWith(selectedMonth));
  }, [payments, selectedMonth]);

  const yearTotal = useMemo(() => {
    const lunas = Object.values(monthlyData).reduce((sum, m) => sum + m.lunas, 0);
    const belum = Object.values(monthlyData).reduce((sum, m) => sum + m.belum, 0);
    return { lunas, belum, total: lunas + belum };
  }, [monthlyData]);

  const monthTotal = useMemo(() => {
    const lunas = monthlyDetail
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const belum = monthlyDetail
      .filter(p => p.status !== 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    return { lunas, belum, total: lunas + belum };
  }, [monthlyDetail]);

  if (loading) {
    return <div className="loading">⏳ Memuat data laporan...</div>;
  }

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div>
      {error && <div className="error">⚠️ {error}</div>}

      {/* Yearly Summary */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📊 Laporan Keuangan Tahunan</h2>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/payments')}
          >
            ⬅ Kembali ke Pembayaran
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: 500 }}>
            Pilih Tahun:
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3>Total Lunas</h3>
              <p className="value" style={{ color: 'var(--color-accent-success)' }}>
                Rp {yearTotal.lunas.toLocaleString('id-ID')}
              </p>
              <p className="sub-text">Total setoran masuk</p>
            </div>
            <div className="stat-card-icon icon-bg-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3>Belum Lunas</h3>
              <p className="value" style={{ color: 'var(--color-accent-warning)' }}>
                Rp {yearTotal.belum.toLocaleString('id-ID')}
              </p>
              <p className="sub-text">Piutang iuran</p>
            </div>
            <div className="stat-card-icon icon-bg-warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3>Total Pemasukan</h3>
              <p className="value">Rp {yearTotal.total.toLocaleString('id-ID')}</p>
              <p className="sub-text">Akumulasi pendapatan</p>
            </div>
            <div className="stat-card-icon icon-bg-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            </div>
          </div>
        </div>

        <h3>Ringkasan Per Bulan</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Lunas</th>
                <th>Belum Lunas</th>
                <th>Total</th>
                <th>Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {monthNames.map((name, idx) => {
                const month = idx + 1;
                const data = monthlyData[month];
                return (
                  <tr key={month}>
                    <td>{name} {selectedYear}</td>
                    <td>Rp {data.lunas.toLocaleString('id-ID')}</td>
                    <td>Rp {data.belum.toLocaleString('id-ID')}</td>
                    <td><strong>Rp {data.total.toLocaleString('id-ID')}</strong></td>
                    <td>{data.count} transaksi</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Detail */}
      <div className="card">
        <div className="card-header">
          <h2>📋 Detail Pembayaran Bulan</h2>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: 500 }}>
            Pilih Bulan:
            <input 
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            />
          </label>
        </div>

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3>Total Lunas</h3>
              <p className="value" style={{ color: 'var(--color-accent-success)' }}>
                Rp {monthTotal.lunas.toLocaleString('id-ID')}
              </p>
              <p className="sub-text">Bulan berjalan</p>
            </div>
            <div className="stat-card-icon icon-bg-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3>Belum Lunas</h3>
              <p className="value" style={{ color: 'var(--color-accent-warning)' }}>
                Rp {monthTotal.belum.toLocaleString('id-ID')}
              </p>
              <p className="sub-text">Bulan berjalan</p>
            </div>
            <div className="stat-card-icon icon-bg-warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <h3>Total Pemasukan</h3>
              <p className="value">Rp {monthTotal.total.toLocaleString('id-ID')}</p>
              <p className="sub-text">Bulan berjalan</p>
            </div>
            <div className="stat-card-icon icon-bg-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            </div>
          </div>
        </div>

        {monthlyDetail.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            Tidak ada data pembayaran untuk bulan ini.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Penghuni</th>
                  <th>Jenis Iuran</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody>
                {monthlyDetail.map((payment, idx) => (
                  <tr key={idx}>
                    <td>{payment.resident?.full_name || '-'}</td>
                    <td>{payment.due_type === 'security' ? 'Satpam' : 'Kebersihan'}</td>
                    <td>Rp {payment.amount?.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge ${
                        payment.status === 'paid' ? 'badge-success' : 
                        payment.status === 'partial' ? 'badge-info' : 'badge-warning'
                      }`} style={payment.status === 'partial' ? { backgroundColor: '#3B82F6', color: 'white' } : {}}>
                        {payment.status === 'paid' ? 'Lunas' : 
                         payment.status === 'partial' ? 'Cicilan' : 'Belum Lunas'}
                      </span>
                    </td>
                    <td>
                      {payment.payments && payment.payments.length > 0 
                        ? new Date(payment.payments[0].payment_date).toLocaleDateString('id-ID') 
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
