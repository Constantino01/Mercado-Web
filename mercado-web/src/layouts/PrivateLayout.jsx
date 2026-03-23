import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PrivateHeader from '../components/private/PrivateHeader';
import PrivateSidebar from '../components/private/PrivateSidebar';

export default function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <PrivateSidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <PrivateHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}