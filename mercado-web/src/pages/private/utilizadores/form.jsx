import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function UtilizadorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [utilizador, setUtilizador] = useState({
    nome: '',
    email: '',
    funcao: 'Cliente', // 'Cliente' ou 'Administrador'
    estado: 'Ativo',   // 'Ativo' ou 'Inativo'
    password: ''       // Usado para definir a senha inicial ou alterar a atual
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUtilizador(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Utilizador:', utilizador);
    navigate('/private/utilizadores');
  };

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
              name="nome"
              required
              value={utilizador.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Ex: Maria Silva"
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
              placeholder="Ex: maria@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Palavra-passe {isEdit && <span className="text-gray-400 font-normal">(Deixar em branco para manter)</span>}</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
            <select 
              name="funcao"
              value={utilizador.funcao}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
            >
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado da Conta</label>
            <select 
              name="estado"
              value={utilizador.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm mt-4"
        >
          {isEdit ? 'Guardar Alterações' : 'Criar Utilizador'}
        </button>
        
      </form>
    </div>
  );
}