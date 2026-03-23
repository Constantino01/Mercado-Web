import { NavLink } from 'react-router-dom';

export default function PrivateSidebar({ isOpen, closeSidebar }) {
  const menuAgrupado = [
    {
      grupo: 'Gestão da Loja',
      itens: [
        { nome: 'Pedidos', caminho: '/private/pedidos', icone: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
        { nome: 'Produtos', caminho: '/private/produtos', icone: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
        { nome: 'Categorias', caminho: '/private/categorias', icone: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
        { nome: 'Descontos', caminho: '/private/descontos', icone: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.5-4.5 4.5 4.5"/><path d="m2 17 4.5 4.5 4.5-4.5"/><path d="M6 3v18"/><path d="m13 14.5 9-9"/><path d="M17.5 5.5 22 10"/><circle cx="15.5" cy="11.5" r="1.5"/><circle cx="19.5" cy="15.5" r="1.5"/></svg> },
      ]
    },
    {
      grupo: 'Análise e Histórico',
      itens: [
        { nome: 'Histórico de Vendas', caminho: '/private/historico-vendas', icone: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
      ]
    },
    {
      grupo: 'Plataforma',
      itens: [
        { nome: 'Utilizadores', caminho: '/private/utilizadores', icone: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeSidebar}></div>
      )}

      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="font-extrabold text-xl text-green-700 tracking-tight">OrestesGestão</span>
          <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {menuAgrupado.map((seccao, idx) => (
            <div key={seccao.grupo} className={idx !== 0 ? 'mt-8' : ''}>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2 block">
                {seccao.grupo}
              </span>
              <div className="space-y-1">
                {seccao.itens.map((item) => (
                  <NavLink
                    key={item.nome}
                    to={item.caminho}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                        isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {item.icone}
                    {item.nome}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

      </aside>
    </>
  );
}