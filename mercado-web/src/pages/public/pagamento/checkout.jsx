import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/public/CartContext'; // Ajusta o caminho se necessário

export default function Checkout() {
  const [metodoPagamento, setMetodoPagamento] = useState('mbway');
  const navigate = useNavigate();
  
  // Puxar os dados do carrinho da sessão
  const { cartItems, cartCount, cartTotal } = useCart();

  const formatarValor = (valor) => Number(valor || 0).toFixed(2);

  // Se o cliente chegar aqui com o carrinho vazio, mandamos de volta para a loja
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" className="mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">O seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8">Não pode finalizar uma encomenda sem produtos.</p>
        <Link to="/loja/catalogo" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
          Voltar às compras
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Encomenda</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Formulário de Dados e Pagamento */}
        <div className="flex-1 space-y-8">
          
          {/* Dados de Entrega */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dados de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nome Completo" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              <input type="email" placeholder="Email" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              <input type="text" placeholder="Morada" className="w-full md:col-span-2 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              <input type="text" placeholder="Código Postal" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              <input type="text" placeholder="Localidade" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Método de Pagamento</h2>
            <div className="space-y-3">
              
              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${metodoPagamento === 'mbway' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="pagamento" value="mbway" checked={metodoPagamento === 'mbway'} onChange={(e) => setMetodoPagamento(e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="font-semibold text-gray-800">MBWay</span>
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${metodoPagamento === 'multibanco' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="pagamento" value="multibanco" checked={metodoPagamento === 'multibanco'} onChange={(e) => setMetodoPagamento(e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="font-semibold text-gray-800">Referência Multibanco</span>
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${metodoPagamento === 'loja' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="pagamento" value="loja" checked={metodoPagamento === 'loja'} onChange={(e) => setMetodoPagamento(e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="font-semibold text-gray-800">Pagamento em Loja (Dinheiro/Cartão)</span>
                </div>
              </label>

            </div>

            {/* Instruções extra baseadas na seleção */}
            {metodoPagamento === 'mbway' && <p className="mt-4 text-sm text-gray-600">Irá receber uma notificação no seu telemóvel para aprovar o pagamento.</p>}
            {metodoPagamento === 'multibanco' && <p className="mt-4 text-sm text-gray-600">A entidade e referência serão geradas após confirmar a encomenda.</p>}
            {metodoPagamento === 'loja' && <p className="mt-4 text-sm text-gray-600">A sua encomenda ficará reservada por 24 horas para levantamento.</p>}

          </div>
        </div>

        {/* Resumo da Encomenda */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo</h2>
            
            {/* LISTA DINÂMICA DE PRODUTOS */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => {
                const divisor = item.unit_type === 'kg' ? 1000 : 1;
                const custoLinha = (item.precoFinal / divisor) * item.quantidade;
                const labelUnidade = item.unit_type === 'kg' ? 'g' : ' un';

                return (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <span className="font-medium text-gray-800">{item.quantidade}{labelUnidade}</span>
                      <span className="text-gray-500 ml-2">{item.product_name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{formatarValor(custoLinha)}€</span>
                  </div>
                );
              })}
            </div>

            <hr className="border-gray-100 mb-6" />
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartCount} produtos)</span>
                <span>{formatarValor(cartTotal)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-green-600">{formatarValor(cartTotal)}€</span>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm text-lg">
              Confirmar e Pagar
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/loja/catalogo" className="text-sm text-gray-500 hover:text-green-600 underline">Voltar às compras</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}