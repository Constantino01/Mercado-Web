import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';

export default function CategoriasRecycle() {
  const [categorias, setCategorias] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLixeira();
  }, []);

  const carregarLixeira = async () => {
    try {
      const data = await apiCRUD.read('/categorias/trashed');
      setCategorias(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Erro ao carregar a lixeira:', error);
    } finally {
      setLoading(false);
    }
  };

  const restaurarCategoria = async (id) => {
    try {
      await apiCRUD.update(`/categorias/${id}/restore`, {}); 
      setCategorias(categorias.filter(c => c.id !== id));
      alert('Categoria restaurada com sucesso!');
    } catch (error) {
      alert(error.message || 'Não foi possível restaurar.');
    }
  };

  const apagarDefinitivamente = async (id) => {
    if (window.confirm('ATENÇÃO: Ação irreversível! Apagar esta categoria limpará a ligação em todos os produtos associados. Continuar?')) {
      try {
        await apiCRUD.delete(`/categorias/${id}/force`); 
        setCategorias(categorias.filter(c => c.id !== id));
      } catch (error) {
        alert(error.message || 'Não foi possível apagar definitivamente.');
      }
    }
  };

  const categoriasFiltradas = categorias.filter(c => 
    (c.category_name || '').toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-50/30">
        <div className="flex items-center gap-3">
          <Link to="/private/categorias" className="p-2 bg-white text-gray-500 hover:text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reciclagem de Categorias</h1>
        </div>
      </div>

      {/* Pesquisa */}
      <div className="p-6 bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Pesquisar categoria apagada..." 
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Data de Eliminação</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">A carregar lixeira...</td>
              </tr>
            ) : categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((c) => (
                <tr key={c.id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-400 line-through">{c.category_name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(c.deleted_at).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    
                    {/* Botão Restaurar */}
                    <button onClick={() => restaurarCategoria(c.id)} className="text-gray-400 hover:text-green-600 transition-colors" title="Restaurar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </button>
                    
                    {/* Botão Destruir */}
                    <button onClick={() => apagarDefinitivamente(c.id)} className="text-gray-400 hover:text-red-700 transition-colors" title="Apagar Definitivamente">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">A lixeira está vazia.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}