import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const data = await apiCRUD.read('/categorias');
      setCategorias(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Erro ao carregar categorias', error);
    } finally {
      setLoading(false);
    }
  };

  const apagarCategoria = async (id) => {
    if (window.confirm('Tem a certeza que deseja apagar esta categoria?')) {
      try {
        await apiCRUD.delete(`/categorias/${id}`); 
        setCategorias(categorias.filter(c => c.id !== id));
      } catch (error) {
        alert(error.message || 'Não foi possível apagar a categoria.');
      }
    }
  };

  const toggleDestaque = async (id, estadoAtual) => {
    try {
      // 1. Atualização optimista no UI (parece mais rápido ao utilizador)
      setCategorias(categorias.map(c => 
        c.id === id ? { ...c, is_featured: !estadoAtual } : c
      ));

      // 2. Chama a API para gravar (assumindo que o teu update no backend aceita métodos PATCH ou PUT parciais)
      await apiCRUD.update(`/categorias/${id}`, { is_featured: !estadoAtual });
      
    } catch (error) {
      // 3. Reverte se falhar
      alert('Erro ao atualizar o destaque.');
      carregarCategorias(); 
    }
  };

  const categoriasFiltradas = categorias.filter(c => 
    (c.category_name || '').toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Categorias</h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/private/categorias/recycle" className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            <span className="hidden sm:inline">Reciclagem</span>
          </Link>

          <Link to="/private/categorias/nova" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shrink-0 flex-1 sm:flex-auto justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nova Categoria
          </Link>
        </div>
      </div>

      <div className="p-6 bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Pesquisar categoria..." 
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4 text-center">Destaque</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              /* SKELETON LOADING PARA TABELA */
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((c) => (
                <tr key={c.id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{c.category_name}</td>
                  <td className="px-6 py-4">{c.category_description}</td>
                  
                  {/* COLUNA DE DESTAQUE */}
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleDestaque(c.id, c.is_featured)}
                      className={`p-1.5 rounded-full transition-colors ${
                        c.is_featured 
                          ? 'text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600' 
                          : 'text-gray-300 hover:bg-gray-200 hover:text-gray-500'
                      }`}
                      title={c.is_featured ? "Remover destaque" : "Destacar categoria"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={c.is_featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  </td>

                  <td className="px-6 py-4 flex justify-end gap-3">
                    <Link to={`/private/categorias/editar/${c.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </Link>
                    <button onClick={() => apagarCategoria(c.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Nenhuma categoria encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}