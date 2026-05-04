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
  Legend
);

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function FinancialChart({ data, year }) {
  const chartData = useMemo(() => {
    if (!data || !data.monthly_summary) {
      return {
        labels: monthNames,
        datasets: []
      };
    }

    const labels = data.monthly_summary.map((_, i) => monthNames[i]);
    const income = data.monthly_summary.map(m => m.income || 0);
    const expense = data.monthly_summary.map(m => m.expense || 0);
    const balance = data.monthly_summary.map((m, i) => (income[i] || 0) - (expense[i] || 0));

    return {
      labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: income,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Pengeluaran',
          data: expense,
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
        },
      ]
    };
  }, [data]);

  const barChartData = useMemo(() => {
    if (!data || !data.monthly_summary) {
      return {
        labels: monthNames,
        datasets: []
      };
    }

    const labels = data.monthly_summary.map((_, i) => monthNames[i]);
    const income = data.monthly_summary.map(m => m.income || 0);
    const expense = data.monthly_summary.map(m => m.expense || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: income,
          backgroundColor: '#667eea',
        },
        {
          label: 'Pengeluaran',
          data: expense,
          backgroundColor: '#764ba2',
        },
      ]
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Laporan Keuangan Tahun ${year}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `Rp ${(value / 1000000).toFixed(1)}M`,
        }
      }
    }
  };

  return (
    <div>
      {/* Line Chart */}
      <div className="card">
        <h3>📈 Grafik Pemasukan & Pengeluaran</h3>
        <div style={{ position: 'relative', height: '400px' }}>
          <Line 
            data={chartData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `Rp ${(value / 1000000).toFixed(1)}M`,
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card">
        <h3>📊 Perbandingan Pemasukan vs Pengeluaran</h3>
        <div style={{ position: 'relative', height: '400px' }}>
          <Bar 
            data={barChartData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `Rp ${(value / 1000000).toFixed(1)}M`,
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
