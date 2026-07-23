import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';
import { useCart } from '../../../context/public/CartContext';
import { useFavorites } from '../../../context/public/FavoritesContext';
import { useSettings } from '../../../context/public/SettingsContext';

export default function Catalogo() {
  const [produtosIniciais, setProdutosIniciais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { allowPurchases } = useSettings();

  const [pesquisa, setPesquisa] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [ordenacao, setOrdenacao] = useState('destaques');
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 9;

  useEffect(() => {
    carregarDados();
  }, []);

  // Volta ao topo/página 1 sempre que os filtros mudam
  useEffect(() => {
    setPaginaAtual(1);
  }, [pesquisa, categoriaAtiva, precoMin, precoMax, ordenacao]);

  const carregarDados = async () => {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        apiCRUD.read('/produtos'),
        apiCRUD.read('/categorias')
      ]);
      const produtosProcessados = (Array.isArray(resProdutos) ? resProdutos : (resProdutos.data || [])).map(p => ({
        ...p,
        is_featured: p.is_featured || false,
        category_featured: p.category_featured || false
      }));
      setProdutosIniciais(produtosProcessados);
      setCategorias(Array.isArray(resCategorias) ? resCategorias : (resCategorias.data || []));
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNomeCategoria = (id) => {
    const cat = categorias.find(c => c.id === id);
    return cat ? cat.category_name : 'Sem Categoria';
  };

  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

  const formatarPreco = (valor) => parsePreco(valor).toFixed(2).replace('.', ',');

  let produtosFiltrados = produtosIniciais.filter(p => {
    const precoNormal = parsePreco(p.product_cost);
    const precoDesconto = p.best_cost ? parsePreco(p.best_cost) : precoNormal;
    const precoFinal = precoDesconto > 0 ? precoDesconto : precoNormal;
    
    const matchPesquisa = (p.product_name || '').toLowerCase().includes(pesquisa.toLowerCase());
    const matchCategoria = categoriaAtiva === 'Todas' || getNomeCategoria(p.category_id) === categoriaAtiva;
    const matchPrecoMin = precoMin === '' || precoFinal >= parsePreco(precoMin);
    const matchPrecoMax = precoMax === '' || precoFinal <= parsePreco(precoMax);

    return matchPesquisa && matchCategoria && matchPrecoMin && matchPrecoMax;
  });

  produtosFiltrados.sort((a, b) => {
    if (ordenacao === 'destaques') {
      if (categoriaAtiva === 'Todas') {
         if (a.is_featured && !b.is_featured) return -1;
         if (!a.is_featured && b.is_featured) return 1;
      } else {
         if (a.category_featured && !b.category_featured) return -1;
         if (!a.category_featured && b.category_featured) return 1;
      }
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }

    const precoA = a.best_cost ? parsePreco(a.best_cost) : parsePreco(a.product_cost);
    const precoB = b.best_cost ? parsePreco(b.best_cost) : parsePreco(b.product_cost);

    if (ordenacao === 'precoAsc') return precoA - precoB;
    if (ordenacao === 'precoDesc') return precoB - precoA;
    if (ordenacao === 'nomeAsc') return (a.product_name || '').localeCompare(b.product_name || '');
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  // Em vez de '.slice' que substitui, mostramos desde o 0 até ao limite atual
  const produtosExibidos = produtosFiltrados.slice(0, paginaAtual * produtosPorPagina);
  const temMaisPaginas = paginaAtual < Math.ceil(produtosFiltrados.length / produtosPorPagina);

  // === MAGIA DO INFINITE SCROLL AQUI ===
  const observer = useRef();
  const ultimoProdutoRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && temMaisPaginas) {
        setPaginaAtual(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, temMaisPaginas]);
  // =====================================

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

  return (
    <div className="min-h-screen bg-slate-50/30 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* BANNER DE DESTAQUE */}
        <div className="relative rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden shadow-md border border-slate-200">
          <img 
            src="https://thumbs.dreamstime.com/b/sortimento-de-frutas-e-legumes-org%C3%A2nicos-frescos-em-cores-arco-%C3%ADris-fundo-panor%C3%A2mico-alimentar-com-171245196.jpg" 
            alt="Fundo de Catálogo com Frescos" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-3 md:gap-4 mb-3 drop-shadow-md">
               Os Nossos Produtos
            </h1>
            <p className="text-slate-100 text-lg md:text-xl max-w-2xl font-medium leading-relaxed drop-shadow-sm">
              Explore a nossa seleção fresca e de alta qualidade, escolhida a pensar em si.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* BARRA LATERAL (FILTROS) */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filtros
              </h2>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">Categorias</h3>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  
                  <label className={`flex items-center gap-3 cursor-pointer group p-2 rounded-md transition-colors border-l-4 ${categoriaAtiva === 'Todas' ? 'bg-green-50 border-green-700' : 'border-transparent hover:bg-slate-50'}`}>
                    <input type="radio" name="categoria" checked={categoriaAtiva === 'Todas'} onChange={() => setCategoriaAtiva('Todas')} className="hidden" />
                    <span className={`font-medium text-sm ${categoriaAtiva === 'Todas' ? 'text-green-800' : 'text-slate-600 group-hover:text-slate-800'}`}>
                      Ver Todas
                    </span>
                  </label>

                  {categorias.map(cat => (
                    <label key={cat.id} className={`flex items-center gap-3 cursor-pointer group p-2 rounded-md transition-colors border-l-4 ${categoriaAtiva === cat.category_name ? 'bg-green-50 border-green-700' : 'border-transparent hover:bg-slate-50'}`}>
                      <input type="radio" name="categoria" checked={categoriaAtiva === cat.category_name} onChange={() => setCategoriaAtiva(cat.category_name)} className="hidden" />
                      <span className={`font-medium text-sm ${categoriaAtiva === cat.category_name ? 'text-green-800' : 'text-slate-600 group-hover:text-green-800'}`}>
                        {cat.category_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100 mb-6" />

              <div className="mb-6">
                <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">Preço (€)</h3>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={precoMin} onChange={(e) => setPrecoMin(e.target.value)} placeholder="Mín" className="w-full border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700" />
                  <span className="text-green-400">-</span>
                  <input type="number" min="0" value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} placeholder="Máx" className="w-full border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700" />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">Ordenar Por</h3>
                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 bg-white">
                  <option value="destaques">Recomendados</option>
                  <option value="recentes">Mais Recentes</option>
                  <option value="precoAsc">Preço: Menor para Maior</option>
                  <option value="precoDesc">Preço: Maior para Menor</option>
                  <option value="nomeAsc">Nome: A a Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* GRELHA PRINCIPAL */}
          <div className="flex-1 flex flex-col">
            
            <div className="mb-6 relative z-20"> 
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Pesquisar produtos..." 
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-green-700 focus:border-green-700 outline-none text-sm shadow-sm transition-all"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col animate-pulse">
                    <div className="bg-slate-100 rounded-xl h-40 mb-8 mt-2"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/3 mt-4"></div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                       <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                       <div className="h-4 bg-slate-200 rounded w-1/5"></div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 gap-4">
                      <div className="h-8 w-8 bg-slate-200 rounded-full shrink-0"></div>
                      <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : produtosExibidos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {produtosExibidos.map((product, index) => {
                  const precoNormal = parsePreco(product.product_cost); 
                  const precoDesconto = parsePreco(product.best_cost);
                  const temDesconto = product.best_cost && precoDesconto > 0 && precoDesconto < precoNormal;
                  const precoAtivo = temDesconto ? precoDesconto : precoNormal;
                  
                  const percentagem = precoNormal > 0 ? Math.round(((precoNormal - precoAtivo) / precoNormal) * 100) : 0;

                  const minQty = Number(product.product_min_quantity) || 1;
                  const divisor = product.unit_type === 'kg' ? 1000 : 1;
                  const unitStr = product.unit_type === 'kg' ? 'KG' : 'UN';
                  const minUnitStr = product.unit_type === 'kg' ? 'KG' : 'UN'; 
                  
                  const custoDoIncremento = (precoAtivo / divisor) * minQty;
                  
                  const precoNormalStr = formatarPreco(precoNormal);
                  const precoAtivoStr = formatarPreco(custoDoIncremento);

                  const favoritado = isFavorite(product.id);
                  const isUltimo = produtosExibidos.length === index + 1;

                  return (
                    // Injetar a ref no último elemento renderizado
                    <div ref={isUltimo ? ultimoProdutoRef : null} key={product.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
                      
                      {/* IMAGEM COM LAZY LOADING */}
                      <Link to={`/loja/catalogo/produto/${product.id}`} className="relative block h-40 mb-6 flex items-center justify-center">
                        {product.product_image ? (
                          <img 
                            src={product.product_image} 
                            alt={product.product_name} 
                            loading="lazy" 
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" 
                          />
                        ) : (
                          <span className="text-slate-300 text-sm">Sem imagem</span>
                        )}
                      </Link>

                      {/* ETIQUETA DE DESCONTO */}
                      {temDesconto && (
                        <div className="absolute top-[150px] left-4 z-10 pointer-events-none">
                           <div className="relative">
                              <div className="absolute inset-0 bg-green-800 rounded-lg translate-y-[3px] translate-x-[3px]"></div>
                              <div className="relative bg-green-600 text-white font-black text-[11px] px-3 py-1.5 uppercase tracking-wide rounded-lg border-2 border-green-600">
                                Poupe mais de {percentagem}%
                              </div>
                           </div>
                        </div>
                      )}

                      <div className="flex flex-col flex-1 mt-2">
                        {/* NOME & CATEGORIA */}
                        <Link to={`/loja/catalogo/produto/${product.id}`}>
                          <h3 className="text-[17px] font-semibold text-green-800 leading-snug line-clamp-2">
                            {product.product_name}
                          </h3>
                          <span className="text-[13px] text-green-600 mt-1 block">
                            {getNomeCategoria(product.category_id)}
                          </span>
                        </Link>
                        
                        {/* UNIDADE & PREÇO POR UNIDADE */}
                        <div className="text-xs text-green-400 mt-1">
                          {minQty} {minUnitStr} | {temDesconto ? formatarPreco(precoDesconto) : precoNormalStr} €/{unitStr}
                        </div>

                        {/* BLOCO DE PREÇOS */}
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-green-900">{precoAtivoStr} €</span>
                          {temDesconto && (
                            <span className="text-sm text-green-400 line-through font-medium">{precoNormalStr} €</span>
                          )}
                        </div>
                        
                        <div className="flex-1"></div> {/* Spacer */}

                        {/* AÇÕES */}
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                          
                          <button 
                            onClick={(e) => handleToggleFavorito(e, product)}
                            className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors active:scale-95 shrink-0 ${favoritado ? 'bg-rose-100 text-rose-500' : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500'}`}
                            title={favoritado ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={favoritado ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                          </button>
                          
                          {/* RENDERIZAÇÃO CONDICIONAL DA COMPRA */}
                          {allowPurchases ? (
                            <button 
                              onClick={(e) => handleAddToCart(e, product, minQty)}
                              className="flex-1 ml-3 border-2 border-green-700 text-green-700 bg-white hover:bg-green-50 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                              Adicionar
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            </button>
                          ) : (
                            <button 
                              disabled
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              className="flex-1 ml-3 bg-gray-100 text-gray-400 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            </button>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-12 bg-white border border-slate-200 rounded-lg shadow-sm relative z-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-300 mb-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <p className="text-green-500 font-medium">Nenhum produto encontrado nesta vista.</p>
                <button onClick={() => { setPesquisa(''); setCategoriaAtiva('Todas'); setPrecoMin(''); setPrecoMax(''); }} className="mt-4 text-sm text-green-700 font-semibold underline underline-offset-4 decoration-green-300 hover:decoration-green-700">
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}