import { Link } from 'react-router-dom';

export default function PrivateHeader({ toggleSidebar }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      
      <div className="flex items-center gap-3">
        {/* Botão Mobile */}
        <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <span className="font-bold text-gray-800 text-lg hidden sm:block">Área Privada</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 hidden sm:block">Sr. Orestes</span>
        {/* Link para Configuração de Conta */}
        <Link to="/private/conta" className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </Link>
      </div>

    </header>
  );
}