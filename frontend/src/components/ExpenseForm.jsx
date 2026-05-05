import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expensesAPI } from '../services/api';

export default function ExpenseForm() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    expense_category: 'Rutin',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mapping ke field backend
      const payload = {
        expense_category: formData.expense_category,
        description: formData.description,
        amount: parseInt(formData.amount),
        expense_date: formData.expense_date,
      };

      await expensesAPI.create(payload);
      // Kembali ke halaman sebelumnya
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header">
        <h2>💸 Tambah Pengeluaran Baru</h2>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama Pengeluaran *</label>
          <input
            type="text"
            name="description"
            placeholder="Misal: Gaji Satpam Januari"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kategori *</label>
            <select
              name="expense_category"
              value={formData.expense_category}
              onChange={handleChange}
              required
            >
              <option value="Rutin">Rutin (Bulanan)</option>
              <option value="Insidental">Insidental / Perbaikan</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tanggal Transaksi *</label>
            <input
              type="date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Nominal (Rp) *</label>
          <input
            type="number"
            name="amount"
            placeholder="Misal: 2000000"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Batal
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Pengeluaran'}
          </button>
        </div>
      </form>
    </div>
  );
}
