import { useNavigate } from 'react-router-dom';

export default function HousesList({ houses, loading, error, onDelete }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">⏳ Memuat data rumah...</div>;
  }

  const occupied = houses.filter(h => h.status === 'dihuni').length;
  const empty = houses.filter(h => h.status === 'kosong').length;

  return (
    <div className="card">
      <div className="card-header">
        <h2>🏠 Daftar Rumah</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/houses/add')}
        >
          + Tambah Rumah
        </button>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <h3>Total Rumah</h3>
          <p className="value">{houses.length}</p>
        </div>
        <div className="stat-card success">
          <h3>Dihuni</h3>
          <p className="value">{occupied}</p>
        </div>
        <div className="stat-card warning">
          <h3>Kosong</h3>
          <p className="value">{empty}</p>
        </div>
      </div>

      {houses.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Tidak ada data rumah. Mulai dengan menambahkan rumah baru.
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nomor Rumah</th>
              <th>Status</th>
              <th>Penghuni</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {houses.map(house => (
              <tr key={house.id}>
                <td>{house.nomor_rumah}</td>
                <td>
                  <span className={`badge ${
                    house.status === 'dihuni' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {house.status}
                  </span>
                </td>
                <td>{house.residents?.length > 0 ? house.residents[0]?.nama_lengkap : '-'}</td>
                <td>{house.alamat}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/houses/detail/${house.id}`)}
                    >
                      Detail
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
      )}
    </div>
  );
}
