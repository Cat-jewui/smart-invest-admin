import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { admin, logout } = useAuth();

  return (
    <header className="bg-dark-card border-b border-dark-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-white font-semibold text-lg">
              환영합니다, {admin?.name}님
            </h2>
            <p className="text-gray-400 text-sm">
              {new Date().toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-dark-bg rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 px-4 py-2 bg-dark-bg rounded-lg">
            <div className="text-right">
              <p className="text-white text-sm font-medium">{admin?.name}</p>
              <p className="text-gray-400 text-xs">{admin?.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="로그아웃"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
