import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import CartSidebar from '../components/public/CartSideBar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CartSidebar />
      <PublicHeader />
    
      {/* O Outlet injeta a página (Inicio, Catalogo, etc.) aqui no meio */}
      <Outlet /> 
    </div>
  );
}