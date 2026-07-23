import { Link } from 'react-router-dom';
import { useCart } from '../../context/public/CartContext'; 

// 1. Importa a imagem no topo (ajusta os '../' se a pasta assets estiver noutro nível)
import logoOrestes from '../../assets/canvas.png'; 

export default function PublicHeader() {
    const { toggleCart, cartCount, cartTotal } = useCart();

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 font-sans">
            <div className="container mx-auto px-4 py-3">
                
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                    
                    {/* A. BLOCO DA ESQUERDA */}
                    <div className="flex items-center justify-between">
                        {/* MUDANÇA AQUI: gap-3 alterado para gap-1 para aproximar a logo do texto */}
                        <Link to="/loja" className="flex items-center   hover:opacity-90 transition-opacity">
                            {/* LOGÓTIPO MAIOR E COM OBJECT-CONTAIN */}
                            <img 
                                src={logoOrestes} 
                                alt="" 
                                className="h-12 w-12 md:h-16 md:w-16 object-contain drop-shadow-sm"
                            />
                            <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                Mercado<span className="text-green-600">Orestes</span>
                            </span>
                        </Link>

                        {/* Carrinho Mobile */}
                        <button onClick={toggleCart} className="md:hidden relative p-2 hover:bg-gray-100 rounded-full transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                            </svg>
                            {/* Bolinha dinâmica Mobile */}
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* B. BLOCO DA DIREITA */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:ml-auto w-full md:w-auto">
                        
                        <div className="hidden md:flex items-center gap-6">
                            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
                                <Link to="/loja/catalogo" className="hover:text-green-600 transition">Catálogo</Link>
                                <Link to="/loja/promocoes" className="hover:text-green-600 transition text-red-600">Promoções</Link>
                                
                                <Link to="/loja/favoritos" className="text-green-600 hover:text-green-700 transition flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    Favoritos
                                </Link>

                                <Link to="/loja/historico" className="hover:text-green-600 transition flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    As Minhas Encomendas
                                </Link>
                            </nav>

                            <div className="h-6 w-px bg-gray-200"></div>

                            {/* Carrinho Desktop */}
                            <button onClick={toggleCart} className="flex items-center gap-2 hover:opacity-80 transition">
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="font-bold text-gray-700">
                                    €{Number(cartTotal || 0).toFixed(2)}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                
                 

            </div>
        </header>
    );
}