import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { housesAPI } from '../services/api';
import HousesList from '../components/HousesList';
import HouseForm from '../components/HouseForm';
import HouseDetail from '../components/HouseDetail';

export default function Houses() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = async () => {
    try {
      setLoading(true);
      const res = await housesAPI.getAll();
      setHouses(res.data.data || res.data || []);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data rumah: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus rumah ini?')) return;
    
    try {
      await housesAPI.delete(id);
      setHouses(houses.filter(h => h.id !== id));
      setError(null);
    } catch (err) {
      setError('Gagal menghapus rumah: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async (data, id) => {
    try {
      if (id) {
        await housesAPI.update(id, data);
      } else {
        await housesAPI.create(data);
      }
      await loadHouses();
      navigate('/houses');
      setError(null);
    } catch (err) {
      setError('Gagal menyimpan rumah: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Routes>
        <Route 
          path="/" 
          element={
            <HousesList 
              houses={houses}
              loading={loading}
              error={error}
              onDelete={handleDelete}
            />
          } 
        />
        <Route 
          path="/add" 
          element={
            <HouseForm 
              onSave={handleSave}
              error={error}
            />
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            <HouseForm 
              houses={houses}
              onSave={handleSave}
              error={error}
            />
          } 
        />
        <Route 
          path="/detail/:id" 
          element={
            <HouseDetail 
              houses={houses}
              onRefresh={loadHouses}
            />
          } 
        />
      </Routes>
    </div>
  );
}
