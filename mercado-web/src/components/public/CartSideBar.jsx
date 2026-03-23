import { useCart } from "../../context/public/CartContext";
import { Link } from "react-router-dom";

export default function CartSidebar() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  const formatarValor = (valor) => {
    return Number(valor || 0).toFixed(2);
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 top-[72px] sm:top-0 bg-black/40 z-40 transition-opacity backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col 
        top-[72px] h-[calc(100vh-72px)] sm:top-0 sm:h-full`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-green-900">
            O Seu Carrinho {cartItems.length > 0 && `(${cartItems.length})`}
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" className="mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <p className="text-lg font-medium">O seu carrinho está vazio.</p>
              <button onClick={closeCart} className="mt-4 text-green-600 hover:underline">Continuar a comprar</button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => {
                // Cálculo e variáveis preparadas para este produto em específico
                const minQty = Number(item.product_min_quantity) || 1;
                const divisor = item.unit_type === 'kg' ? 1000 : 1;
                const custoLinha = (item.precoFinal / divisor) * item.quantidade;
                const labelUnidade = item.unit_type === 'kg' ? 'g' : ' un';

                return (
                  <div key={item.id} className="flex gap-4 items-center group relative">
                    
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {item.image_base64 || item.imagem ? (
                        <img src={item.image_base64 || item.imagem} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">📦</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate" title={item.product_name}>
                        {item.product_name}
                      </h3>
                      {/* Mostra o preço calculado da linha em vez do preço por Kg */}
                      <p className="text-green-600 font-medium">{formatarValor(custoLinha)}€</p>
                    </div>
                    
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 shrink-0 bg-white">
                      {/* Diminui usando a quantidade mínima */}
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantidade - minQty)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                      >
                        -
                      </button>
                      
                      {/* Mostra quantidade + gramas ou unidades */}
                      <span className="font-medium text-xs w-10 text-center text-gray-700">
                        {item.quantidade}{labelUnidade}
                      </span>
                      
                      {/* Aumenta usando a quantidade mínima */}
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantidade + minQty)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute -top-2 -left-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remover"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-600">Total</span>
              <span className="text-2xl font-bold text-green-900">{formatarValor(cartTotal)}€</span>
            </div>
            <Link
              to="/loja/checkout"
              onClick={closeCart}
              className="block text-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}