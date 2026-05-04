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
    nomor_rumah: '',
    status: 'kosong',
    alamat: '',
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
      setResidents(res.data.data || []);
    } catch (err) {
      console.error('Gagal memuat penghuni:', err);
    }
  };

  const loadHouse = async () => {
    try {
      const house = houses.find(h => h.id == id);
      if (house) {
        setFormData({
          nomor_rumah: house.nomor_rumah,
          status: house.status,
          alamat: house.alamat,
          resident_id: house.residents?.[0]?.id || '',
        });
      } else {
        const res = await housesAPI.get(id);
        setFormData({
          nomor_rumah: res.data.data.nomor_rumah,
          status: res.data.data.status,
          alamat: res.data.data.alamat,
          resident_id: res.data.data.residents?.[0]?.id || '',
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
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nomor_rumah || !formData.alamat) {
      setError('Nomor rumah dan alamat harus diisi');
      return;
    }

    await onSave(formData, id);
  };

  if (loading) {
    return <div className="loading">⏳ Memuat data...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{id ? '✏️ Edit Rumah' : '➕ Tambah Rumah'}</h2>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nomor Rumah *</label>
            <input
              type="text"
              name="nomor_rumah"
              value={formData.nomor_rumah}
              onChange={handleChange}
              placeholder="Contoh: 01, 02, A1"
              required
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="kosong">Kosong</option>
              <option value="dihuni">Dihuni</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Alamat *</label>
          <input
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Contoh: Jl. Merdeka No. 1"
            required
          />
        </div>

        <div className="form-group">
          <label>Penghuni (Opsional)</label>
          <select
            name="resident_id"
            value={formData.resident_id}
            onChange={handleChange}
          >
            <option value="">-- Pilih Penghuni --</option>
            {residents.map(resident => (
              <option key={resident.id} value={resident.id}>
                {resident.nama_lengkap}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
