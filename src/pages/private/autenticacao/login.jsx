import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/private/AuthContext'; // Ajusta o caminho se necessário
import logoOrestes from  '../../../assets/canvas.png'; // O teu logótipo

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redireciona automaticamente se o utilizador já estiver logado
  useEffect(() => {
    if (user) {
      // Se ele tentou aceder a uma página privada antes do login, mandamos para lá.
      // Caso contrário, vai para o dashboard principal da gestão.
      const from = location.state?.from?.pathname || '/private';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message || 'Credenciais inválidas. Tente novamente.');
      setIsSubmitting(false);
    }
    // Se tiver sucesso, o estado 'user' no contexto vai atualizar e o useEffect acima faz o redirecionamento.
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* LOGÓTIPO */}
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white shadow-sm mb-4 border border-slate-100 p-2">
          <img 
            src={logoOrestes} 
            alt="Logótipo Mercado Orestes" 
            className="h-full w-full object-contain"
          />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Acesso Restrito
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Área de Gestão do Mercado Orestes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* MENSAGEM DE ERRO */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* CAMPO EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Endereço de Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all font-medium text-slate-900"
                  placeholder="admin@orestes.pt"
                />
              </div>
            </div>

            {/* CAMPO PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Palavra-passe
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all font-medium text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* BOTÃO SUBMIT */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Entrar no Sistema'
                )}
              </button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}