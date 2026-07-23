import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/public/CartContext';
import { apiCRUD } from '../../../utils/api'; 

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();

  const [metodoPagamento, setMetodoPagamento] = useState('loja');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    confirmEmail: '', 
    telemovel: '', 
    morada: '',
    codigoPostal: '',
    localidade: ''
  });

  const formatarValor = (valor) => Number(valor || 0).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalizarEncomenda = async () => {
    // Só validamos os campos que estão ativos
    if (!formData.nome || !formData.email || !formData.telemovel) {
      setErro('Por favor, preencha o Nome, Email e Telemóvel.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const payload = {
        client_email: formData.email,
        client_number: formData.telemovel,
        nome: formData.nome, 
        items: cartItems.map(item => ({
          id: item.id,
          quantidade: item.quantidade
        }))
      };

      const response = await apiCRUD.create('/encomendas', payload);

      // Guardar Histórico Local
      const novaEncomenda = {
        codigo: response.order_code,
        data: new Date().toISOString(),
        itens: [...cartItems],
        total: cartTotal,
        metodoPagamento: metodoPagamento,
      };

      const encomendasGuardadas = JSON.parse(localStorage.getItem('mercearia_encomendas') || '[]');
      localStorage.setItem('mercearia_encomendas', JSON.stringify([novaEncomenda, ...encomendasGuardadas]));

      clearCart();
      
      navigate('/loja/sucesso', { state: { orderCode: response.order_code } });

    } catch (error) {
      console.error('Erro na encomenda:', error);
      setErro('Ocorreu um erro ao registar a sua encomenda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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

      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
          {erro}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-8">
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dados do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campos Ativos */}
              <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome Completo *" className="w-full md:col-span-2 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email *" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
              <input type="text" name="telemovel" value={formData.telemovel} onChange={handleInputChange} placeholder="Telemóvel *" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
              
              {/* Campos Desativados */}
              <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleInputChange} placeholder="Confirmar Email (Indisponível)" className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100 text-gray-400 cursor-not-allowed focus:outline-none" disabled />
              <input type="text" name="morada" value={formData.morada} onChange={handleInputChange} placeholder="Morada (Apenas p/ Entregas)" className="w-full md:col-span-2 border border-gray-200 rounded-lg p-3 bg-gray-100 text-gray-400 cursor-not-allowed focus:outline-none" disabled />
              <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} placeholder="Código Postal" className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100 text-gray-400 cursor-not-allowed focus:outline-none" disabled />
              <input type="text" name="localidade" value={formData.localidade} onChange={handleInputChange} placeholder="Localidade" className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100 text-gray-400 cursor-not-allowed focus:outline-none" disabled />
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Método de Pagamento</h2>
            <div className="space-y-3">
              
              {/* MBWAY - Desativado */}
              <label className="flex items-center justify-between p-4 border rounded-xl opacity-50 cursor-not-allowed border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <input type="radio" disabled className="w-4 h-4 text-gray-400 cursor-not-allowed" />
                  <span className="font-semibold text-gray-500">MBWay <span className="text-xs font-normal ml-2">(Temporariamente indisponível)</span></span>
                </div>
              </label>

              {/* Multibanco - Desativado */}
              <label className="flex items-center justify-between p-4 border rounded-xl opacity-50 cursor-not-allowed border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <input type="radio" disabled className="w-4 h-4 text-gray-400 cursor-not-allowed" />
                  <span className="font-semibold text-gray-500">Referência Multibanco <span className="text-xs font-normal ml-2">(Temporariamente indisponível)</span></span>
                </div>
              </label>

              {/* Loja - Ativo e Selecionado */}
              <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors border-green-500 bg-green-50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="pagamento" value="loja" checked={metodoPagamento === 'loja'} onChange={(e) => setMetodoPagamento(e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="font-semibold text-gray-800">Pagamento em Loja (Dinheiro/Cartão)</span>
                </div>
              </label>

            </div>

            <p className="mt-4 text-sm text-gray-600">A sua encomenda ficará reservada para levantamento e pagamento ao balcão.</p>
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => {
                const divisor = item.unit_type === 'kg' ? 1000 : 1;
                const custoLinha = (item.precoFinal / divisor) * item.quantidade;
                const labelUnidade = item.unit_type === 'kg' ? 'g' : ' un';

                return (
                  <div key={item.id} className="flex justify-between items-center text-sm group">
                    <div className="flex items-center gap-3 flex-1 pr-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-[10px]">📦</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 truncate max-w-[150px]">{item.product_name}</span>
                        <span className="text-xs text-gray-500 font-medium">{item.quantidade}{labelUnidade}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">{formatarValor(custoLinha)}€</span>
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
                <span>Levantamento na Loja</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-green-600">{formatarValor(cartTotal)}€</span>
            </div>

            <button 
              onClick={handleFinalizarEncomenda}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-colors shadow-sm text-lg flex justify-center items-center"
            >
              {loading ? 'A processar...' : 'Confirmar Encomenda'}
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