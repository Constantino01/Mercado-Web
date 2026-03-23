import { useState } from 'react';

// Dados simulados de encomendas (com os itens incluídos)
const mockPedidos = [
  { 
    id: '#1024', cliente: 'Maria Silva', data: '2026-03-17', total: 12.50, estado: 'Pendente',
    itens: [
      { id: 1, nome: 'Maçãs de Alcobaça', imagem: '🍎', quantidade: 2, preco: 1.50 },
      { id: 4, nome: 'Queijo Curado', imagem: '🧀', quantidade: 1, preco: 4.50 },
      { id: 3, nome: 'Pão de Mistura', imagem: '🥖', quantidade: 2, preco: 2.50 }
    ]
  },
  { 
    id: '#1023', cliente: 'João Orestes', data: '2026-03-16', total: 8.90, estado: 'Processamento',
    itens: [
      { id: 2, nome: 'Cenouras Biológicas', imagem: '🥕', quantidade: 1, preco: 0.90 },
      { id: 5, nome: 'Bananas da Madeira', imagem: '🍌', quantidade: 2, preco: 4.00 }
    ]
  },
  { 
    id: '#1022', cliente: 'Ana Costa', data: '2026-03-15', total: 24.00, estado: 'Concluído',
    itens: [
      { id: 4, nome: 'Queijo Curado', imagem: '🧀', quantidade: 3, preco: 4.50 },
      { id: 7, nome: 'Leite Meio Gordo', imagem: '🥛', quantidade: 5, preco: 2.10 }
    ]
  },
];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState(mockPedidos);
  const [pesquisa, setPesquisa] = useState('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null); // Controla o Modal

  const pedidosFiltrados = pedidos.filter(p => 
    p.id.toLowerCase().includes(pesquisa.toLowerCase()) ||
    p.cliente.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const obterCorEstado = (estado) => {
    switch (estado) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-700';
      case 'Processamento': return 'bg-blue-100 text-blue-700';
      case 'Concluído': return 'bg-green-100 text-green-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const atualizarEstadoPedido = (novoEstado) => {
    setPedidos(pedidos.map(p => p.id === pedidoSelecionado.id ? { ...p, estado: novoEstado } : p));
    setPedidoSelecionado({ ...pedidoSelecionado, estado: novoEstado });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* Cabeçalho da Tabela */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
      </div>

      {/* Pesquisa */}
      <div className="p-6 bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Pesquisar por ID ou Cliente..." 
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
              <th className="px-6 py-4">ID Pedido</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map((p) => (
                <tr key={p.id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 font-medium">{p.cliente}</td>
                  <td className="px-6 py-4">{p.data}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">€{p.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${obterCorEstado(p.estado)}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setPedidoSelecionado(p)}
                      className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-green-600 font-medium py-1.5 px-4 rounded-lg transition-colors text-sm shadow-sm"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE DETALHES DO PEDIDO COM REDESIGN E FECHO NO OVERLAY */}
      {pedidoSelecionado && (
        <div 
          onClick={() => setPedidoSelecionado(null)} // Fecha o modal ao clicar fora (no overlay)
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          {/* Contentor Principal do Modal - Redesign das Borders */}
          <div 
            onClick={(e) => e.stopPropagation()} // Impede que cliques dentro do modal fechem o modal
            className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            
            {/* Header do Modal - Redesign das Borders */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pedido {pedidoSelecionado.id}</h2>
                <p className="text-sm text-gray-500 mt-1">{pedidoSelecionado.cliente} • {pedidoSelecionado.data}</p>
              </div>
              <button onClick={() => setPedidoSelecionado(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Corpo do Modal (Cartões dos Itens) */}
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Itens Encomendados</h3>
              
              <div className="space-y-3">
                {pedidoSelecionado.itens.map(item => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0">
                      {item.imagem}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.nome}</h4>
                      <p className="text-sm text-gray-500">{item.quantidade}x €{item.preco.toFixed(2)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-gray-900 text-lg">€{(item.quantidade * item.preco).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer do Modal - Redesign das Borders */}
            <div className="p-6 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Controlo de Estado */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-600">Estado:</span>
                <select 
                  value={pedidoSelecionado.estado}
                  onChange={(e) => atualizarEstadoPedido(e.target.value)}
                  className={`border border-gray-200 rounded-lg p-2 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 ${obterCorEstado(pedidoSelecionado.estado)}`}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Processamento">Processamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              {/* Total Final */}
              <div className="text-right w-full sm:w-auto">
                <p className="text-sm text-gray-500">Total a Pagar</p>
                <p className="text-2xl font-black text-green-600">€{pedidoSelecionado.total.toFixed(2)}</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}