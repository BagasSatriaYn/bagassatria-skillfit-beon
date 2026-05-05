import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler // Pastikan Filler terdaftar untuk efek area bawah garis
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function FinancialChart({ data, year, onYearChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  // 1. Konfigurasi Warna untuk Line Chart (Hijau & Merah)
  const chartData = useMemo(() => {
    if (!data || !data.monthly_summary) {
      return { labels: monthNames, datasets: [] };
    }

    const labels = data.monthly_summary.map((_, i) => monthNames[i]);

    return {
      labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: data.monthly_summary.map(d => d.income || 0),
          // Menggunakan warna Hijau dari variabel CSS atau Hex langsung
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)', // Efek bayangan hijau di bawah garis
          tension: 0.4, // Membuat garis lebih melengkung halus
          fill: true,
          pointBackgroundColor: '#10B981',
        },
        {
          label: 'Pengeluaran',
          data: data.monthly_summary.map(d => d.expense || 0),
          // Menggunakan warna Merah
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)', // Efek bayangan merah di bawah garis
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#EF4444',
        }]
    };
  }, [data]);

  // 2. Konfigurasi Warna untuk Bar Chart
  const barChartData = useMemo(() => {
    if (!data || !data.monthly_summary) {
      return { labels: monthNames, datasets: [] };
    }

    const labels = data.monthly_summary.map((_, i) => monthNames[i]);

    return {
      labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: data.monthly_summary.map(m => m.income || 0),
          backgroundColor: '#10B981', // Hijau solid
          borderRadius: 4, // Membuat batang sedikit rounded
        },
        {
          label: 'Pengeluaran',
          data: data.monthly_summary.map(m => m.expense || 0),
          backgroundColor: '#EF4444', // Merah solid
          borderRadius: 4,
        },
      ]
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true, // Ikon bulat di legenda agar lebih rapi
          boxWidth: 8,
          font: { weight: '600' }
        }
      },
      title: {
        display: false, // Kita matikan karena sudah ada <h3> di container card
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#F3F4F6' },
        ticks: {
          callback: (value) => `Rp ${value.toLocaleString('id-ID')}`,
        }
      },
      x: {
        grid: { display: false } // Menghilangkan grid vertikal agar lebih clean
      }
    }
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Line Chart Section */}
      <div className="card" style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
            📈 Tren Arus Kas Tahun {year}
          </h3>
          {onYearChange && (
            <select 
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                color: '#374151',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer'
              }}
            >
              {years.map(y => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
          )}
        </div>
        <div style={{ position: 'relative', height: '350px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="card" style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1F2937' }}>
          📊 Perbandingan Bulanan
        </h3>
        <div style={{ position: 'relative', height: '350px' }}>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}