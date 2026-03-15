import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PublicHeader from './components/PublicHeader';
import Hero from './components/PublicHero';
import { CartProvider } from './context/CartContext';
import CartSidebar from './components/CartSideBar';

// Placeholder para o Catálogo
const CatalogoPublico = () => (
  <div className="p-8 max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-green-900 mb-6">Destaques da Semana</h1>
    <p>Os produtos vindos da API vão aparecer aqui.</p>
  </div>
);

// Placeholder para a Administração
const GestaoAdmin = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-green-900 mb-6">Painel de Gestão</h1>
    <Link to="/" className="text-green-600 underline">Voltar para a Loja</Link>
  </div>
);

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        
        {/* Componentes globais da loja (aparecem em todas as páginas) */}
        <CartSidebar /> 
        <PublicHeader />
        
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Rota Inicial com Hero e Catálogo */}
            <Route path="/" element={<><Hero /><CatalogoPublico /></>} />
            
            {/* Restantes Rotas */}
            <Route path="/catalogo" element={<CatalogoPublico />} />
            <Route path="/admin" element={<GestaoAdmin />} />
          </Routes>
        </div>

      </BrowserRouter>
    </CartProvider>
  );
}