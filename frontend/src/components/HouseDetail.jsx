import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { housesAPI } from '../services/api';

export default function HouseDetail({ houses, onRefresh }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHouseDetail();
  }, [id]);

  const loadHouseDetail = async () => {
    try {
      const res = await housesAPI.get(id);
      setHouse(res.data.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat detail rumah: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">⏳ Memuat detail...</div>;
  }

  if (!house) {
    return (
      <div className="card">
        <div className="error">Data rumah tidak ditemukan</div>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/houses')}
          style={{ marginTop: '1rem' }}
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="error">⚠️ {error}</div>}

      <div className="card">
        <div className="card-header">
          <h2>🏠 Detail Rumah {house.nomor_rumah}</h2>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/houses')}
          >
            Kembali
          </button>
        </div>

        <div className="grid-2">
          <div>
            <h3>Informasi Rumah</h3>
            <p><strong>Nomor Rumah:</strong> {house.nomor_rumah}</p>
            <p><strong>Alamat:</strong> {house.alamat}</p>
            <p>
              <strong>Status:</strong> {' '}
              <span className={`badge ${
                house.status === 'dihuni' ? 'badge-success' : 'badge-warning'
              }`}>
                {house.status}
              </span>
            </p>
          </div>

          <div>
            <h3>Penghuni Saat Ini</h3>
            {house.residents && house.residents.length > 0 ? (
              house.residents.map(resident => (
                <div key={resident.id} style={{ marginBottom: '1rem' }}>
                  <p><strong>Nama:</strong> {resident.nama_lengkap}</p>
                  <p><strong>Telepon:</strong> {resident.nomor_telepon}</p>
                  <p><strong>Status:</strong> {resident.status}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#999' }}>Tidak ada penghuni</p>
            )}
          </div>
        </div>
      </div>

      {/* Historical Residents */}
      {house.house_histories && house.house_histories.length > 0 && (
        <div className="card">
          <h3>📋 Riwayat Penghuni</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Nama Penghuni</th>
                <th>Mulai</th>
                <th>Berakhir</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {house.house_histories.map((history, idx) => (
                <tr key={idx}>
                  <td>{history.resident?.nama_lengkap || '-'}</td>
                  <td>{new Date(history.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                  <td>{history.tanggal_berakhir ? new Date(history.tanggal_berakhir).toLocaleDateString('id-ID') : 'Masih tinggal'}</td>
                  <td>{history.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment History */}
      {house.payments && house.payments.length > 0 && (
        <div className="card">
          <h3>💰 Riwayat Pembayaran</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Penghuni</th>
                <th>Jenis Iuran</th>
                <th>Bulan</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {house.payments.map((payment, idx) => (
                <tr key={idx}>
                  <td>{payment.resident?.nama_lengkap || '-'}</td>
                  <td>{payment.jenis_iuran}</td>
                  <td>{payment.bulan}</td>
                  <td>Rp {payment.jumlah?.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge ${
                      payment.status === 'lunas' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {payment.status}
                    </span>
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
