import { useNavigate } from 'react-router-dom';

export default function ExpensesList({ expenses, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-header">
        <h2>💸 Data Pengeluaran</h2>
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/expenses/new')}
          >
            + Tambah Pengeluaran
          </button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Belum ada data pengeluaran.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Nama Pengeluaran</th>
                <th>Nominal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={expense.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(expense.expense_date).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={`badge ${expense.expense_category === 'Rutin' ? 'badge-info' : 'badge-warning'}`}>
                      {expense.expense_category}
                    </span>
                  </td>
                  <td>{expense.description || '-'}</td>
                  <td>Rp {expense.amount?.toLocaleString('id-ID')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(expense.id)}
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
