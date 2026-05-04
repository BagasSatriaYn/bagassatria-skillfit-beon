import { useNavigate } from 'react-router-dom';
const STORAGE_URL = 'http://localhost:8000/storage/';

export default function ResidentsList({ residents = [], loading, error, onDelete }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner"></div>
        <p>⏳ Memuat data penghuni...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>👥 Daftar Penghuni</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/residents/add')}
        >
          + Tambah Penghuni
        </button>
      </div>

      {error && <div className="error" style={{ margin: '1rem' }}>⚠️ {error}</div>}

      {/* Gunakan pengecekan array yang lebih aman */}
      {!Array.isArray(residents) || residents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
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
              {residents.map((resident) => (
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
                  {/* Pastikan handling is_married sesuai ERD (1/0 atau true/false) */}
                  <td>
                    {String(resident.is_married) === '1' || resident.is_married === true 
                      ? 'Sudah Menikah' 
                      : 'Belum Menikah'}
                  </td>
                  <td>
                    {resident.ktp_photo ? (
                        <img 
                        src={resident.ktp_photo.startsWith('http') 
                            ? resident.ktp_photo 
                            : `${STORAGE_URL}${resident.ktp_photo}`} 
                        alt="KTP"
                        style={{ width: '50px', height: 'auto', borderRadius: '4px' }}
                        onClick={() => window.open(resident.ktp_photo.startsWith('http') 
                            ? resident.ktp_photo 
                            : `${STORAGE_URL}${resident.ktp_photo}`, '_blank')}
                        />
                    ) : (
                        <span>Tidak ada foto</span>
                    )}
                    </td>
                  <td>
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}