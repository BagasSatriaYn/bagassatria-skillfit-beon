import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const STORAGE_URL = 'http://localhost:8000/storage/';

export default function ResidentsList({ residents = [], loading, error, onDelete }) {
  const navigate = useNavigate();
  
  // Modal State for KTP Preview
  const [selectedKtpUrl, setSelectedKtpUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResidents = residents.filter(resident => 
    resident.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.phone_number?.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner"></div>
        <p>⏳ Memuat data penghuni...</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>👥 Daftar Penghuni</h2>
          <div style={{ display: 'flex', gap: '10px', flexGrow: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <input 
                type="text" 
                placeholder="Cari nama atau telepon..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 15px 10px 40px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-success)'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <svg 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/residents/add')}
              style={{ flexShrink: 0 }}
            >
              + Tambah Penghuni
            </button>
          </div>
        </div>

        {error && <div className="error" style={{ margin: '1rem' }}>⚠️ {error}</div>}

        {!Array.isArray(residents) || residents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            <p>Tidak ada data penghuni ditemukan.</p>
            <small>Pastikan koneksi API berhasil atau mulai tambahkan data baru.</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Lengkap</th>
                  <th>Nomor Telepon</th>
                  <th>Status</th>
                  <th>Perkawinan</th>
                  <th>KTP</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.map((resident) => {
                  const ktpUrl = resident.ktp_photo 
                    ? (resident.ktp_photo.startsWith('http') ? resident.ktp_photo : `${STORAGE_URL}${resident.ktp_photo}`) 
                    : null;

                  return (
                    <tr key={resident.id}>
                      <td><strong>{resident.full_name}</strong></td>
                      <td>{resident.phone_number}</td>
                      <td>
                        <span className={`badge ${
                          resident.status === 'permanent' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {resident.status === 'permanent' ? 'Tetap' : 'Kontrak'}
                        </span>
                      </td>
                      <td>
                        {String(resident.is_married) === '1' || resident.is_married === true 
                          ? 'Sudah Menikah' 
                          : 'Belum Menikah'}
                      </td>
                      <td>
                        {ktpUrl ? (
                          <div 
                            style={{ cursor: 'pointer', display: 'inline-block' }}
                            onClick={() => setSelectedKtpUrl(ktpUrl)}
                            title="Klik untuk memperbesar"
                          >
                            <img 
                              src={ktpUrl} 
                              alt="KTP Thumbnail"
                              style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                          </div>
                        ) : (
                          <span style={{ color: '#999', fontSize: '0.85rem' }}>Tidak ada foto</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => ktpUrl ? setSelectedKtpUrl(ktpUrl) : alert('Penghuni ini belum mengunggah KTP.')}
                            style={{ backgroundColor: 'var(--color-accent-success)', border: 'none', color: '#fff' }}
                          >
                            👁 Detail
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => navigate(`/residents/edit/${resident.id}`)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              if (window.confirm(`Hapus data ${resident.full_name}?`)) {
                                onDelete(resident.id);
                              }
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* KTP PREVIEW MODAL */}
      {selectedKtpUrl && (
        <div className="custom-modal-overlay" onClick={() => setSelectedKtpUrl(null)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', padding: '1rem', maxWidth: '800px' }}>
            <button className="custom-modal-close" onClick={() => setSelectedKtpUrl(null)}>&times;</button>
            <div className="custom-modal-header" style={{ borderBottom: 'none', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>Preview KTP</h3>
            </div>
            <img 
              src={selectedKtpUrl} 
              alt="Preview KTP" 
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px' }}
            />
          </div>
        </div>
      )}
    </>
  );
}