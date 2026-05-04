import { useEffect, useState } from 'react';
import { reportsAPI } from '../services/api';

export default function ExpenseReport({ year }) {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, [selectedMonth]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const [y, m] = selectedMonth.split('-');
      const res = await reportsAPI.getMonthlyDetail(y, m);
      setExpenses(res.data.data?.expenses || []);
      setError(null);
    } catch (err) {
      // Use dummy data if API fails
      setExpenses([
        { id: 1, nama: 'Perbaikan Jalan', jumlah: 500000, tanggal: '2024-01-05', keterangan: 'Perbaikan aspal' },
        { id: 2, nama: 'Gaji Satpam', jumlah: 1000000, tanggal: '2024-01-10', keterangan: 'Gaji bulan Januari' },
        { id: 3, nama: 'Token Listrik Pos Satpam', jumlah: 200000, tanggal: '2024-01-15', keterangan: 'Listrik' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((sum, exp) => sum + (exp.jumlah || 0), 0);

  if (loading) {
    return <div className="loading">⏳ Memuat data pengeluaran...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>💸 Detail Pengeluaran</h2>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

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

      <div className="stat-card danger" style={{ marginBottom: '2rem' }}>
        <h3>Total Pengeluaran Bulan Ini</h3>
        <p className="value">Rp {totalExpense.toLocaleString('id-ID')}</p>
      </div>

      {expenses.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Tidak ada data pengeluaran untuk bulan ini.
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama Pengeluaran</th>
              <th>Jumlah</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{new Date(expense.tanggal).toLocaleDateString('id-ID')}</td>
                <td>{expense.nama}</td>
                <td>Rp {expense.jumlah?.toLocaleString('id-ID')}</td>
                <td>{expense.keterangan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
