import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { isCartOpen, closeCart } = useCart();

  return (
    <>
      {/* Fundo escuro (Backdrop) */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 top-[72px] sm:top-0 bg-black/40 z-40 transition-opacity backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Painel Lateral */}
      <div 
        className={`fixed right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col 
        top-[72px] h-[calc(100vh-72px)] sm:top-0 sm:h-full`}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-green-900">O Seu Carrinho</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-red-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Lista de Produtos (Dados de Teste) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-4 items-center mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center text-2xl">🍎</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Maçãs de Alcobaça</h3>
              <p className="text-green-600 font-medium">1.50€</p>
            </div>
            {/* Controlos de Quantidade */}
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-1">
              <button className="px-2 text-gray-400 hover:text-green-600 transition">-</button>
              <span className="font-medium text-sm">2</span>
              <button className="px-2 text-gray-400 hover:text-green-600 transition">+</button>
            </div>
          </div>
        </div>

        {/* Rodapé: Total e Checkout */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-600">Total</span>
            <span className="text-2xl font-bold text-green-900">3.00€</span>
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm">
            Finalizar Compra
          </button>
        </div>
      </div>
    </>
  );
}