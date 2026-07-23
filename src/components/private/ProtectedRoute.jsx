import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/private/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enquanto o Laravel está a confirmar o token, não mostramos nada (ou um spinner)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Se TEM user, renderiza as rotas filhas (o teu PrivateLayout e as páginas)
  // Se NÃO TEM user, redireciona para o login e guarda de onde a pessoa vinha
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}