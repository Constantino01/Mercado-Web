import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';

export default function TabelaDescontos() {
  const [descontos, setDescontos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const data = await apiCRUD.read('/descontos');
      setDescontos(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Erro ao carregar descontos', error);
    } finally {
      setLoading(false);
    }
  };

  const apagarDesconto = async (id) => {
    if (window.confirm('Tem a certeza que deseja apagar este desconto?')) {
      try {
        await apiCRUD.delete(`/descontos/${id}`);
        setDescontos(descontos.filter(d => d.id !== id));
      } catch (error) {
        alert(error.message || 'Não foi possível apagar o desconto.');
      }
    }
  };

  const descontosFiltrados = descontos.filter(d => 
    (d.discount_name || '').toLowerCase().includes(pesquisa.toLowerCase())
  );

  const obterEstado = (dataInicio, dataFim) => {
    if (!dataInicio || !dataFim) return { label: 'Sem Datas', estilo: 'bg-gray-100 text-gray-500' };

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 
    
    const inicio = new Date(dataInicio);
    inicio.setHours(0, 0, 0, 0); 
    
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999); 

    if (hoje > fim) {
      return { label: 'Expirado', estilo: 'bg-red-100 text-red-700' };
    } else if (hoje < inicio) {
      return { label: 'Agendado', estilo: 'bg-blue-100 text-blue-700' };
    } else {
      return { label: 'Ativo', estilo: 'bg-green-100 text-green-700' };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Descontos</h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Botão Vermelho para a Lixeira */}
          <Link to="/private/descontos/recycle" className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            <span className="hidden sm:inline">Reciclagem</span>
          </Link>

          {/* Botão Verde Novo Desconto */}
          <Link to="/private/descontos/novo" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shrink-0 flex-1 sm:flex-auto justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Novo Desconto
          </Link>
        </div>
      </div>

      {/* Pesquisa */}
      <div className="p-6 bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Pesquisar promoção..." 
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
              <th className="px-6 py-4">Nome da Promoção</th>
              <th className="px-6 py-4">Desconto</th>
              <th className="px-6 py-4">Data Início</th>
              <th className="px-6 py-4">Data Fim</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">A carregar dados...</td>
              </tr>
            ) : descontosFiltrados.length > 0 ? (
              descontosFiltrados.map((d) => {
                // Alterado AQUI para coincidir com as colunas da tabela
                const estado = obterEstado(d.discount_start_date, d.discount_end_date);
                
                return (
                  <tr key={d.id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{d.discount_name}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      {d.discount_type === 'percent' ? `${d.discount_value}%` : `€${Number(d.discount_value).toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">{new Date(d.discount_start_date).toLocaleDateString('pt-PT')}</td>
                    <td className="px-6 py-4">{new Date(d.discount_end_date).toLocaleDateString('pt-PT')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${estado.estilo}`}>
                        {estado.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <Link to={`/private/descontos/editar/${d.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </Link>
                      <button onClick={() => apagarDesconto(d.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Nenhum desconto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}