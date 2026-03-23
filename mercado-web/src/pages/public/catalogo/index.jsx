import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';
// 1. Importa o contexto
import { useCart } from '../../../context/public/CartContext';

export default function Catalogo() {
  const [produtosIniciais, setProdutosIniciais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Traz o addToCart do contexto
  const { addToCart } = useCart();

  const [pesquisa, setPesquisa] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes');
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 9;

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [pesquisa, categoriaAtiva, precoMin, precoMax, ordenacao]);

  const carregarDados = async () => {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        apiCRUD.read('/produtos'),
        apiCRUD.read('/categorias')
      ]);
      const produtosRecebidos = Array.isArray(resProdutos) ? resProdutos : (resProdutos.data || []);
      setProdutosIniciais(produtosRecebidos);
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

  const getIconeCategoria = (nome) => {
    const icones = {
      'Frutas': '🍎',
      'Legumes': '🥕',
      'Padaria': '🥖',
      'Laticínios': '🧀',
      'Carne': '🥩',
      'Peixe': '🐟',
      'Bebidas': '🥤',
      'Congelados': '🧊',
      'Mercearia': '🥫',
    };
    return icones[nome] || '📦';
  };

  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

  const formatarPreco = (valor) => parsePreco(valor).toFixed(2);

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
    const precoA = a.best_cost ? parsePreco(a.best_cost) : parsePreco(a.product_cost);
    const precoB = b.best_cost ? parsePreco(b.best_cost) : parsePreco(b.product_cost);

    if (ordenacao === 'precoAsc') return precoA - precoB;
    if (ordenacao === 'precoDesc') return precoB - precoA;
    if (ordenacao === 'nomeAsc') return (a.product_name || '').localeCompare(b.product_name || '');
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const indexUltimoProduto = paginaAtual * produtosPorPagina;
  const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;
  const produtosPaginados = produtosFiltrados.slice(indexPrimeiroProduto, indexUltimoProduto);
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Catálogo de Produtos</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* BARRA LATERAL (FILTROS) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filtros
            </h2>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Categorias</h3>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                
                <label className={`flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors ${categoriaAtiva === 'Todas' ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="categoria" checked={categoriaAtiva === 'Todas'} onChange={() => setCategoriaAtiva('Todas')} className="hidden" />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${categoriaAtiva === 'Todas' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    🌐
                  </div>
                  <span className={`font-medium ${categoriaAtiva === 'Todas' ? 'text-green-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    Todas
                  </span>
                </label>

                {categorias.map(cat => (
                  <label key={cat.id} className={`flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors ${categoriaAtiva === cat.category_name ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="categoria" checked={categoriaAtiva === cat.category_name} onChange={() => setCategoriaAtiva(cat.category_name)} className="hidden" />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm ${categoriaAtiva === cat.category_name ? 'bg-white border-2 border-green-500' : 'bg-white border border-gray-100 group-hover:border-gray-300'}`}>
                      {getIconeCategoria(cat.category_name)}
                    </div>
                    <span className={`font-medium ${categoriaAtiva === cat.category_name ? 'text-green-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {cat.category_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Preço (€)</h3>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={precoMin} onChange={(e) => setPrecoMin(e.target.value)} placeholder="Mín" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                <span className="text-gray-400">-</span>
                <input type="number" min="0" value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} placeholder="Máx" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Ordenar Por</h3>
              <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white">
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
          
          <div className="mb-6 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Pesquisar produtos..." 
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none shadow-sm"
            />
          </div>

          {loading ? (
            <div className="text-center p-10 text-gray-500">A carregar produtos...</div>
          ) : produtosPaginados.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {produtosPaginados.map((product) => {
                  const precoNormal = parsePreco(product.product_cost); 
                  const precoDesconto = parsePreco(product.best_cost);
                  const temDesconto = product.best_cost && precoDesconto > 0 && precoDesconto < precoNormal;
                  const precoAtivo = temDesconto ? precoDesconto : precoNormal;
                  
                  // Variáveis limpas de unidade
                  const minQty = Number(product.product_min_quantity) || 1;
                  const divisor = product.unit_type === 'kg' ? 1000 : 1;
                  const unitStr = product.unit_type === 'kg' ? 'kg' : 'un';
                  const minUnitStr = product.unit_type === 'kg' ? 'g' : 'un';
                  
                  const custoDoIncremento = (precoAtivo / divisor) * minQty;

                  return (
                    <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col relative">
                      {temDesconto && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">PROMO</span>
                      )}

                      <Link to={`/loja/catalogo/produto/${product.id}`} className="flex flex-col flex-1">
                        <div className="bg-green-50 rounded-xl h-48 flex items-center justify-center mb-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                          {product.image_base64 || product.imagem ? (
                            <img src={product.image_base64 || product.imagem} alt={product.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-sm">Sem imagem</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                            {getNomeCategoria(product.category_id)}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 mt-1">{product.product_name}</h3>
                        </div>
                      </Link>

                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                          
                          {/* PREÇO BASE (Menos chamativo, no topo) */}
                          {temDesconto ? (
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-xs text-gray-400 line-through">{formatarPreco(precoNormal)}€/{unitStr}</span>
                               <span className="text-xs font-semibold text-green-600">{formatarPreco(precoDesconto)}€/{unitStr}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-gray-500 mb-1">
                              {formatarPreco(precoNormal)}€/{unitStr}
                            </span>
                          )}

                          {/* PREÇO DO INCREMENTO (Destaque principal, em baixo) */}
                          <span className={temDesconto ? "text-xl font-black text-green-600 leading-none" : "text-xl font-black text-gray-900 leading-none"}>
                            {formatarPreco(custoDoIncremento)}€<span className="text-sm font-normal text-gray-500">/{minQty}{minUnitStr}</span>
                          </span>

                        </div>
                        
                        {/* Botão de Adicionar envia a quantidade mínima exata */}
                        <button 
                          onClick={() => addToCart(product, minQty)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl transition-colors shrink-0 mb-1"
                          title={`Adicionar ${minQty}${minUnitStr}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Controlos de Paginação */}
              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-auto pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaAtual === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button 
                    onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaAtual === totalPaginas}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-10 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500">Nenhum produto encontrado com estes filtros.</p>
              <button onClick={() => { setPesquisa(''); setCategoriaAtiva('Todas'); setPrecoMin(''); setPrecoMax(''); }} className="mt-4 text-green-600 font-medium hover:underline">
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}