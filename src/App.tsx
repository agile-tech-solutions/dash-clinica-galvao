import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { CatalogFiles } from './pages/CatalogFiles';
import { FilaDaVez } from './pages/FilaDaVez';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <>
              {localStorage.getItem('admin_session') ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )}
            </>
          } />
          <Route element={<ProtectedRoute><DashboardLayoutWrapper /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="fila" element={<FilaDaVez />} />
            <Route path="catalog" element={<CatalogFiles />} />
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function DashboardLayoutWrapper() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default App;
