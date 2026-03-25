import { useLocation, Link, Navigate } from 'react-router-dom';

export default function Sucesso() {
  const { state } = useLocation();

  // Proteção: Se acederem direto ao link sem virem do checkout, voltam à loja
  if (!state || !state.orderCode) {
    return <Navigate to="/loja/catalogo" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      
      <h1 className="text-4xl font-black text-gray-900 mb-4">Encomenda Confirmada!</h1>
      <p className="text-lg text-gray-600 mb-8">A sua encomenda foi registada com sucesso e está a ser preparada.</p>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mb-8 inline-block min-w-[320px]">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Código de Levantamento</p>
        <span className="text-4xl font-mono font-bold text-green-600 tracking-widest">
          {state.orderCode}
        </span>
        <p className="text-sm text-gray-500 mt-4">Apresente este código ao balcão da loja.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/loja/historico" className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-sm">
          Ver o meu Histórico
        </Link>
        <Link to="/loja/catalogo" className="bg-green-50 hover:bg-green-100 text-green-700 font-bold py-4 px-8 rounded-xl transition-colors shadow-sm border border-green-100">
          Voltar às Compras
        </Link>
      </div>
    </div>
  );
}