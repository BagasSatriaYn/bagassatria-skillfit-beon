import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { housesAPI, residentsAPI } from '../services/api';

export default function HouseForm({ onSave, error: propError, houses = [] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(propError);
  const [residents, setResidents] = useState([]);
  
  const [formData, setFormData] = useState({
    house_number: '',
    status: 'empty',
    resident_id: '',
  });

  useEffect(() => {
    loadResidents();
    if (id) {
      loadHouse();
    }
  }, [id]);

  useEffect(() => {
    setError(propError);
  }, [propError]);

  const loadResidents = async () => {
    try {
      const res = await residentsAPI.getAll();
      setResidents(res.data.data || res.data || []);
    } catch (err) {
      console.error('Gagal memuat penghuni:', err);
    }
  };

  const loadHouse = async () => {
    try {
      const house = houses.find(h => h.id == id);
      if (house) {
        setFormData({
          house_number: house.house_number,
          status: house.status,
          resident_id: house.current_resident?.resident_id || '',
        });
      } else {
        const res = await housesAPI.get(id);
        const houseData = res.data.data || res.data;
        setFormData({
          house_number: houseData.house_number,
          status: houseData.status,
          resident_id: houseData.current_resident?.resident_id || '',
        });
      }
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data rumah: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset resident_id jika status berubah jadi empty
      ...(name === 'status' && value === 'empty' ? { resident_id: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.house_number) {
      setError('Nomor rumah harus diisi');
      return;
    }

    if (formData.status === 'occupied' && !formData.resident_id) {
      setError('Nama Penghuni harus dipilih jika rumah dihuni');
      return;
    }

    await onSave(formData, id);
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner"></div>
        <p>⏳ Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{id ? '✏️ Edit Rumah' : '➕ Tambah Rumah'}</h2>
      </div>

      {error && <div className="error" style={{ margin: '1rem' }}>⚠️ {error}</div>}

      <form onSubmit={handleSubmit} style={{ padding: '0 1rem 1rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label>Nomor Rumah *</label>
            <input
              type="text"
              name="house_number"
              value={formData.house_number}
              onChange={handleChange}
              placeholder="Contoh: A1, B2, 05"
              required
            />
            <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Nomor unik untuk setiap rumah.
            </small>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="empty">Kosong</option>
              <option value="occupied">Dihuni</option>
            </select>
          </div>
        </div>

        {formData.status === 'occupied' && (
          <div className="form-group">
            <label>Nama Penghuni *</label>
            <select
              name="resident_id"
              value={formData.resident_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Penghuni --</option>
              {residents.map(resident => (
                <option key={resident.id} value={resident.id}>
                  {resident.full_name} ({resident.status === 'permanent' ? 'Tetap' : 'Kontrak'})
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/houses')}
          >
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            {id ? 'Simpan Perubahan' : 'Tambah Rumah'}
          </button>
        </div>
      </form>
    </div>
  );
}
