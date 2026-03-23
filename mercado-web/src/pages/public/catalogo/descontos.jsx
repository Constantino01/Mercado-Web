import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';
import { useCart } from '../../../context/public/CartContext';

export default function Descontos() {
  const [produtosPromocao, setProdutosPromocao] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [pesquisa, setPesquisa] = useState(''); // Novo estado de pesquisa
  
  const { addToCart } = useCart();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        apiCRUD.read('/produtos'),
        apiCRUD.read('/categorias')
      ]);
      
      const todosProdutos = Array.isArray(resProdutos) ? resProdutos : (resProdutos.data || []);
      const todasCategorias = Array.isArray(resCategorias) ? resCategorias : (resCategorias.data || []);
      
      setCategorias(todasCategorias);

      const comDesconto = todosProdutos.filter(p => {
        const precoNormal = parsePreco(p.product_cost);
        const precoDesconto = parsePreco(p.best_cost);
        return p.best_cost && precoDesconto > 0 && precoDesconto < precoNormal;
      });

      setProdutosPromocao(comDesconto);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
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
      'Frutas': '🍎', 'Legumes': '🥕', 'Padaria': '🥖', 'Laticínios': '🧀',
      'Carne': '🥩', 'Peixe': '🐟', 'Bebidas': '🥤', 'Congelados': '🧊', 'Mercearia': '🥫',
    };
    return icones[nome] || '📦';
  };

  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

  const formatarPreco = (valor) => parsePreco(valor).toFixed(2);

  const calcularPercentagem = (normal, desconto) => {
    if (normal === 0) return 0;
    const poupanca = normal - desconto;
    return Math.round((poupanca / normal) * 100);
  };

  // 1. APLICA FILTRO DE CATEGORIA E PESQUISA
  const produtosFiltrados = produtosPromocao.filter(p => {
    const matchCategoria = categoriaAtiva === 'Todas' || getNomeCategoria(p.category_id) === categoriaAtiva;
    const matchPesquisa = (p.product_name || '').toLowerCase().includes(pesquisa.toLowerCase());
    return matchCategoria && matchPesquisa;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <h1 className="text-3xl font-bold text-red-600 mb-8 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.5-4.5 4.5 4.5"/><path d="m2 17 4.5 4.5 4.5-4.5"/><path d="M6 3v18"/><path d="m13 14.5 9-9"/><path d="M17.5 5.5 22 10"/><circle cx="15.5" cy="11.5" r="1.5"/><circle cx="19.5" cy="15.5" r="1.5"/></svg>
        Promoções da Semana
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* BARRA LATERAL (FILTROS) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-red-900 mb-4">Filtros de Promoções</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Categorias</h3>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                
                <label className={`flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors ${categoriaAtiva === 'Todas' ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="categoria" checked={categoriaAtiva === 'Todas'} onChange={() => setCategoriaAtiva('Todas')} className="hidden" />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${categoriaAtiva === 'Todas' ? 'bg-red-100' : 'bg-gray-100'}`}>
                    🌐
                  </div>
                  <span className={`font-medium ${categoriaAtiva === 'Todas' ? 'text-red-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    Todas
                  </span>
                </label>

                {categorias.filter(cat => produtosPromocao.some(p => p.category_id === cat.id)).map(cat => (
                  <label key={cat.id} className={`flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors ${categoriaAtiva === cat.category_name ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="categoria" checked={categoriaAtiva === cat.category_name} onChange={() => setCategoriaAtiva(cat.category_name)} className="hidden" />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm ${categoriaAtiva === cat.category_name ? 'bg-white border-2 border-red-500' : 'bg-white border border-gray-100 group-hover:border-gray-300'}`}>
                      {getIconeCategoria(cat.category_name)}
                    </div>
                    <span className={`font-medium ${categoriaAtiva === cat.category_name ? 'text-red-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {cat.category_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <div className="flex-1 flex flex-col">
          
          {/* Barra de Pesquisa */}
          <div className="mb-6 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Pesquisar nas promoções..." 
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none shadow-sm"
            />
          </div>

          {loading ? (
             <div className="text-center p-10 text-gray-500">A procurar os melhores descontos...</div>
          ) : produtosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {produtosFiltrados.map((product) => {
                const precoNormal = parsePreco(product.product_cost); 
                const precoDesconto = parsePreco(product.best_cost);
                const percentagem = calcularPercentagem(precoNormal, precoDesconto);

                return (
                  <div key={product.id} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col relative overflow-hidden">
                    
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow-sm">
                      -{percentagem}%
                    </div>

                    <Link to={`/loja/catalogo/produto/${product.id}`} className="flex flex-col flex-1">
                      <div className="bg-red-50/50 rounded-xl h-48 flex items-center justify-center mb-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                        {product.image_base64 || product.imagem ? (
                          <img src={product.image_base64 || product.imagem} alt={product.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-sm">Sem imagem</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                          {getNomeCategoria(product.category_id)}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">{product.product_name}</h3>
                      </div>
                    </Link>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-sm text-gray-400 line-through block">€{formatarPreco(precoNormal)}</span>
                        <span className="text-xl font-black text-red-600">€{formatarPreco(precoDesconto)}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition-colors shadow-sm shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-10 bg-gray-50 rounded-2xl border border-gray-100 h-full flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              <p className="text-gray-500 font-medium">Nenhum produto em promoção encontrado com estes filtros.</p>
              <button onClick={() => { setCategoriaAtiva('Todas'); setPesquisa(''); }} className="mt-4 text-red-600 font-medium hover:underline">
                Limpar filtros
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}