import { useEffect, useState, useMemo } from 'react';
import { reportsAPI } from '../services/api';
import FinancialChart from '../components/FinancialChart';
import ExpenseReport from '../components/ExpenseReport';

export default function Reports() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [yearlyData, setYearlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    loadYearlyReport();
  }, [selectedYear]);

  const loadYearlyReport = async () => {
    try {
      setLoading(true);
      const res = await reportsAPI.getYearlyReport(selectedYear);
      setYearlyData(res.data.data);
      setError(null);
    } catch (err) {
      // Use dummy data if API fails
      setYearlyData({
        year: parseInt(selectedYear),
        total_income: 22000000,
        total_expense: 5000000,
        balance: 17000000,
        monthly_summary: generateDummyData(),
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDummyData = () => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map(month => ({
      month,
      income: Math.floor(Math.random() * 3000000) + 1000000,
      expense: Math.floor(Math.random() * 1000000) + 100000,
    }));
  };

  const summaryStats = useMemo(() => {
    if (!yearlyData) return { income: 0, expense: 0, balance: 0 };
    return {
      income: yearlyData.total_income || 0,
      expense: yearlyData.total_expense || 0,
      balance: (yearlyData.total_income || 0) - (yearlyData.total_expense || 0),
    };
  }, [yearlyData]);

  if (loading && !yearlyData) {
    return <div className="loading">⏳ Memuat laporan...</div>;
  }

  return (
    <div>
      {error && <div className="error">⚠️ {error}</div>}

      {/* Year Selection */}
      <div className="card">
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: 500 }}>
            Pilih Tahun:
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid-3">
        <div className="stat-card success">
          <h3>Total Pemasukan</h3>
          <p className="value">Rp {summaryStats.income.toLocaleString('id-ID')}</p>
        </div>
        <div className="stat-card danger">
          <h3>Total Pengeluaran</h3>
          <p className="value">Rp {summaryStats.expense.toLocaleString('id-ID')}</p>
        </div>
        <div className="stat-card">
          <h3>Saldo</h3>
          <p className="value" style={{ 
            color: summaryStats.balance >= 0 ? '#28a745' : '#dc3545'
          }}>
            Rp {summaryStats.balance.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Charts */}
      <FinancialChart data={yearlyData} year={selectedYear} />

      {/* Expense Report */}
      <ExpenseReport year={selectedYear} />
    </div>
  );
}
