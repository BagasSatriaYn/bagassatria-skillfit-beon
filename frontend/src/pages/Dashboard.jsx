import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await dashboardAPI.getSummary();
      setData(res.data.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard Error:", err);
      // Dummy data untuk demo
      setData({
        residents_total: 15,
        houses_total: 20,
        houses_occupied: 15,
        houses_empty: 5,
        finance_income: 1150000,
        finance_expense: 500000,
        finance_unpaid: 150000,
      });
      setError("Koneksi ke server terputus. Menampilkan data dummy.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>⏳ Memuat dashboard...</p>
      </div>
    );
  }

  const balance = (data?.finance_income || 0) - (data?.finance_expense || 0);

  return (
    <div>
      {error && <div className="error">⚠️ {error}</div>}

      <div className="card">
        <div className="card-header">
          <h2>🏠 Dashboard - Ringkasan Aplikasi</h2>
        </div>

        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Selamat datang di aplikasi Smart RT. Kelola administrasi penghuni, rumah, dan pembayaran iuran dengan mudah.
        </p>

        {/* Quick Stats */}
        <div className="grid-3" style={{ marginBottom: "3rem" }}>
          <div className="stat-card">
            <h3>👥 Total Penghuni</h3>
            <p className="value">{data?.residents_total || 0}</p>
          </div>
          <div className="stat-card">
            <h3>🏠 Total Rumah</h3>
            <p className="value">{data?.houses_total || 0}</p>
          </div>
          <div className="stat-card">
            <h3>📊 Perumahan Terisi</h3>
            <p className="value">
              {data?.houses_occupied || 0}/{data?.houses_total || 0}
            </p>
          </div>
        </div>

        {/* House Status */}
        <div className="grid-2" style={{ marginBottom: "3rem" }}>
          <div className="stat-card success">
            <h3>🏘️ Rumah Dihuni</h3>
            <p className="value">{data?.houses_occupied || 0}</p>
          </div>
          <div className="stat-card warning">
            <h3>🏚️ Rumah Kosong</h3>
            <p className="value">{data?.houses_empty || 0}</p>
          </div>
        </div>

        {/* Finance Summary */}
        <h2 style={{ marginTop: "2rem", marginBottom: "1rem" }}>💰 Ringkasan Keuangan</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Jumlah (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pemasukan (Lunas)</td>
              <td style={{ color: "green", fontWeight: "bold" }}>
                {data?.finance_income?.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr>
              <td>Total Pengeluaran</td>
              <td style={{ color: "red", fontWeight: "bold" }}>
                {data?.finance_expense?.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr>
              <td>Belum Dibayar (Tunggakan)</td>
              <td style={{ color: "orange", fontWeight: "bold" }}>
                {data?.finance_unpaid?.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <td><strong>Saldo</strong></td>
              <td style={{ color: balance >= 0 ? "green" : "red", fontWeight: "bold" }}>
                <strong>Rp {balance.toLocaleString("id-ID")}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2>🚀 Aksi Cepat</h2>
        <div className="grid-3" style={{ gap: "1rem" }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/residents")}
            style={{ width: "100%", padding: "1rem" }}
          >
            👥 Kelola Penghuni
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/houses")}
            style={{ width: "100%", padding: "1rem" }}
          >
            🏠 Kelola Rumah
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/payments")}
            style={{ width: "100%", padding: "1rem" }}
          >
            💰 Kelola Pembayaran
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="card">
        <h3>ℹ️ Informasi</h3>
        <ul style={{ lineHeight: "1.8", color: "#666" }}>
          <li><strong>Iuran Satpam:</strong> Rp 100.000 per bulan</li>
          <li><strong>Iuran Kebersihan:</strong> Rp 15.000 per bulan</li>
          <li><strong>Total Iuran Bulanan:</strong> Rp 115.000 per bulan per rumah (penghuni tetap)</li>
          <li><strong>Penghuni Kontrak:</strong> Ditagih sesuai bulan yang dihuni</li>
        </ul>
      </div>

      <footer style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#888", textAlign: "center" }}>
        <p>Smart RT Dashboard - Skill Fit Test - Jagoan Hosting Apprentice 2026</p>
      </footer>
    </div>
  );
}