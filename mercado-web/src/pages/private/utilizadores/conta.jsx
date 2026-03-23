import { useState } from 'react';

export default function ConfiguracaoConta() {
  // Dados simulados do funcionário autenticado
  const [perfil, setPerfil] = useState({
    nome: 'João Orestes',
    email: 'admin@mercearia.pt',
    funcao: 'Administrador',
    dataEntrada: '2025-01-10'
  });

  const [passwords, setPasswords] = useState({
    atual: '',
    nova: '',
    confirmacao: ''
  });

  const handlePerfilChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const guardarPerfil = (e) => {
    e.preventDefault();
    console.log('Dados de perfil a atualizar:', perfil);
    alert('Perfil atualizado com sucesso!');
  };

  const atualizarPassword = (e) => {
    e.preventDefault();
    if (passwords.nova !== passwords.confirmacao) {
      alert('A nova palavra-passe e a confirmação não coincidem.');
      return;
    }
    console.log('Pedido de alteração de password enviado.');
    alert('Palavra-passe alterada com sucesso!');
    setPasswords({ atual: '', nova: '', confirmacao: '' }); // Limpa o formulário
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuração de Conta</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cartão 1: Dados Pessoais */}
        <form onSubmit={guardarPerfil} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Informação Pessoal</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                name="nome"
                required
                value={perfil.nome}
                onChange={handlePerfilChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                required
                value={perfil.email}
                onChange={handlePerfilChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Campos Bloqueados (Read-only) */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Função</label>
                <input 
                  type="text" 
                  value={perfil.funcao}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl p-3 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data de Entrada</label>
                <input 
                  type="text" 
                  value={perfil.dataEntrada}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl p-3 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
            Atualizar Dados
          </button>
        </form>

        {/* Cartão 2: Alterar Palavra-passe */}
        <form onSubmit={atualizarPassword} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Segurança</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Palavra-passe Atual</label>
              <input 
                type="password" 
                name="atual"
                required
                value={passwords.atual}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Palavra-passe</label>
              <input 
                type="password" 
                name="nova"
                required
                minLength="8"
                value={passwords.nova}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Palavra-passe</label>
              <input 
                type="password" 
                name="confirmacao"
                required
                minLength="8"
                value={passwords.confirmacao}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3.5 rounded-xl transition-colors shadow-sm">
            Alterar Palavra-passe
          </button>
        </form>

      </div>
    </div>
  );
}