import { Link } from 'react-router-dom';
import { useFavorites } from '../../../context/public/FavoritesContext';
import { useCart } from '../../../context/public/CartContext';
import { useSettings } from '../../../context/public/SettingsContext';

export default function Favoritos() {
  const { favoritos, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { allowPurchases } = useSettings();

  // Funções utilitárias para o preço
  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

  const formatarPreco = (valor) => parsePreco(valor).toFixed(2).replace('.', ',');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 font-sans min-h-[70vh]">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="text-center mb-16 md:mb-24">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-500 rounded-full mb-6 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Meus Favoritos</h1>
        <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
          Guarde aqui os produtos que mais gosta para aceder e comprar rapidamente nas suas próximas visitas.
        </p>
      </div>

      {/* VERIFICAÇÃO: TEM FAVORITOS? */}
      {favoritos.length === 0 ? (
        
        /* ESTADO VAZIO (EMPTY STATE) */
        <div className="max-w-2xl mx-auto text-center bg-slate-50 rounded-[40px] p-10 md:p-16 border border-dashed border-slate-200">
          <h3 className="text-2xl font-bold text-slate-700 mb-3">A sua lista está vazia</h3>
          <p className="text-slate-500 mb-8 font-medium">
            Explore o nosso catálogo e clique no coração junto aos produtos para criar a sua lista de favoritos.
          </p>
          <Link 
            to="/loja/catalogo"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-slate-900/20 active:scale-95"
          >
            Explorar Catálogo
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>

      ) : (

        /* GRELHA DE PRODUTOS */
        // O gap-y-20 e o pt-12 (padding-top) são cruciais aqui para as imagens breakout não sobreporem a linha de cima
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-20 pt-12">
          
          {favoritos.map(produto => {
            const precoNormal = parsePreco(produto.product_cost); 
            const precoDesconto = parsePreco(produto.best_cost);
            const temDesconto = produto.best_cost && precoDesconto > 0 && precoDesconto < precoNormal;
            const precoAtivo = temDesconto ? precoDesconto : precoNormal;
            
            const percentagem = precoNormal > 0 ? Math.round(((precoNormal - precoAtivo) / precoNormal) * 100) : 0;
            
            const minQty = Number(produto.product_min_quantity) || 1;
            const divisor = produto.unit_type === 'kg' ? 1000 : 1;
            const unitStr = produto.unit_type === 'kg' ? 'KG' : 'UN';
            const custoDoIncremento = (precoAtivo / divisor) * minQty;
            
            const precoNormalStr = formatarPreco(precoNormal);
            const precoAtivoStr = formatarPreco(custoDoIncremento);

            return (
              <div 
                key={produto.id} 
                className="bg-white rounded-[24px] p-5 flex flex-col shadow-lg border border-slate-100 relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* ETIQUETA DE DESCONTO */}
                {temDesconto && (
                  <div className="absolute top-4 right-4 z-20 pointer-events-none">
                    <div className="bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm rotate-3 group-hover:rotate-6 transition-transform">
                      -{percentagem}%
                    </div>
                  </div>
                )}

                {/* IMAGEM BREAKOUT */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-32 h-32 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 z-10 pointer-events-none">
                  {produto.product_image ? (
                    <img src={produto.product_image} alt={produto.product_name} className="w-full h-full object-contain" draggable="false" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-sm text-slate-400">Sem Foto</div>
                  )}
                </div>

                <div className="mt-16 text-center flex flex-col flex-1">
                  
                  {/* Navegação para a página de detalhe */}
                  <Link to={`/loja/catalogo/produto/${produto.id}`} className="group-hover:text-green-600 transition-colors">
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2 mb-2">
                      {produto.product_name}
                    </h3>
                  </Link>
                  
                  <div className="text-xs text-slate-500 font-medium bg-slate-50 inline-block px-2.5 py-1 rounded-md mx-auto mb-3 border border-slate-100">
                    {minQty} {unitStr} | {temDesconto ? formatarPreco(precoDesconto) : precoNormalStr} €/{unitStr}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-0.5 mb-5">
                    {temDesconto && (
                      <span className="text-xs text-slate-400 line-through font-bold">{precoNormalStr} €</span>
                    )}
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      {precoAtivoStr} €
                    </span>
                  </div>
                  
                  <div className="flex-1"></div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                  
                  {/* BOTÃO REMOVER DOS FAVORITOS */}
                  <button 
                    onClick={() => toggleFavorite(produto)}
                    className="w-11 h-11 flex items-center justify-center bg-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors active:scale-95 shrink-0"
                    title="Remover dos Favoritos"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>

                  {/* RENDERIZAÇÃO CONDICIONAL DA COMPRA */}
                  {allowPurchases ? (
                    <button 
                      onClick={() => addToCart(produto, minQty)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg shadow-green-500/20"
                    >
                      Adicionar
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                  ) : (
                    <button 
                      disabled
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="flex-1 bg-gray-100 text-gray-400 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200"
                    >
                      
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    </button>
                  )}
                  
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}