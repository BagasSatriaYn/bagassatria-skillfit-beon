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
      setError('Gagal memuat laporan tahunan dari server.');
      setYearlyData(null);
    } finally {
      setLoading(false);
    }
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {error && <div className="error">⚠️ {error}</div>}

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--color-text-main)', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Laporan Keuangan RT</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Total Pemasukan</h3>
            <p className="value" style={{ color: 'var(--color-accent-success)' }}>
              Rp {summaryStats.income.toLocaleString('id-ID')}
            </p>
            <p className="sub-text">Total tahunan</p>
          </div>
          <div className="stat-card-icon icon-bg-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Total Pengeluaran</h3>
            <p className="value" style={{ color: 'var(--color-accent-warning)' }}>
              Rp {summaryStats.expense.toLocaleString('id-ID')}
            </p>
            <p className="sub-text">Total tahunan</p>
          </div>
          <div className="stat-card-icon icon-bg-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>Saldo</h3>
            <p className="value">
              Rp {summaryStats.balance.toLocaleString('id-ID')}
            </p>
            <p className="sub-text">Saldo tersisa</p>
          </div>
          <div className="stat-card-icon icon-bg-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
        </div>
      </div>

      {/* Charts */}
      <FinancialChart 
        data={yearlyData} 
        year={selectedYear} 
        onYearChange={setSelectedYear} 
      />

      {/* Expense Report */}
      <ExpenseReport year={selectedYear} />
    </div>
  );
}
