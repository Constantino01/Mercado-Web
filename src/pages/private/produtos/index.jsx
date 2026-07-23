import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [pesquisa, setPesquisa] = useState('');
  const [entradasPorPagina, setEntradasPorPagina] = useState(5);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [prodsData, catsData] = await Promise.all([
        apiCRUD.read('/produtos'),
        apiCRUD.read('/categorias')
      ]);
      
      setProdutos(Array.isArray(prodsData) ? prodsData : (prodsData.data || []));
      setCategorias(Array.isArray(catsData) ? catsData : (catsData.data || []));
    } catch (error) {
      console.error('Erro ao carregar os dados', error);
    } finally {
      setLoading(false);
    }
  };

  const getNomeCategoria = (id) => {
    const categoria = categorias.find(c => c.id === id);
    return categoria ? categoria.category_name : 'Sem Categoria';
  };

  const produtosFiltrados = produtos.filter(p => {
    const nomeProduto = (p.product_name || '').toLowerCase();
    const nomeCategoria = getNomeCategoria(p.category_id).toLowerCase();
    const termo = pesquisa.toLowerCase();
    
    return nomeProduto.includes(termo) || nomeCategoria.includes(termo);
  });

  const indiceUltimo = paginaAtual * entradasPorPagina;
  const indicePrimeiro = indiceUltimo - entradasPorPagina;
  const produtosAtuais = produtosFiltrados.slice(indicePrimeiro, indiceUltimo);
  const totalPaginas = Math.ceil(produtosFiltrados.length / entradasPorPagina);

  const apagarProduto = async (id) => {
    if (window.confirm('Tem a certeza que deseja apagar este produto?')) {
      try {
        await apiCRUD.delete(`/produtos/${id}`);
        setProdutos(produtos.filter(p => p.id !== id));
      } catch (error) {
        alert(error.message || 'Não foi possível apagar o produto.');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/private/produtos/recycle" className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            <span className="hidden sm:inline">Reciclagem</span>
          </Link>

          <Link to="/private/produtos/novo" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shrink-0 flex-1 sm:flex-auto justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Novo Produto
          </Link>
        </div>
      </div>
      
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Mostrar</span>
          <select 
            value={entradasPorPagina} 
            onChange={(e) => { setEntradasPorPagina(Number(e.target.value)); setPaginaAtual(1); }}
            className="border border-gray-300 rounded-lg p-1.5 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entradas</span>
        </div>

        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Pesquisar produto..." 
            value={pesquisa}
            onChange={(e) => { setPesquisa(e.target.value); setPaginaAtual(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Nome do Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço Base</th>
              <th className="px-6 py-4">Unidade de Venda</th>
              <th className="px-6 py-4 text-center">Imagem</th>
              <th className="px-6 py-4 text-center">Descrição</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              /* SKELETON LOADING PARA A TABELA DE PRODUTOS */
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {/* Nome do Produto */}
                  <td className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                  </td>
                  {/* Categoria */}
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded-lg w-24"></div>
                  </td>
                  {/* Preço Base */}
                  <td className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded-md w-16"></div>
                  </td>
                  {/* Unidade de Venda */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 bg-gray-200 rounded-md w-10"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-14"></div>
                    </div>
                  </td>
                  {/* Imagem (Sim/Não) */}
                  <td className="px-6 py-4 text-center">
                    <div className="h-5 bg-gray-200 rounded-md w-8 mx-auto"></div>
                  </td>
                  {/* Descrição (Sim/Não) */}
                  <td className="px-6 py-4 text-center">
                    <div className="h-5 bg-gray-200 rounded-md w-8 mx-auto"></div>
                  </td>
                  {/* Ações (Botões) */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : produtosAtuais.length > 0 ? (
              produtosAtuais.map((p) => {
                const isKg = p.unit_type === 'kg';
                const minQty = p.product_min_quantity || 1;
                
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.product_name}</td>
                    
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {getNomeCategoria(p.category_id)} 
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 font-semibold">€{Number(p.product_cost || 0).toFixed(2)}</td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${isKg ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {isKg ? 'KG' : 'UN'}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        (Inc: {minQty}{isKg ? 'g' : ' un'})
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {p.image_base64 || p.imagem || p.product_image ? (
                        <span className="text-green-600 font-medium">Sim</span>
                      ) : (
                        <span className="text-gray-400">Não</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {p.product_description ? (
                        <span className="text-green-600 font-medium">Sim</span>
                      ) : (
                        <span className="text-gray-400">Não</span>
                      )}
                    </td>

                    <td className="px-6 py-4 flex justify-end gap-3">
                      <Link to={`/private/produtos/editar/${p.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </Link>
                      <button onClick={() => apagarProduto(p.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div>
          A mostrar <span className="font-semibold text-gray-900">{produtosFiltrados.length === 0 ? 0 : indicePrimeiro + 1}</span> a <span className="font-semibold text-gray-900">{Math.min(indiceUltimo, produtosFiltrados.length)}</span> de <span className="font-semibold text-gray-900">{produtosFiltrados.length}</span> entradas
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPaginaAtual(i + 1)}
                className={`w-8 py-1.5 rounded-lg font-medium transition-colors ${paginaAtual === i + 1 ? 'bg-green-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas || totalPaginas === 0}
            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>

    </div>
  );
}