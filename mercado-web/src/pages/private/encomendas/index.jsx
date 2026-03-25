import { useState, useEffect } from 'react';
import { apiCRUD } from '../../../utils/api'; 

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const response = await apiCRUD.read('/encomendas');
      const ordenadas = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPedidos(ordenadas);
    } catch (error) {
      console.error("Erro ao carregar encomendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const statusAtual = p.order_status || 'Pendente';
    
    const matchPesquisa = 
      (p.order_code && p.order_code.toLowerCase().includes(pesquisa.toLowerCase())) ||
      String(p.id).includes(pesquisa) ||
      (p.client_email && p.client_email.toLowerCase().includes(pesquisa.toLowerCase()));
      
    const matchEstado = filtroEstado === 'Todos' || statusAtual === filtroEstado;

    return matchPesquisa && matchEstado;
  });

  const obterCorEstado = (estado) => {
    const status = estado || 'Pendente';
    switch (status) {
      case 'Pendente': return 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20';
      case 'Concluído': return 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20';
      case 'Cancelado': return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10';
      default: return 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-500/10';
    }
  };

  const obterCorBotaoFiltro = (estado, ativo) => {
    if (!ativo) return 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200';
    
    switch (estado) {
      case 'Todos': return 'bg-gray-900 text-white border-gray-900 shadow-sm';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200 ring-1 ring-yellow-500/30 shadow-sm';
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200 ring-1 ring-green-500/30 shadow-sm';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200 ring-1 ring-red-500/30 shadow-sm';
      default: return 'bg-gray-900 text-white';
    }
  };

  const atualizarEstadoPedido = async (novoEstado) => {
    try {
      await apiCRUD.update(`/encomendas/${pedidoSelecionado.id}`, { order_status: novoEstado });
      setPedidos(pedidos.map(p => p.id === pedidoSelecionado.id ? { ...p, order_status: novoEstado } : p));
      setPedidoSelecionado({ ...pedidoSelecionado, order_status: novoEstado });
    } catch (error) {
      console.error("Erro ao atualizar estado:", error);
      alert("Não foi possível atualizar o estado da encomenda.");
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return { data: '', hora: '' };
    const date = new Date(dataString);
    return {
      data: date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      hora: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Encomendas</h1>
          <p className="text-sm text-gray-500 mt-1">Valide os códigos e atualize o estado das encomendas.</p>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div className="relative w-full lg:w-96 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Pesquisar por Código, ID ou Email..." 
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          {['Todos', 'Pendente', 'Concluído', 'Cancelado'].map(estado => {
            const isActive = filtroEstado === estado;
            return (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${obterCorBotaoFiltro(estado, isActive)}`}
              >
                {estado}
              </button>
            );
          })}
        </div>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
          <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Código / ID</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Data e Hora</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">A carregar encomendas...</td></tr>
            ) : pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map((p) => {
                const dataFormatada = formatarData(p.created_at);
                const inicialEmail = p.client_email ? p.client_email.charAt(0).toUpperCase() : '?';

                return (
                  <tr 
                    key={p.id} 
                    onClick={() => setPedidoSelecionado(p)}
                    className="cursor-pointer hover:bg-gray-100/70 active:bg-gray-200/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1.5 rounded-lg text-sm tracking-wider group-hover:bg-white transition-colors">
                        {p.order_code || 'S/ CÓDIGO'}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-1.5 font-medium uppercase tracking-wider">
                        Interno: #{p.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-green-200 transition-colors">
                          {inicialEmail}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{p.client_email}</div>
                          <div className="text-xs text-gray-500">{p.client_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{dataFormatada.data}</div>
                      <div className="text-xs text-gray-500">{dataFormatada.hora}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">€{Number(p.order_cost).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${obterCorEstado(p.order_status)}`}>
                        <svg className="mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                        {p.order_status || 'Pendente'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3">📭</span>
                    <p>Nenhuma encomenda encontrada com esse filtro.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pedidoSelecionado && (
        <div 
          onClick={() => setPedidoSelecionado(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Código: <span className="font-mono text-green-600">{pedidoSelecionado.order_code}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">Ref Interna: #{pedidoSelecionado.id} • {pedidoSelecionado.client_email}</p>
              </div>
              <button onClick={() => setPedidoSelecionado(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Itens a Separar</h3>
              
              <div className="space-y-3">
                {pedidoSelecionado.products && pedidoSelecionado.products.map(produto => {
                  const labelUnidade = produto.unit_type === 'kg' ? 'g' : ' un';
                  
                  return (
                    <div key={produto.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-4 shadow-sm">
                      <div className="bg-gray-50 w-14 h-14 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-gray-100">
                        {produto.image_base64 ? (
                           <img src={produto.image_base64} alt={produto.product_name} className="w-full h-full object-cover"/>
                        ) : '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">{produto.product_name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{Number(produto.pivot.quantity)}{labelUnidade}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-sm">€{Number(produto.pivot.charged_cost).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-600">Estado:</span>
                <div className="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-xl">
                  {['Pendente', 'Concluído', 'Cancelado'].map((estado) => {
                    const isActive = (pedidoSelecionado.order_status || 'Pendente') === estado;
                    
                    let colorClasses = 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50';
                    if (isActive) {
                      if (estado === 'Pendente') colorClasses = 'bg-yellow-100 text-yellow-800 shadow-sm ring-1 ring-yellow-500/30';
                      else if (estado === 'Concluído') colorClasses = 'bg-green-100 text-green-800 shadow-sm ring-1 ring-green-500/30';
                      else if (estado === 'Cancelado') colorClasses = 'bg-red-100 text-red-800 shadow-sm ring-1 ring-red-500/30';
                    }

                    return (
                      <button
                        key={estado}
                        onClick={() => atualizarEstadoPedido(estado)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${colorClasses}`}
                      >
                        {estado}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-right w-full sm:w-auto">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Pago</p>
                <p className="text-2xl font-black text-green-600">€{Number(pedidoSelecionado.order_cost).toFixed(2)}</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}