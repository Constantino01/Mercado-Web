import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/public/CartContext';
import { apiCRUD } from '../../../utils/api';

export default function Produto() {
  const { id } = useParams();
  const { openCart } = useCart();
  const [quantidade, setQuantidade] = useState(1);

  // Estados para a API
  const [produto, setProduto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [id]);

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

  const adicionarAoCarrinho = () => {
    // Aqui no futuro adicionas a lógica de guardar no estado do carrinho (Contexto)
    openCart(); 
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gray-500 font-medium">A carregar produto...</div>;
  }

  if (!produto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
        <Link to="/loja" className="text-green-600 font-medium hover:underline">Voltar ao Catálogo</Link>
      </div>
    );
  }

  // Lógica de Preços e Stock
  const precoNormal = parsePreco(produto.product_cost);
  const precoDesconto = parsePreco(produto.best_cost);
  const temDesconto = produto.best_cost && precoDesconto > 0 && precoDesconto < precoNormal;
  
  // Como o teu modelo ainda pode não ter stock dinâmico, deixamos um fallback provisório
  const stock = produto.stock !== undefined ? produto.stock : 15; 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="mb-6">
        <Link to="/loja/catalogo" className="text-gray-500 hover:text-green-600 flex items-center gap-2 w-fit transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar ao Catálogo
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Imagem do Produto */}
        <div className="md:w-1/2 bg-green-50/50 flex items-center justify-center p-12 sm:p-20 min-h-[400px] relative">
          {temDesconto && (
            <span className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl z-10 shadow-sm">
              PROMOÇÃO
            </span>
          )}
          {produto.image_base64 || produto.imagem ? (
            <img 
              src={produto.image_base64 || produto.imagem} 
              alt={produto.product_name} 
              className="max-w-full h-auto max-h-[350px] object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-300 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span className="mt-4 text-sm font-medium">Sem imagem fotográfica</span>
            </div>
          )}
        </div>

        {/* Detalhes do Produto */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">
            {getNomeCategoria(produto.category_id)}
          </span>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            {produto.product_name}
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {produto.product_description || 'Um produto de excelente qualidade, selecionado cuidadosamente para si.'}
          </p>
          
          <div className="mb-8">
            {temDesconto ? (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-green-600">
                    €{formatarPreco(precoDesconto)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    €{formatarPreco(precoNormal)}
                  </span>
                </div>
                <span className="text-sm text-gray-500 mt-1 font-medium bg-green-50 w-fit px-2 py-1 rounded text-green-700">
                  Poupas €{formatarPreco(precoNormal - precoDesconto)}
                </span>
              </div>
            ) : (
              <div className="text-4xl font-black text-gray-900">
                €{formatarPreco(precoNormal)} <span className="text-base font-normal text-gray-500">/ un</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Seletor de Quantidade */}
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 w-full sm:w-32 bg-white">
              <button 
                onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <span className="font-bold text-lg text-gray-900">{quantidade}</span>
              <button 
                onClick={() => setQuantidade(q => Math.min(stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            {/* Botão Adicionar */}
            <button 
              onClick={adicionarAoCarrinho}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              Adicionar ao Carrinho
            </button>
          </div>

          
        </div>

      </div>
    </div>
  );
}