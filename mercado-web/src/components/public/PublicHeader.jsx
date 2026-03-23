import { Link } from 'react-router-dom';
import { useCart } from '../../context/public/CartContext'; 

export default function PublicHeader() {
    // 1. Puxar as variáveis de totalização do Contexto
    const { toggleCart, cartCount, cartTotal } = useCart();

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 font-sans">
            <div className="container mx-auto px-4 py-3">
                
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* A. BLOCO DA ESQUERDA */}
                    <div className="flex items-center justify-between">
                        <Link to="/loja" className="flex items-center gap-2">
                            <div className="bg-green-600 text-white p-1.5 rounded-lg">
                                <span className="font-bold text-lg leading-none">M</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">
                                Mercearia<span className="text-green-600">Orestes</span>
                            </span>
                        </Link>

                        {/* Carrinho Mobile */}
                        <button onClick={toggleCart} className="md:hidden relative p-2 hover:bg-gray-100 rounded-full transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                            </svg>
                            {/* 2. Bolinha dinâmica Mobile */}
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
                            </nav>

                            <div className="h-6 w-px bg-gray-200"></div>

                            {/* Carrinho Desktop */}
                            <button onClick={toggleCart} className="flex items-center gap-2 hover:opacity-80 transition">
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                    </svg>
                                    {/* 3. Bolinha dinâmica Desktop */}
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </div>
                                {/* 4. Preço dinâmico Desktop */}
                                <span className="font-bold text-gray-700">
                                    €{Number(cartTotal || 0).toFixed(2)}
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
                
                {/* MENU RÁPIDO MOBILE */}
                <div className="md:hidden flex items-center gap-4 mt-2 overflow-x-auto pb-1 text-sm font-medium text-gray-600 no-scrollbar">
                    <Link to="/loja/catalogo" className="whitespace-nowrap px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                        📦 Catálogo
                    </Link>
                    <Link to="/loja/promocoes" className="whitespace-nowrap px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">
                        🏷️ Promoções
                    </Link>
                </div>

            </div>
        </header>
    );
}