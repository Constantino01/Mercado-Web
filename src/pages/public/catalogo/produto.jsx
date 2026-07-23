import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/public/CartContext';
import { apiCRUD } from '../../../utils/api';

export default function Produto() {
  const { id } = useParams();
  
  const { openCart, addToCart } = useCart(); 
  
  const [quantidade, setQuantidade] = useState(1);
  const [produto, setProduto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [id]);

  useEffect(() => {
    if (produto) {
      setQuantidade(produto.unit_type === 'kg' ? 100 : 1);
    }
  }, [produto]);

  const carregarDados = async () => {
    try {
      const [resProduto, resCategorias] = await Promise.all([
        apiCRUD.read(`/produtos/${id}`),
        apiCRUD.read('/categorias')
      ]);
      
      setProduto(resProduto.data || resProduto);
      setCategorias(Array.isArray(resCategorias) ? resCategorias : (resCategorias.data || []));
    } catch (error) {
      console.error('Erro ao carregar detalhes do produto:', error);
      setProduto(null);
    } finally {
      setLoading(false);
    }
  };

  const getNomeCategoria = (catId) => {
    const cat = categorias.find(c => c.id === catId);
    return cat ? cat.category_name : 'Sem Categoria';
  };

  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

  const formatarPreco = (valor) => parsePreco(valor).toFixed(2).replace('.', ',');

  const handleAdicionarAoCarrinho = () => {
    if (addToCart) {
      addToCart(produto, quantidade);
    }
    openCart(); 
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-32 text-center text-slate-500 font-medium animate-pulse">A carregar produto...</div>;
  }

  if (!produto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Produto não encontrado</h2>
        <Link to="/loja/catalogo" className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors">Voltar ao Catálogo</Link>
      </div>
    );
  }

  const precoNormal = parsePreco(produto.product_cost);
  const precoDesconto = parsePreco(produto.best_cost);
  const temDesconto = produto.best_cost && precoDesconto > 0 && precoDesconto < precoNormal;
  
  const percentagem = precoNormal > 0 ? Math.round(((precoNormal - precoDesconto) / precoNormal) * 100) : 0;

  const isKg = produto.unit_type === 'kg';
  const labelUnidade = isKg ? 'g' : 'un';
  const labelPrecoPor = isKg ? '/ kg' : '/ un';
  const passoGrama = 50; 

  const decrementar = () => setQuantidade(q => Math.max(isKg ? passoGrama : 1, q - (isKg ? passoGrama : 1)));
  const incrementar = () => setQuantidade(q => q + (isKg ? passoGrama : 1));

  const precoAtual = temDesconto ? precoDesconto : precoNormal;
  const divisor = isKg ? 1000 : 1;
  const precoCalculado = (precoAtual / divisor) * quantidade;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      
      <div className="mb-6">
        <Link to="/loja/catalogo" className="text-slate-500 hover:text-green-700 flex items-center gap-2 w-fit transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar ao Catálogo
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Imagem do Produto */}
        <div className="md:w-1/2 bg-white flex items-center justify-center p-12 sm:p-20 min-h-[400px] relative border-b md:border-b-0 md:border-r border-slate-200">
          
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10 pointer-events-none">
             {temDesconto && (
                <div className="relative mb-2">
                   <div className="absolute inset-0 bg-green-800 rounded-lg translate-y-[3px] translate-x-[3px]"></div>
                   <div className="relative bg-green-600 text-white font-black text-xs px-4 py-2 uppercase tracking-wide rounded-lg border-2 border-green-600 shadow-sm">
                     Poupe mais de {percentagem}%
                   </div>
                </div>
              )}
            <span className="bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold tracking-widest px-3 py-1.5 rounded-md shadow-sm w-fit uppercase">
              {isKg ? '⚖️ A PESO' : '📦 UNIDADE'}
            </span>
          </div>

          {produto.product_image ? (
            <img 
              src={produto.product_image} 
              alt={produto.product_name} 
              className="max-w-full h-auto max-h-[400px] object-contain drop-shadow-sm transition-transform duration-500 mix-blend-multiply"
            />
          ) : (
            <div className="text-slate-300 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span className="mt-4 text-sm font-medium text-slate-400">Sem imagem fotográfica</span>
            </div>
          )}
        </div>

        {/* Detalhes do Produto */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-widest">
              {getNomeCategoria(produto.category_id)}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            {produto.product_name}
          </h1>
          
          {/* NOVO CAMPO: Descrição do Produto */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descrição do Produto</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              {produto.product_description || 'Este artigo ainda não possui uma descrição detalhada. Para mais informações sobre alergénios ou características, contacte-nos.'}
            </p>
          </div>
          
          {/* Bloco de Preços */}
          <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
            {temDesconto ? (
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Preço Atual:</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-900">
                    {formatarPreco(precoDesconto)} €<span className="text-lg font-medium text-slate-500 ml-1">{labelPrecoPor}</span>
                  </span>
                  <span className="text-lg text-slate-400 line-through font-medium">
                    {formatarPreco(precoNormal)} €
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Preço Base:</span>
                <div className="text-4xl font-black text-slate-900">
                  {formatarPreco(precoNormal)} €<span className="text-lg font-medium text-slate-500 ml-1">{labelPrecoPor}</span>
                </div>
              </div>
            )}
          </div>

          {/* Adicionar ao Carrinho */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            
            {/* Seletor de Quantidade */}
            <div className="flex items-center justify-between border border-slate-300 rounded-xl p-1.5 w-full sm:w-40 bg-white shadow-sm">
              <button 
                onClick={decrementar}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-lg text-slate-900 leading-none">{quantidade}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{labelUnidade}</span>
              </div>
              <button 
                onClick={incrementar}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            {/* Botão Adicionar */}
            <button 
              onClick={handleAdicionarAoCarrinho}
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-between px-6 border border-green-800"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Adicionar ao Carrinho
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-md text-sm font-black tracking-wide">
                {formatarPreco(precoCalculado)} €
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}