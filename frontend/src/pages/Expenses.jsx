import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ExpensesList from '../components/ExpensesList';
import ExpenseForm from '../components/ExpenseForm';
import { expensesAPI } from '../services/api';

export default function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, [location]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await expensesAPI.getAll();
      setExpenses(res.data.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data pengeluaran');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
      try {
        await expensesAPI.delete(id);
        loadExpenses();
      } catch (err) {
        setError('Gagal menghapus pengeluaran');
      }
    }
  };

  if (loading) return <div className="loading">⏳ Memuat data...</div>;

  return (
    <div className="expenses-container">
      {error && <div className="error">⚠️ {error}</div>}

      <Routes>
        <Route 
          index 
          element={
            <ExpensesList 
              expenses={expenses} 
              onDelete={handleDelete} 
            />
          } 
        />
        <Route 
          path="new" 
          element={<ExpenseForm />} 
        />
      </Routes>
    </div>
  );
}
