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
  
  // Create mode state
  const [bulkData, setBulkData] = useState({
    resident_id: '',
    start_month: new Date().toISOString().slice(0, 7),
    kebersihan_months: 1,
    satpam_months: 1,
    amount_paid: 115000,
    tanggal_bayar: new Date().toISOString().slice(0, 10),
  });

  // Edit mode state
  const [editData, setEditData] = useState({
    resident_id: '',
    jenis_iuran: 'satpam',
    bulan: '',
    jumlah: 0,
    amount_paid: 0,
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
      let p = payments.find(pay => pay.id == id);
      if (!p) {
        const res = await paymentsAPI.get(id);
        p = res.data.data;
      }
      
      const currentPaid = p.payments?.reduce((sum, pay) => sum + pay.amount_paid, 0) || 0;

      setEditData({
        resident_id: p.resident_id,
        jenis_iuran: p.due_type === 'security' ? 'satpam' : 'kebersihan',
        bulan: p.due_month?.substring(0, 7) || new Date().toISOString().slice(0, 7),
        jumlah: p.amount,
        amount_paid: currentPaid,
        tanggal_bayar: p.payments?.length > 0 ? p.payments[0].payment_date.substring(0, 10) : new Date().toISOString().slice(0, 10),
      });
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data pembayaran: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleBulkChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...bulkData, [name]: value };
    
    // Auto calculate amount_paid if months change
    if (name === 'kebersihan_months' || name === 'satpam_months') {
      const newTotal = (Number(newData.kebersihan_months || 0) * CHARGES.kebersihan) + (Number(newData.satpam_months || 0) * CHARGES.satpam);
      newData.amount_paid = newTotal;
    }
    
    setBulkData(newData);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...editData, [name]: value };
    if (name === 'jenis_iuran') {
      newData.jumlah = CHARGES[value] || 0;
      newData.amount_paid = newData.jumlah;
    }
    setEditData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (id) {
      if (!editData.resident_id) {
        setError('Pilih penghuni terlebih dahulu');
        return;
      }
      await onSave(editData, id);
    } else {
      if (!bulkData.resident_id) {
        setError('Pilih penghuni terlebih dahulu');
        return;
      }
      await onSave(bulkData, null);
    }
  };

  if (loading) {
    return <div className="loading">⏳ Memuat data...</div>;
  }

  const totalKebersihan = bulkData.kebersihan_months * CHARGES.kebersihan;
  const totalSatpam = bulkData.satpam_months * CHARGES.satpam;
  const grandTotal = totalKebersihan + totalSatpam;

  return (
    <div className="card">
      <div className="card-header">
        <h2>{id ? '✏️ Edit Pembayaran' : '➕ Tambah Pembayaran Sekaligus'}</h2>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        {!id ? (
          /* CREATE MODE (BULK) */
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Penghuni *</label>
                <select name="resident_id" value={bulkData.resident_id} onChange={handleBulkChange} required>
                  <option value="">-- Pilih Penghuni --</option>
                  {residents.map(r => <option key={r.id} value={r.id}>{r.full_name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Mulai Bulan (Periode) *</label>
                <input type="month" name="start_month" value={bulkData.start_month} onChange={handleBulkChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ backgroundColor: 'var(--color-bg-body)', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ color: '#0F172A', fontWeight: 'bold' }}>Iuran Kebersihan (Rp 15.000/bln)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="number" name="kebersihan_months" value={bulkData.kebersihan_months} onChange={handleBulkChange} min="0" required style={{ width: '100px' }} />
                  <span>Bulan</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
                  Subtotal: Rp {totalKebersihan.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="form-group" style={{ backgroundColor: 'var(--color-bg-body)', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ color: '#0F172A', fontWeight: 'bold' }}>Iuran Satpam (Rp 100.000/bln)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="number" name="satpam_months" value={bulkData.satpam_months} onChange={handleBulkChange} min="0" required style={{ width: '100px' }} />
                  <span>Bulan</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
                  Subtotal: Rp {totalSatpam.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nominal Dibayar (Rp) *</label>
                <input 
                  type="number" 
                  name="amount_paid" 
                  value={bulkData.amount_paid} 
                  onChange={handleBulkChange} 
                  required 
                  min="0"
                  style={{ fontWeight: 'bold', color: 'var(--color-accent-success)', fontSize: '1.1rem' }}
                />
                <small style={{ color: '#64748B' }}>Bisa diisi cicilan atau lunas sesuai total tagihan.</small>
              </div>

              <div className="form-group">
                <label>Tanggal Bayar *</label>
                <input 
                  type="date" 
                  name="tanggal_bayar" 
                  value={bulkData.tanggal_bayar} 
                  onChange={handleBulkChange} 
                  required
                />
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-body)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px dashed #BFDBFE' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#1E3A8A', fontSize: '1.1rem' }}>Total Tagihan:</strong>
                <strong style={{ color: '#1D4ED8', fontSize: '1.3rem' }}>Rp {grandTotal.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          </>
        ) : (
          /* EDIT MODE (SINGLE) */
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Penghuni *</label>
                <select name="resident_id" value={editData.resident_id} onChange={handleEditChange} required>
                  <option value="">-- Pilih Penghuni --</option>
                  {residents.map(r => <option key={r.id} value={r.id}>{r.full_name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Jenis Iuran *</label>
                <select name="jenis_iuran" value={editData.jenis_iuran} onChange={handleEditChange} required>
                  <option value="satpam">Satpam</option>
                  <option value="kebersihan">Kebersihan</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bulan *</label>
                <input type="month" name="bulan" value={editData.bulan} onChange={handleEditChange} required />
              </div>

              <div className="form-group">
                <label>Jumlah *</label>
                <input type="number" name="jumlah" value={editData.jumlah} onChange={handleEditChange} required min="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nominal Dibayar (Rp) *</label>
                <input 
                  type="number" 
                  name="amount_paid" 
                  value={editData.amount_paid} 
                  onChange={handleEditChange} 
                  required 
                  min="0"
                  style={{ fontWeight: 'bold', color: 'var(--color-accent-success)', fontSize: '1.1rem' }}
                />
              </div>

              <div className="form-group">
                <label>Tanggal Bayar *</label>
                <input 
                  type="date" 
                  name="tanggal_bayar" 
                  value={editData.tanggal_bayar} 
                  onChange={handleEditChange} 
                  required
                />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/payments')}>Batal</button>
          <button type="submit" className="btn btn-primary">{id ? 'Simpan Perubahan' : 'Simpan Pembayaran'}</button>
        </div>
      </form>
    </div>
  );
}
