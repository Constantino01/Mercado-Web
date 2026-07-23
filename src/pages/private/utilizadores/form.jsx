import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';

export default function UtilizadorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);

  const [utilizador, setUtilizador] = useState({
    name: '',
    email: '',
    password: '' 
  });

  useEffect(() => {
    if (isEdit) {
      const carregarDados = async () => {
        try {
          const data = await apiCRUD.read(`/utilizadores/${id}`);
          setUtilizador({
            name: data.name || '',
            email: data.email || '',
            password: '' // Mantemos vazio por segurança
          });
        } catch (error) {
          console.error("Erro ao carregar:", error);
          alert("Não foi possível carregar o utilizador.");
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUtilizador(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Injetamos a role 'funcionario' silenciosamente
    const payload = { 
      ...utilizador,
      role: 'funcionario' 
    };

    if (isEdit && !payload.password) {
      delete payload.password;
    }

    try {
      if (isEdit) {
        await apiCRUD.update(`/utilizadores/${id}`, payload);
      } else {
        await apiCRUD.create('/utilizadores', payload);
      }
      navigate('/private/utilizadores');
    } catch (error) {
      alert(error.message || "Erro ao guardar utilizador.");
    }
  };

  if (loading) return <div className="text-center py-10 font-medium text-slate-500">A carregar...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/private/utilizadores" className="p-2 bg-white text-gray-500 hover:text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              name="name"
              required
              value={utilizador.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              required
              value={utilizador.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Ex: joao@orestes.pt"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palavra-passe {isEdit && <span className="text-gray-400 font-normal">(Deixar em branco para manter)</span>}
            </label>
            <input 
              type="password" 
              name="password"
              required={!isEdit}
              value={utilizador.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm mt-4 active:scale-[0.98]"
        >
          {isEdit ? 'Guardar Alterações' : 'Criar Utilizador'}
        </button>
        
      </form>
    </div>
  );
}