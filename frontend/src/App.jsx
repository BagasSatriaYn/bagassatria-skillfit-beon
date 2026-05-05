import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import Houses from './pages/Houses';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Expenses from './pages/Expenses';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">⏳ Memverifikasi sesi...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Halaman yang diproteksi */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/residents/*" element={<Residents />} />
          <Route path="/houses/*" element={<Houses />} />
          <Route path="/payments/*" element={<Payments />} />
          <Route path="/expenses/*" element={<Expenses />} />
          <Route path="/reports/*" element={<Reports />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;