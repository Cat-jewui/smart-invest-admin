import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, DollarSign, Tag, Star, MessageCircle, TrendingDown,X,Menu} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: '대시보드' },
    { path: '/members', icon: Users, label: '회원관리' },
    { path: '/revenue', icon: DollarSign, label: '수익관리' },
    { path: '/pricing', icon: Tag, label: '가격관리' },
    { path: '/reviews', icon: Star, label: '리뷰관리' },
    { path: '/chat', icon: MessageCircle, label: '고객상담' },
    { path: '/costs', icon: TrendingDown, label: '비용관리' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-dark-card border-r border-dark-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl"><DollarSign size={20} /></span>
              </div>
              <div>
                <h1 className="text-white font-bold">스마트 투자자산관리</h1>
                <h1 className="text-white font-bold">ADMIN</h1>
                {/*<p className="text-gray-400 text-xs">Admin Panel</p>*/}
              </div>
            </div>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-gray-400 hover:bg-dark-bg hover:text-white'
                  }
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-dark-border">
            <div className="bg-dark-bg rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">시스템 상태</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">정상 운영중</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
