import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPrivate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codigo, setCodigo] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui entrará a lógica de autenticação com a API
    console.log('Login:', { email, password, codigo });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="inline-block bg-green-600 text-white p-3 rounded-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Acesso Restrito</h1>
          <p className="text-gray-500 mt-2">Painel de Gestão - Mercearia Orestes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50"
              placeholder="admin@mercearia.pt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Palavra-passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código de Confirmação (2FA)</label>
            <input 
              type="text" 
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50 tracking-widest text-center text-lg"
              placeholder="000000"
              maxLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm mt-2"
          >
            Entrar no Painel
          </button>

        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
            &larr; Voltar à Loja Pública
          </Link>
        </div>

      </div>
    </div>
  );
}