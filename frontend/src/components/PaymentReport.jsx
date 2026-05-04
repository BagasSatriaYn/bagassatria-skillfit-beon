import { useState, useMemo } from 'react';

export default function PaymentReport({ payments, loading, error }) {
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
      const monthPayments = payments.filter(p => p.bulan?.startsWith(monthStr));
      
      const lunas = monthPayments
        .filter(p => p.status === 'lunas')
        .reduce((sum, p) => sum + (p.jumlah || 0), 0);
      
      const belum = monthPayments
        .filter(p => p.status === 'belum')
        .reduce((sum, p) => sum + (p.jumlah || 0), 0);

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
    return payments.filter(p => p.bulan?.startsWith(selectedMonth));
  }, [payments, selectedMonth]);

  const yearTotal = useMemo(() => {
    const lunas = Object.values(monthlyData).reduce((sum, m) => sum + m.lunas, 0);
    const belum = Object.values(monthlyData).reduce((sum, m) => sum + m.belum, 0);
    return { lunas, belum, total: lunas + belum };
  }, [monthlyData]);

  const monthTotal = useMemo(() => {
    const lunas = monthlyDetail
      .filter(p => p.status === 'lunas')
      .reduce((sum, p) => sum + (p.jumlah || 0), 0);
    const belum = monthlyDetail
      .filter(p => p.status === 'belum')
      .reduce((sum, p) => sum + (p.jumlah || 0), 0);
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
        <div className="card-header">
          <h2>📊 Laporan Keuangan Tahunan</h2>
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
          <div className="stat-card success">
            <h3>Total Lunas</h3>
            <p className="value">Rp {yearTotal.lunas.toLocaleString('id-ID')}</p>
          </div>
          <div className="stat-card warning">
            <h3>Belum Lunas</h3>
            <p className="value">Rp {yearTotal.belum.toLocaleString('id-ID')}</p>
          </div>
          <div className="stat-card">
            <h3>Total Pemasukan</h3>
            <p className="value">Rp {yearTotal.total.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <h3>Ringkasan Per Bulan</h3>
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
          <div className="stat-card success">
            <h3>Total Lunas</h3>
            <p className="value">Rp {monthTotal.lunas.toLocaleString('id-ID')}</p>
          </div>
          <div className="stat-card warning">
            <h3>Belum Lunas</h3>
            <p className="value">Rp {monthTotal.belum.toLocaleString('id-ID')}</p>
          </div>
          <div className="stat-card">
            <h3>Total Pemasukan</h3>
            <p className="value">Rp {monthTotal.total.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {monthlyDetail.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Tidak ada data pembayaran untuk bulan ini.
          </p>
        ) : (
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
                  <td>{payment.resident?.nama_lengkap || '-'}</td>
                  <td>{payment.jenis_iuran}</td>
                  <td>Rp {payment.jumlah?.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge ${
                      payment.status === 'lunas' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.tanggal_bayar ? new Date(payment.tanggal_bayar).toLocaleDateString('id-ID') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
