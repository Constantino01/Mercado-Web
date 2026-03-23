import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/public/CartContext";

//!!Importes Publicos!!
import PublicLayout from "./layouts/PublicLayout";
//Catálogo
import Catalogo from "./pages/public/catalogo/index";
import Descontos from "./pages/public/catalogo/descontos";
import Produto from "./pages/public/catalogo/produto";
//Loja
import Inicio from "./pages/public/loja/index";
//Pagamentos
import Checkout from "./pages/public/pagamento/checkout";


//!!Importes Privados!!
import PrivateLayout from "./layouts/PrivateLayout";
//Categorias//
import Categorias from './pages/private/categorias/index';
import CategoriaForm from './pages/private/categorias/form';
import CategoriasRecycle from './pages/private/categorias/recycle';
//Produtos//
import Produtos from './pages/private/produtos/index';
import ProdutoForm from './pages/private/produtos/form';
import ProdutosRecycle from './pages/private/produtos/recycle';
//Encomendas//
import Pedidos from './pages/private/encomendas/index';
//Descontos//
import TabelaDescontos from './pages/private/descontos/index';
import DescontoForm from './pages/private/descontos/form';
import DescontoRecycle from './pages/private/descontos/recycle';
//Utilizadores//
import Utilizadores from './pages/private/utilizadores/index';
import UtilizadorForm from './pages/private/utilizadores/form';
import ConfiguracaoConta from './pages/private/utilizadores/conta';
//Autenticações//
//import LoginPrivate from "./pages/private/autenticacao/login";
//Historicos//
//import HistoricoVendas from './pages/private/historicos/vendas';










export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/loja" element={<Inicio />} />
            <Route path="/loja/catalogo" element={<Catalogo />} />
            <Route path="/loja/promocoes" element={<Descontos />} />
            <Route path="/loja/checkout" element={<Checkout />} />
            <Route path="/loja/catalogo/produto/:id" element={<Produto />} />
          </Route>

          {/* Management Routes */}
          <Route element={<PrivateLayout />}>
            <Route
              path="/private"
              element={
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  Dashboard inicial da gestão
                </div>
              }
            />
            //Categorias 
            <Route path="/private/categorias" element={<Categorias />} />
            <Route path="/private/categorias/nova" element={<CategoriaForm />} />
            <Route path="/private/categorias/editar/:id" element={<CategoriaForm />} />
            <Route path="/private/categorias/recycle" element={<CategoriasRecycle />} />
            
            //Produtos
            <Route path="/private/produtos" element={<Produtos />} />
            <Route path="/private/produtos/novo" element={<ProdutoForm />} />
            <Route path="/private/produtos/editar/:id" element={<ProdutoForm />} /> 
            <Route path="/private/produtos/recycle" element={<ProdutosRecycle />} />

            //Descontos
            <Route path="/private/descontos" element={<TabelaDescontos />} />
            <Route path="/private/descontos/novo" element={<DescontoForm />} />
            <Route path="/private/descontos/editar/:id" element={<DescontoForm />} /> 
            <Route path="/private/descontos/recycle" element={<DescontoRecycle />} />

            <Route path="/private/utilizadores" element={<Utilizadores />} />
            <Route path="/private/utilizadores/novo" element={<UtilizadorForm />} />
            <Route path="/private/utilizadores/editar/:id" element={<UtilizadorForm />} />
            <Route path="/private/pedidos" element={<Pedidos />} />
            
            <Route path="/private/conta" element={<ConfiguracaoConta />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
