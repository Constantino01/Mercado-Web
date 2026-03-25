import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/public/CartContext';
import { apiCRUD } from '../../../utils/api';

export default function Produto() {
  const { id } = useParams();
  
  // 1. Puxar também a função de adicionar ao carrinho do Contexto
  const { openCart, addToCart } = useCart(); 
  
  const [quantidade, setQuantidade] = useState(1);
  const [produto, setProduto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [id]);

  // 2. Ajustar a quantidade inicial quando o produto carrega (100g se for a peso, 1 se for unidade)
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

  const formatarPreco = (valor) => parsePreco(valor).toFixed(2);

  const handleAdicionarAoCarrinho = () => {
    if (addToCart) {
      addToCart(produto, quantidade);
    }
    openCart(); 
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gray-500 font-medium animate-pulse">A carregar produto...</div>;
  }

  if (!produto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
        <Link to="/loja/catalogo" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">Voltar ao Catálogo</Link>
      </div>
    );
  }

  // Lógica de Preços e Unidades
  const precoNormal = parsePreco(produto.product_cost);
  const precoDesconto = parsePreco(produto.best_cost);
  const temDesconto = produto.best_cost && precoDesconto > 0 && precoDesconto < precoNormal;
  
  const isKg = produto.unit_type === 'kg';
  const labelUnidade = isKg ? 'g' : ' un';
  const labelPrecoPor = isKg ? '/ kg' : '/ un';
  const passoGrama = 50; // Se for ao kg, salta de 50 em 50 gramas

  const decrementar = () => setQuantidade(q => Math.max(isKg ? passoGrama : 1, q - (isKg ? passoGrama : 1)));
  const incrementar = () => setQuantidade(q => q + (isKg ? passoGrama : 1));

  // Preço que aparece no ecrã atualizado consoante a quantidade escolhida
  const precoAtual = temDesconto ? precoDesconto : precoNormal;
  const divisor = isKg ? 1000 : 1;
  const precoCalculado = (precoAtual / divisor) * quantidade;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="mb-6">
        <Link to="/loja/catalogo" className="text-gray-500 hover:text-green-600 flex items-center gap-2 w-fit transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar ao Catálogo
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Imagem do Produto */}
        <div className="md:w-1/2 bg-gray-50/50 flex items-center justify-center p-12 sm:p-20 min-h-[400px] relative border-b md:border-b-0 md:border-r border-gray-100">
          
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {temDesconto && (
              <span className="bg-red-500 text-white text-xs font-black tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                PROMOÇÃO
              </span>
            )}
            <span className="bg-white text-gray-600 border border-gray-200 text-xs font-bold tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
              {isKg ? '⚖️ A PESO' : '📦 UNIDADE'}
            </span>
          </div>

          {produto.image_base64 || produto.imagem ? (
            <img 
              src={produto.image_base64 || produto.imagem} 
              alt={produto.product_name} 
              className="max-w-full h-auto max-h-[400px] object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-300 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span className="mt-4 text-sm font-medium text-gray-400">Sem imagem fotográfica</span>
            </div>
          )}
        </div>

        {/* Detalhes do Produto */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2.5 py-1 rounded-md">
              {getNomeCategoria(produto.category_id)}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Em Stock
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {produto.product_name}
          </h1>
          
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            {produto.product_description || 'Um produto de excelente qualidade, selecionado cuidadosamente para si.'}
          </p>
          
          <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            {temDesconto ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Preço Base:</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-green-600">
                    €{formatarPreco(precoDesconto)}<span className="text-lg font-medium text-gray-500 ml-1">{labelPrecoPor}</span>
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    €{formatarPreco(precoNormal)}
                  </span>
                </div>
                <span className="text-xs font-bold text-red-600 mt-2 bg-red-50 w-fit px-2 py-1 rounded-md">
                  POUPAS €{formatarPreco(precoNormal - precoDesconto)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Preço Base:</span>
                <div className="text-4xl font-black text-gray-900">
                  €{formatarPreco(precoNormal)}<span className="text-lg font-medium text-gray-500 ml-1">{labelPrecoPor}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            
            {/* Seletor de Quantidade */}
            <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-1.5 w-full sm:w-40 bg-white shadow-sm">
              <button 
                onClick={decrementar}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-lg text-gray-900 leading-none">{quantidade}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{labelUnidade}</span>
              </div>
              <button 
                onClick={incrementar}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            {/* Botão Adicionar */}
            <button 
              onClick={handleAdicionarAoCarrinho}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-between px-6 group"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                Adicionar
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                €{formatarPreco(precoCalculado)}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}