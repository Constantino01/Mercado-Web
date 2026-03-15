import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <-- Ativado!

export default function PublicHeader() {
    // Agora vai buscar a função real ao contexto em vez de mostrar o alert
    const { toggleCart } = useCart();

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 font-sans">
            <div className="container mx-auto px-4 py-3">
                
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* A. BLOCO DA ESQUERDA */}
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
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
                            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                                0
                            </span>
                        </button>
                    </div>

                    {/* B. BLOCO DA DIREITA */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:ml-auto w-full md:w-auto">
                        
                        <div className="relative group w-full md:w-[600px]">
                            <input 
                                type="text" 
                                placeholder="O que procura hoje?" 
                                className="w-full bg-gray-100 text-gray-800 rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition shadow-sm border border-transparent focus:border-green-200"
                            />
                            <div className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-green-600 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                                </svg>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
                                <Link to="/catalogo" className="hover:text-green-600 transition">Catálogo</Link>
                                <Link to="/promocoes" className="hover:text-green-600 transition">Promoções</Link>
                            </nav>

                            <div className="h-6 w-px bg-gray-200"></div>

                            {/* Carrinho Desktop */}
                            <button onClick={toggleCart} className="flex items-center gap-2 hover:opacity-80 transition">
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                    </svg>
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                                        0
                                    </span>
                                </div>
                                <span className="font-bold text-gray-700">€0.00</span>
                            </button>
                        </div>
                    </div>

                </div>
                
                {/* MENU RÁPIDO MOBILE */}
                <div className="md:hidden flex items-center gap-4 mt-2 overflow-x-auto pb-1 text-sm font-medium text-gray-600 no-scrollbar">
                    <Link to="/catalogo" className="whitespace-nowrap px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                        📦 Catálogo
                    </Link>
                    <Link to="/frutas" className="whitespace-nowrap px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                        🍎 Frutas
                    </Link>
                    <Link to="/legumes" className="whitespace-nowrap px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                        🥦 Legumes
                    </Link>
                </div>

            </div>
        </header>
    );
}