import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentsAPI, residentsAPI } from '../services/api';

const CHARGES = {
  satpam: 100000,
  kebersihan: 15000,
};

export default function PaymentForm({ onSave, error: propError, payments = [] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(propError);
  const [residents, setResidents] = useState([]);
  const [formData, setFormData] = useState({
    resident_id: '',
    jenis_iuran: 'satpam',
    bulan: new Date().toISOString().slice(0, 7),
    jumlah: CHARGES.satpam,
    status: 'belum',
    tanggal_bayar: '',
  });

  useEffect(() => {
    loadResidents();
    if (id) {
      loadPayment();
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

  const loadPayment = async () => {
    try {
      const payment = payments.find(p => p.id == id);
      if (payment) {
        setFormData({
          resident_id: payment.resident_id,
          jenis_iuran: payment.jenis_iuran,
          bulan: payment.bulan,
          jumlah: payment.jumlah,
          status: payment.status,
          tanggal_bayar: payment.tanggal_bayar || '',
        });
      } else {
        const res = await paymentsAPI.get(id);
        const payment = res.data.data;
        setFormData({
          resident_id: payment.resident_id,
          jenis_iuran: payment.jenis_iuran,
          bulan: payment.bulan,
          jumlah: payment.jumlah,
          status: payment.status,
          tanggal_bayar: payment.tanggal_bayar || '',
        });
      }
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data pembayaran: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newData = { ...formData, [name]: value };
    
    // Update jumlah based on jenis_iuran
    if (name === 'jenis_iuran') {
      newData.jumlah = CHARGES[value] || 0;
    }
    
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resident_id) {
      setError('Pilih penghuni terlebih dahulu');
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
        <h2>{id ? '✏️ Edit Pembayaran' : '➕ Tambah Pembayaran'}</h2>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Penghuni *</label>
            <select
              name="resident_id"
              value={formData.resident_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Penghuni --</option>
              {residents.map(resident => (
                <option key={resident.id} value={resident.id}>
                  {resident.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Jenis Iuran *</label>
            <select
              name="jenis_iuran"
              value={formData.jenis_iuran}
              onChange={handleChange}
              required
            >
              <option value="satpam">Satpam (Rp 100.000)</option>
              <option value="kebersihan">Kebersihan (Rp 15.000)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bulan *</label>
            <input
              type="month"
              name="bulan"
              value={formData.bulan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Jumlah *</label>
            <input
              type="number"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="belum">Belum Lunas</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tanggal Bayar (jika sudah lunas)</label>
            <input
              type="date"
              name="tanggal_bayar"
              value={formData.tanggal_bayar}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/payments')}
          >
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            {id ? 'Simpan Perubahan' : 'Tambah Pembayaran'}
          </button>
        </div>
      </form>
    </div>
  );
}
