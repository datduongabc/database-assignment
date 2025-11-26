import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Settings,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  currentPage: 'products' | 'revenue-report';
  onNavigate: (page: 'products' | 'revenue-report') => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', page: null },
  { icon: Package, label: 'Product Management', page: 'products' },
  { icon: ShoppingCart, label: 'Order Management', page: null },
  { icon: TrendingUp, label: 'High Revenue Shops', page: 'revenue-report' },
  { icon: DollarSign, label: 'Finance', page: null },
  { icon: Settings, label: 'Shop Settings', page: null },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-[#EE4D2D]">Seller Center</h1>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.page === currentPage;
          return (
            <button
              key={index}
              onClick={() => item.page && onNavigate(item.page as 'products' | 'revenue-report')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-[#FFF6F4] text-[#EE4D2D]'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${!item.page ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!item.page}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}