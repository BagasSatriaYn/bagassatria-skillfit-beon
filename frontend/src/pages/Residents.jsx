import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { residentsAPI } from '../services/api';
import ResidentsList from '../components/ResidentsList';
import ResidentForm from '../components/ResidentForm';

export default function Residents() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      setLoading(true);
      const res = await residentsAPI.getAll();
      
      // Berdasarkan pola API pada umumnya:
      // res.data adalah body response dari Axios
      // res.data.data biasanya adalah array hasil dari backend
      const result = res.data.data || res.data; 
      
      setResidents(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err) {
      console.error("Load Error:", err);
      setError('Gagal memuat data penghuni');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus penghuni ini?')) return;
    
    try {
      await residentsAPI.delete(id);
      setResidents(residents.filter(r => r.id !== id));
      setError(null);
    } catch (err) {
      setError('Gagal menghapus penghuni: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async (formData, id) => {
    try {
      setLoading(true); // Tampilkan loading saat proses simpan
      
      if (id) {
        await residentsAPI.update(id, formData);
      } else {
        await residentsAPI.create(formData);
      }

      // 1. Ambil data terbaru dari server
      await loadResidents(); 
      
      // 2. Bersihkan error dan pindah halaman
      setError(null);
      navigate('/residents');
    } catch (err) {
      console.error("Save Error:", err);
      setError('Gagal menyimpan penghuni: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Routes>
        <Route 
          path="/" 
          element={
            <ResidentsList 
              residents={residents}
              loading={loading}
              error={error}
              onDelete={handleDelete}
            />
          } 
        />
        <Route 
          path="/add" 
          element={
            <ResidentForm 
              onSave={handleSave}
              error={error}
            />
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            <ResidentForm 
              residents={residents}
              onSave={handleSave}
              error={error}
            />
          } 
        />
      </Routes>
    </div>
  );
}
