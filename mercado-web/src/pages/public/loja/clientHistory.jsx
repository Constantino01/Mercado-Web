import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HistoricoCliente() {
  const [encomendas, setEncomendas] = useState([]);
  const [encomendaSelecionada, setEncomendaSelecionada] = useState(null);

  useEffect(() => {
    // Ler o histórico do LocalStorage
    const guardadas = JSON.parse(localStorage.getItem('mercearia_encomendas') || '[]');
    setEncomendas(guardadas);
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return { data: '', hora: '' };
    const date = new Date(dataString);
    return {
      data: date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      hora: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const infoPagamento = {
    'mbway': 'Aprovar na App MBWay',
    'multibanco': 'Pagamento por Entidade/Referência',
    'loja': 'Pagamento ao Levantar (Dinheiro/Cartão)'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">As Minhas Encomendas</h1>
          <p className="text-gray-500 mt-2">Acompanhe as suas compras e apresente o código na loja.</p>
        </div>
        <Link to="/loja/catalogo" className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors">
          &larr; Voltar à Loja
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Data e Hora</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {encomendas.length > 0 ? (
                encomendas.map((enc) => {
                  const dataFormatada = formatarData(enc.data);
                  return (
                    <tr 
                      key={enc.codigo} 
                      onClick={() => setEncomendaSelecionada(enc)}
                      className="cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg text-sm tracking-wider group-hover:bg-white transition-colors">
                          {enc.codigo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{dataFormatada.data}</div>
                        <div className="text-xs text-gray-500">{dataFormatada.hora}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          {infoPagamento[enc.metodoPagamento]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-gray-900 text-base">€{Number(enc.total).toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-gray-500">
                    <p className="text-lg mb-2">Ainda não fez nenhuma encomenda.</p>
                    <Link to="/loja/catalogo" className="text-green-600 font-medium hover:underline">Começar a comprar</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes (Cliente) */}
      {encomendaSelecionada && (
        <div 
          onClick={() => setEncomendaSelecionada(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-gray-100 bg-white text-center relative">
              <button onClick={() => setEncomendaSelecionada(null)} className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Apresente este código na loja</p>
              <h2 className="text-4xl font-mono font-black text-gray-900 tracking-widest">{encomendaSelecionada.codigo}</h2>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Artigos a levantar</h3>
              <div className="space-y-3">
                {encomendaSelecionada.itens.map(item => {
                  const divisor = item.unit_type === 'kg' ? 1000 : 1;
                  const labelUnidade = item.unit_type === 'kg' ? 'g' : ' un';
                  const custoLinha = (item.precoFinal / divisor) * item.quantidade;

                  return (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-4 shadow-sm">
                      <div className="bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                        {item.image_base64 || item.imagem ? (
                          <img src={item.image_base64 || item.imagem} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">{item.product_name}</h4>
                        <p className="text-xs text-gray-500">{item.quantidade}{labelUnidade}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-sm">€{Number(custoLinha).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-center bg-green-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-green-800 font-semibold uppercase tracking-wider">Total Pago</p>
                  <p className="text-sm text-green-600 mt-0.5">{infoPagamento[encomendaSelecionada.metodoPagamento]}</p>
                </div>
                <p className="text-2xl font-black text-green-700">€{Number(encomendaSelecionada.total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}