import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { residentsAPI } from '../services/api';
const STORAGE_URL = 'http://localhost:8000/storage/';

export default function ResidentForm({ onSave, error: propError, residents = [] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(propError);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    status: 'permanent',
    is_married: false,
    ktp_photo: null,
    preview_url: null, // Untuk menampung preview blob lokal
  });

  useEffect(() => {
    if (id) {
      loadResident();
    }
    // Cleanup URL preview untuk mencegah memory leak
    return () => {
      if (formData.preview_url) URL.revokeObjectURL(formData.preview_url);
    };
  }, [id]);

  useEffect(() => {
    setError(propError);
  }, [propError]);

  const loadResident = async () => {
    try {
      const resident = residents.find(r => r.id == id);
      let data;
      
      if (resident) {
        data = resident;
      } else {
        const res = await residentsAPI.get(id);
        data = res.data.data;
      }

      setFormData({
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
        status: data.status || 'permanent',
        is_married: !!data.is_married,
        // Cek apakah sudah berupa URL lengkap atau baru nama filenya saja
        ktp_photo: data.ktp_photo 
            ? (data.ktp_photo.startsWith('http') ? data.ktp_photo : `${STORAGE_URL}${data.ktp_photo}`) 
            : null,
        preview_url: null
        });
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data penghuni: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Buat preview URL sementara
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        ktp_photo: file, // Simpan objek File asli untuk dikirim ke API
        preview_url: url
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  const submissionData = new FormData();
  
  // 1. Tambahkan data teks
  submissionData.append('full_name', formData.full_name);
  submissionData.append('phone_number', formData.phone_number);
  submissionData.append('status', formData.status);
  
  // 2. Pastikan is_married dikirim sebagai string '1' atau '0' agar Laravel memvalidasi sebagai boolean
  submissionData.append('is_married', formData.is_married ? '1' : '0');
  
  // 3. Logika File KTP
  if (formData.ktp_photo instanceof File) {
    submissionData.append('ktp_photo', formData.ktp_photo);
  }

  // 4. CRITICAL: Method Spoofing untuk Update
  // Ditangani otomatis oleh interceptor/helper api.js

  try {
    // Kirim submissionData langsung
    await onSave(submissionData, id);
  } catch (err) {
    // Jika ada error validasi dari Laravel (422), ambil pesan error detailnya
    const serverMessage = err.response?.data?.errors 
      ? Object.values(err.response.data.errors).flat().join(', ')
      : err.response?.data?.message;
      
    setError(serverMessage || 'Gagal menyimpan data');
  }
};

  if (loading) return <div className="loading">⏳ Memuat data...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2>{id ? '✏️ Edit Penghuni' : '➕ Tambah Penghuni'}</h2>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nomor Telepon *</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status Penghuni *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="permanent">Tetap</option>
              <option value="contract">Kontrak</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status Perkawinan *</label>
            <select
              name="is_married"
              value={formData.is_married ? 'true' : 'false'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                is_married: e.target.value === 'true'
              }))}
              required
            >
              <option value="false">Belum Menikah</option>
              <option value="true">Sudah Menikah</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Foto KTP</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          
          {/* Tampilan Preview: Prioritaskan preview lokal, lalu URL dari database */}
          {(formData.preview_url || (typeof formData.ktp_photo === 'string' && formData.ktp_photo)) && (
            <div style={{ marginTop: '1rem' }}>
              <img 
                src={formData.preview_url || formData.ktp_photo} 
                alt="KTP Preview" 
                style={{ maxWidth: '200px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/residents')}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            {id ? 'Simpan Perubahan' : 'Tambah Penghuni'}
          </button>
        </div>
      </form>
    </div>
  );
}