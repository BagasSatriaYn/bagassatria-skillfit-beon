import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../services/api';

export default function ExpenseReport({ year }) {
  const navigate = useNavigate();
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
      setError('Gagal memuat data pengeluaran dari server.');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  if (loading) {
    return <div className="loading">⏳ Memuat data pengeluaran...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>💸 Detail Pengeluaran</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/expenses/new')}
        >
          + Tambah Pengeluaran
        </button>
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
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
          Tidak ada data pengeluaran untuk bulan ini.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Nama Pengeluaran</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{new Date(expense.expense_date).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={`badge ${expense.expense_category === 'Rutin' ? 'badge-info' : 'badge-warning'}`}>
                      {expense.expense_category}
                    </span>
                  </td>
                  <td>{expense.description || '-'}</td>
                  <td>Rp {expense.amount?.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
