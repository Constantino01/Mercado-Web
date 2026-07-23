import { useSettings } from '../../../context/public/SettingsContext';

export default function Configuracoes() {
  const { allowPurchases, togglePurchases, loadingSettings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações da Loja</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        
        {/* SECÇÃO: OPERAÇÃO E VENDAS */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
            Operação e Vendas
          </h2>
          
          {loadingSettings ? (
             <div className="animate-pulse h-24 bg-gray-50 rounded-2xl"></div>
          ) : (
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Estado das Encomendas</h3>
                <p className={`text-sm font-medium mt-1 ${allowPurchases ? 'text-green-600' : 'text-red-500'}`}>
                  {allowPurchases ? "A loja está a aceitar encomendas e compras ativas." : "As encomendas estão temporariamente suspensas na loja."}
                </p>
              </div>

              <button 
                onClick={togglePurchases}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none shrink-0 ${allowPurchases ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span 
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${allowPurchases ? 'translate-x-7' : 'translate-x-1'}`}
                />
              </button>
            </div>
          )}
        </div>

        {/* SECÇÃO: FUTURAS CONFIGURAÇÕES */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
            Outras Definições
          </h2>
          <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
            <span className="text-sm text-gray-400 font-medium">Mais opções de configuração (Gateways de pagamento, emails, etc.) aparecerão aqui futuramente.</span>
          </div>
        </div>

      </div>
    </div>
  );
}