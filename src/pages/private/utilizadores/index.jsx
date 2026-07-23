import { useEffect, useState } from 'react';
import { apiCRUD } from '../../../utils/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/private/AuthContext';

export default function Utilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fomos buscar o utilizador atual à sessão
  const { user } = useAuth();

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  const carregarUtilizadores = async () => {
    try {
      const data = await apiCRUD.read('/utilizadores');
      setUtilizadores(data);
    } catch (error) {
      alert("Erro ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tens a certeza que queres eliminar este utilizador?")) return;
    try {
      await apiCRUD.delete(`/utilizadores/${id}`);
      setUtilizadores(utilizadores.filter(u => u.id !== id));
    } catch (error) {
      alert("Erro ao eliminar");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-900">Gestão de Utilizadores</h1>
        <Link 
          to="/private/utilizadores/novo" 
          className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
        >
          + Novo Utilizador
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Nome</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Email</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Cargo</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {utilizadores.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link 
                    to={`/private/utilizadores/editar/${u.id}`} 
                    className="text-slate-400 hover:text-green-600 font-bold text-sm"
                  >
                    Editar
                  </Link>
                  
                  {/* Esconde o botão se o ID da linha for igual ao ID do utilizador logado */}
                  {user?.id !== u.id && (
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="text-slate-400 hover:text-red-600 font-bold text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}