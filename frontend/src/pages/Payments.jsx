import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/api';
import PaymentsList from '../components/PaymentsList';
import PaymentForm from '../components/PaymentForm';
import PaymentReport from '../components/PaymentReport';

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentsAPI.getAll();
      setPayments(res.data.data || []);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data pembayaran: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) return;
    
    try {
      await paymentsAPI.delete(id);
      setPayments(payments.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError('Gagal menghapus pembayaran: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async (data, id) => {
    try {
      if (id) {
        await paymentsAPI.update(id, data);
      } else {
        await paymentsAPI.create(data);
      }
      await loadPayments();
      navigate('/payments');
      setError(null);
    } catch (err) {
      setError('Gagal menyimpan pembayaran: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Routes>
        <Route 
          path="/" 
          element={
            <PaymentsList 
              payments={payments}
              loading={loading}
              error={error}
              onDelete={handleDelete}
            />
          } 
        />
        <Route 
          path="/add" 
          element={
            <PaymentForm 
              onSave={handleSave}
              error={error}
            />
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            <PaymentForm 
              payments={payments}
              onSave={handleSave}
              error={error}
            />
          } 
        />
        <Route 
          path="/report" 
          element={
            <PaymentReport 
              payments={payments}
              loading={loading}
              error={error}
            />
          } 
        />
      </Routes>
    </div>
  );
}
