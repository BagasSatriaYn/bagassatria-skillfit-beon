import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { housesAPI } from '../services/api';

export default function HousesList({ houses, loading, error, onDelete }) {
  const navigate = useNavigate();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHouses = houses.filter(house => 
    house.house_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    house.current_resident?.resident?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDetailModal = async (houseId) => {
    setIsModalOpen(true);
    setLoadingModal(true);
    try {
      const res = await housesAPI.get(houseId);
      setSelectedHouse(res.data.data || res.data);
    } catch (err) {
      console.error("Gagal memuat detail rumah:", err);
      alert("Gagal memuat detail rumah.");
      setIsModalOpen(false);
    } finally {
      setLoadingModal(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHouse(null);
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner"></div>
        <p>⏳ Memuat data rumah...</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>🏠 Daftar Rumah</h2>
          <div style={{ display: 'flex', gap: '10px', flexGrow: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <input 
                type="text" 
                placeholder="Cari nomor rumah atau penghuni..." 
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
              onClick={() => navigate('/houses/add')}
              style={{ flexShrink: 0 }}
            >
              + Tambah Rumah
            </button>
          </div>
        </div>

        {error && <div className="error" style={{ margin: '1rem' }}>⚠️ {error}</div>}

        {!Array.isArray(houses) || houses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            <p>Tidak ada data rumah.</p>
            <small>Mulai dengan menambahkan rumah baru.</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nomor Rumah</th>
                  <th>Nama Penghuni</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouses.map((house, index) => (
                  <tr key={house.id}>
                    <td>{index + 1}</td>
                    <td><strong>{house.house_number}</strong></td>
                    <td>{house.current_resident?.resident?.full_name || '-'}</td>
                    <td>
                      <span className={`badge ${
                        house.status === 'occupied' ? 'badge-primary' : 'badge-warning'
                      }`}>
                        {house.status === 'occupied' ? 'Dihuni' : 'Kosong'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => openDetailModal(house.id)}
                          style={{ backgroundColor: 'var(--color-accent-success)', border: 'none', color: '#fff' }}
                        >
                          👁 Detail
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => navigate(`/houses/edit/${house.id}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(house.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETAIL RUMAH */}
      {isModalOpen && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div className="custom-modal" onClick={e => e.stopPropagation()}>
            <button className="custom-modal-close" onClick={closeModal}>&times;</button>
            <div className="custom-modal-header">
              <h3>Detail Rumah</h3>
            </div>
            
            {loadingModal ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>⏳ Memuat Detail...</div>
            ) : selectedHouse ? (
              <div>
                <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-bg-body)', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}><strong>Nomor Rumah:</strong> {selectedHouse.house_number}</p>
                  <p style={{ margin: '0' }}>
                    <strong>Status Saat Ini:</strong>{' '}
                    <span className={`badge ${selectedHouse.status === 'occupied' ? 'badge-primary' : 'badge-warning'}`}>
                      {selectedHouse.status === 'occupied' ? 'Dihuni' : 'Kosong'}
                    </span>
                  </p>
                </div>

                <h4 style={{ color: 'var(--color-text-main)', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  📜 Riwayat Penghuni
                </h4>
                
                {(!selectedHouse.histories || selectedHouse.histories.length === 0) ? (
                  <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>Belum ada riwayat penghuni untuk rumah ini.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table" style={{ fontSize: '0.9rem', width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-bg-body)' }}>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Nama Penghuni</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Status</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Mulai Menghuni</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Selesai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedHouse.histories.map((history) => (
                          <tr key={history.id} style={{ borderBottom: '1px solid var(--color-bg-body)' }}>
                            <td style={{ padding: '12px 8px' }}><strong>{history.resident?.full_name || 'Tidak Diketahui'}</strong></td>
                            <td style={{ padding: '12px 8px' }}>
                              {history.resident ? (history.resident.status === 'permanent' ? 'Tetap' : 'Kontrak') : '-'}
                            </td>
                            <td style={{ padding: '12px 8px' }}>{history.start_date || '-'}</td>
                            <td style={{ padding: '12px 8px' }}>
                              {history.end_date ? (
                                <span style={{ color: 'var(--color-accent-warning)', fontWeight: '500' }}>{history.end_date}</span>
                              ) : (
                                <span style={{ color: '#10B981', fontWeight: 'bold' }}>Masih Menghuni</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <h4 style={{ color: 'var(--color-text-main)', margin: '2rem 0 1rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  💰 Riwayat Pembayaran
                </h4>
                
                {(!selectedHouse.dues || selectedHouse.dues.length === 0) ? (
                  <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>Belum ada riwayat pembayaran untuk rumah ini.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table" style={{ fontSize: '0.9rem', width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-bg-body)' }}>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Bulan/Tahun</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Nama Pembayar</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Jenis Iuran</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1E293B', fontWeight: 'bold', borderBottom: '2px solid #E2E8F0' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedHouse.dues.map((due) => {
                          const dateObj = due.due_month ? new Date(due.due_month) : null;
                          const monthYear = dateObj ? dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-';
                          return (
                            <tr key={due.id} style={{ borderBottom: '1px solid var(--color-bg-body)' }}>
                              <td style={{ padding: '12px 8px' }}>{monthYear}</td>
                              <td style={{ padding: '12px 8px' }}><strong>{due.resident?.full_name || 'Tidak Diketahui'}</strong></td>
                              <td style={{ padding: '12px 8px' }}>{due.due_type === 'security' ? 'Satpam' : 'Kebersihan'}</td>
                              <td style={{ padding: '12px 8px' }}>
                                <span className={`badge ${due.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                  {due.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
