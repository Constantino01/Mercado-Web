import { useState } from 'react';
import { Link } from 'react-router-dom';

const mockUtilizadores = [
  { id: 1, nome: 'João Orestes', email: 'admin@mercearia.pt', funcao: 'Administrador', estado: 'Ativo', dataRegisto: '2025-01-10' },
  { id: 2, nome: 'Maria Silva', email: 'maria@email.com', funcao: 'Cliente', estado: 'Ativo', dataRegisto: '2026-02-15' },
  { id: 3, nome: 'Carlos Neves', email: 'carlos.n@email.com', funcao: 'Cliente', estado: 'Inativo', dataRegisto: '2026-03-01' },
  { id: 4, nome: 'Ana Costa', email: 'ana.costa@email.com', funcao: 'Cliente', estado: 'Ativo', dataRegisto: '2026-03-12' },
];

export default function Utilizadores() {
  const [utilizadores, setUtilizadores] = useState(mockUtilizadores);
  const [pesquisa, setPesquisa] = useState('');

  const utilizadoresFiltrados = utilizadores.filter(u => 
    u.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    u.email.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const apagarUtilizador = (id) => {
    if (window.confirm('Tem a certeza que deseja apagar este utilizador?')) {
      setUtilizadores(utilizadores.filter(u => u.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Utilizadores</h1>
        <Link to="/private/utilizadores/novo" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shrink-0 w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          Novo Utilizador
        </Link>
      </div>

      <div className="p-6 bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou email..." 
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
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Função</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Data Registo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {utilizadoresFiltrados.length > 0 ? (
              utilizadoresFiltrados.map((u) => (
                <tr key={u.id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{u.nome}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.funcao === 'Administrador' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.funcao}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.estado === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">{u.dataRegisto}</td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <Link to={`/private/utilizadores/editar/${u.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </Link>
                    <button onClick={() => apagarUtilizador(u.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Nenhum utilizador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}