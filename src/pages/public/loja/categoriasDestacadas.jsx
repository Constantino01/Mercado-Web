import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';
import { useCart } from '../../../context/public/CartContext'; 
import { useFavorites } from '../../../context/public/FavoritesContext';
import { useSettings } from '../../../context/public/SettingsContext';

export default function CategoriasDestacadas() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { allowPurchases } = useSettings();
  const navigate = useNavigate();
  
  const isDraggingRef = useRef(false);

  useEffect(() => {
    carregarDados();
  }, []);

 const carregarDados = async () => {
    try {
      const [resCategorias, resProdutos] = await Promise.all([
        apiCRUD.read('/categorias'),
        apiCRUD.read('/produtos')
      ]);
      
      // VAMOS ESPIAR O QUE VEM LÁ DE DENTRO!
      console.log('🔍 RESPOSTA CATEGORIAS:', resCategorias);
      console.log('🔍 RESPOSTA PRODUTOS:', resProdutos);
      
      const cats = Array.isArray(resCategorias) ? resCategorias : (resCategorias?.data || []);
      const prods = Array.isArray(resProdutos) ? resProdutos : (resProdutos?.data || []);
      
      console.log('📦 CATEGORIAS EXTRAÍDAS:', cats);
      console.log('📦 PRODUTOS EXTRAÍDOS:', prods);

      // Algumas bases de dados devolvem 1 em vez de true, vamos garantir que apanha tudo
      const destaquesCats = cats.filter(c => c.is_featured === true || c.is_featured === 1 || c.is_featured === "1");
      const destaquesProds = prods.filter(p => p.is_featured === true || p.is_featured === 1 || p.is_featured === "1");

      console.log('⭐ CATEGORIAS DESTACADAS (Finais):', destaquesCats);

      setCategorias(destaquesCats);
      setProdutos(destaquesProds);
    } catch (error) {
      console.error('Erro ao carregar destaques:', error);
    } finally {
      setLoading(false);
    }
  };

  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

  const formatarPreco = (valor) => parsePreco(valor).toFixed(2).replace('.', ',');

  const getBrightness = (hexColor) => {
    if (!hexColor) return 255; 
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const handleMouseDown = (e) => {
    const slider = e.currentTarget;
    slider.setAttribute('data-isdown', 'true');
    slider.setAttribute('data-startx', e.pageX - slider.offsetLeft);
    slider.setAttribute('data-scrollleft', slider.scrollLeft);
    
    slider.classList.remove('snap-x');
    slider.classList.add('cursor-grabbing');
    isDraggingRef.current = false; 
  };

  const handleMouseLeaveOrUp = (e) => {
    const slider = e.currentTarget;
    slider.setAttribute('data-isdown', 'false');
    slider.classList.remove('cursor-grabbing');
    slider.classList.add('snap-x');
    
    setTimeout(() => { isDraggingRef.current = false; }, 50);
  };

  const handleMouseMove = (e) => {
    const slider = e.currentTarget;
    if (slider.getAttribute('data-isdown') !== 'true') return;
    e.preventDefault();
    const startX = parseFloat(slider.getAttribute('data-startx'));
    const scrollLeft = parseFloat(slider.getAttribute('data-scrollleft'));
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2; 
    
    if (Math.abs(walk) > 5) {
      isDraggingRef.current = true; 
    }
    
    slider.scrollLeft = scrollLeft - walk;
  };

  const handleCardClick = (e, produtoId) => {
    if (isDraggingRef.current) return; 
    navigate(`/loja/catalogo/produto/${produtoId}`);
  };

  const handleToggleFavorito = (e, produto) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(produto);
  };

  const handleAddToCart = (e, produto, minQty) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(produto, minQty);
  };

  if (loading) {
    return <div className="animate-pulse bg-slate-200 rounded-[32px] h-[350px] max-w-7xl mx-auto my-12"></div>;
  }

  if (categorias.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-12 relative">
      {categorias.map(cat => {
        const produtosDaCategoria = produtos.filter(p => p.category_id === cat.id);
        if (produtosDaCategoria.length === 0) return null;

        const bgColor = cat.category_color || '#e5e7eb';
        const isDarkBg = getBrightness(bgColor) < 160;
        const textColor = isDarkBg ? 'text-white' : 'text-slate-900';
        const mutedTextColor = isDarkBg ? 'text-white/80' : 'text-slate-800';

        return (
          <section key={cat.id} className="relative mb-10 last:mb-0">
            {/* FUNDO FLUIDO COM TEXTURA */}
            <div 
              className="absolute inset-x-0 top-4 bottom-0 rounded-[32px] overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              {/* Padrão de Linhas Diagonais */}
              <div 
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" 
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 24px)' }}
              ></div>
              
              {/* Efeitos de Luz / Sombra */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-[60px] translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black opacity-10 rounded-full blur-[50px] -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
            </div>

            <div className="relative z-10 px-6 md:px-10 pt-10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 pointer-events-none">
              <div className="flex items-center gap-4 md:gap-6">
                  {cat.category_image && (
                    <img 
                      src={cat.category_image} 
                      alt={cat.category_name} 
                      className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-xl flex-shrink-0"
                    />
                  )}
                  <h2 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${textColor} drop-shadow-sm`}>
                    <span className="block text-xs md:text-sm font-bold opacity-80 mb-0.5 uppercase tracking-widest">Destaques</span>
                    {cat.category_name}
                  </h2>
              </div>
              
              <div className="flex flex-col md:items-end gap-2 pointer-events-auto">
                <p className={`text-sm leading-relaxed font-medium ${mutedTextColor} max-w-xs md:text-right hidden sm:block`}>
                  {cat.category_description || `Explore a nossa seleção fresca de ${cat.category_name.toLowerCase()}.`}
                </p>
                <Link 
                  to={`/loja/catalogo?categoria=${cat.category_name}`}
                  className={`inline-flex items-center gap-2 font-bold text-sm py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:-translate-y-0.5 flex-shrink-0 w-max ${
                    isDarkBg 
                      ? 'bg-white text-slate-900 hover:shadow-white/20' 
                      : 'bg-slate-900 text-white hover:shadow-black/20'
                  }`}
                >
                  Ver Todos
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </Link>
              </div>
            </div>

            <div className="relative z-10 px-2 sm:px-6">
              <div 
                className="flex gap-4 overflow-x-auto pt-16 pb-8 custom-scrollbar snap-x px-4 cursor-grab active:cursor-grabbing scroll-smooth"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
              >
                {produtosDaCategoria.map(produto => {
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

                  const favoritado = isFavorite(produto.id);

                  return (
                    <div 
                      key={produto.id} 
                      onClick={(e) => handleCardClick(e, produto.id)}
                      className="min-w-[240px] max-w-[240px] md:min-w-[260px] md:max-w-[260px] bg-white rounded-[24px] p-5 flex flex-col shadow-lg border border-white snap-center relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 mt-2 select-none cursor-pointer"
                    >
                      {/* ETIQUETA DE DESCONTO */}
                      {temDesconto && (
                        <div className="absolute top-4 right-4 z-20 pointer-events-none">
                          <div className="bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm rotate-3 group-hover:rotate-6 transition-transform">
                            -{percentagem}%
                          </div>
                        </div>
                      )}

                      {/* FUNDO/PEDESTAL DA IMAGEM COM TEXTURA */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-slate-50/50 rounded-full border border-slate-100 shadow-inner overflow-hidden pointer-events-none group-hover:scale-105 transition-transform duration-500">
                        <div 
                          className="w-full h-full opacity-30" 
                          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '8px 8px' }}
                        ></div>
                      </div>

                      {/* IMAGEM BREAKOUT */}
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-32 h-32 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 z-10 pointer-events-none flex items-center justify-center">
                        {produto.product_image ? (
                          <img src={produto.product_image} alt={produto.product_name} className="max-w-full max-h-full object-contain pointer-events-none" draggable="false" />
                        ) : (
                          <span className="text-sm text-slate-400 font-medium">Sem Foto</span>
                        )}
                      </div>

                      <div className="mt-20 text-center flex flex-col flex-1 pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {cat.category_name}
                        </span>

                        <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                          {produto.product_name}
                        </h3>
                        
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

                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                        
                        <button 
                          onClick={(e) => handleToggleFavorito(e, produto)}
                          className={`p-2.5 rounded-xl transition-colors active:scale-95 ${favoritado ? 'bg-rose-100 text-rose-500' : 'bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                          title={favoritado ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={favoritado ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>

                        {/* RENDERIZAÇÃO CONDICIONAL DA COMPRA */}
                        {allowPurchases ? (
                          <button 
                            onClick={(e) => handleAddToCart(e, produto, minQty)}
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
                <div className="min-w-[10px] md:min-w-[20px] shrink-0 pointer-events-none"></div>
              </div>
            </div>

          </section>
        );
      })}
    </div>
  );
}