import React, { useEffect, useState } from "react";
// Sesuaikan dengan service axios/api Anda
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State baru untuk memicu render ulang (animasi) grafik
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Memanggil endpoint dari controller Laravel
      // Asumsi endpoint: GET /api/dashboard
      const response = await api.get('/dashboard');
      setData(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data dari server:", err);
      setError("Gagal memuat data dari server. Pastikan API Laravel berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      // Beri jeda sedikit setelah data API masuk, baru jalankan animasi
      const timer = setTimeout(() => {
        setChartKey(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Fungsi untuk memicu animasi grafik ulang
  const handleRefreshChart = () => {
    setChartKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg-body)', color: 'var(--color-text-main)' }}>
        <p>⏳ Memuat Dashboard...</p>
      </div>
    );
  }

  // Jika data belum ada atau error, jangan render chart dulu
  if (error || !data) {
    return (
      <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-body)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
        <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '8px' }}>
          {error || "Data kosong"}
        </div>
      </div>
    );
  }

  // Konfigurasi Chart.js - Disesuaikan agar mirip gambar (Line chart dengan background fill tipis)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'Pemasukan',
        // Asumsi controller mengembalikan array 12 bulan: data.chart_pemasukan
        data: data.chart_pemasukan || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.4, // Membuat garis melengkung (smooth) seperti contoh gambar
        fill: false, // In mockup, fill is removed or very light.
        pointBackgroundColor: 'var(--color-accent-success)',
        pointRadius: 3,
      },
      {
        label: 'Pengeluaran',
        // Asumsi controller mengembalikan array 12 bulan: data.chart_pengeluaran
        data: data.chart_pengeluaran || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'var(--color-accent-warning)',
        pointRadius: 3,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      // Efek staggered (muncul bergantian) agar grafik terlihat "bergerak" saat masuk
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 100 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#4B5563' }
      }
    },
    scales: {
      x: {
        ticks: { color: 'var(--color-text-muted)' },
        grid: { color: '#F3F4F6' } // Garis grid tipis/putih
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'var(--color-text-muted)' },
        grid: { color: '#E5E7EB' }
      },
    },
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-body)', minHeight: '100vh', padding: '32px', fontFamily: 'sans-serif' }}>

      {/* Header Mirip Konsep Gambar */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--color-text-main)', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Laporan Smart RT</h2>
      </div>

      {/* Grid Keuangan */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--color-text-muted)', fontSize: '16px', fontWeight: 'normal', margin: 0 }}>Ringkasan Keuangan</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Saldo Kas Saat Ini</h3>
            <p className="value">Rp {Number(data.saldo_sisa || 0).toLocaleString('id-ID')}</p>
            <p className="sub-text">Saldo kas saat ini</p>
          </div>
          <div className="stat-card-icon icon-bg-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Pemasukan Bulan Ini</h3>
            <p className="value" style={{ color: 'var(--color-accent-success)' }}>
              Rp {Number(data.total_pemasukan_bulan_ini || 0).toLocaleString('id-ID')}
            </p>
            <p className="sub-text">Total pemasukan</p>
          </div>
          <div className="stat-card-icon icon-bg-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Pengeluaran Bulan Ini</h3>
            <p className="value" style={{ color: 'var(--color-accent-warning)' }}>
              Rp {Number(data.total_pengeluaran_bulan_ini || 0).toLocaleString('id-ID')}
            </p>
            <p className="sub-text">Total pengeluaran</p>
          </div>
          <div className="stat-card-icon icon-bg-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </div>
        </div>
      </div>

      {/* Grid Data Rumah */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--color-text-main)', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Status Data Rumah</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Total Rumah</h3>
            <p className="value">{data.total_rumah || 0}</p>
            <p className="sub-text">Data terdaftar</p>
          </div>
          <div className="stat-card-icon icon-bg-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Dihuni</h3>
            <p className="value">{data.rumah_dihuni || 0}</p>
            <p className="sub-text">Rumah dihuni</p>
          </div>
          <div className="stat-card-icon icon-bg-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Kosong</h3>
            <p className="value">{data.rumah_kosong || 0}</p>
            <p className="sub-text">Rumah kosong</p>
          </div>
          <div className="stat-card-icon icon-bg-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          </div>
        </div>
      </div>

      {/* Chart Section - Latar Putih */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--color-text-main)', fontWeight: 'bold' }}>Grafik Penerimaan & Pengeluaran Iuran</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>Januari - Desember {new Date().getFullYear()}</p>
          </div>
        </div>

        <div style={{ height: '350px' }}>
          {/* Penambahan 'key' agar komponen di-remount saat diklik */}
          <Line key={chartKey} data={chartData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
}