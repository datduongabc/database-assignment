import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';

interface TopBarProps {
  currentPage: 'products' | 'revenue-report';
}

export function TopBar({ currentPage }: TopBarProps) {
  const pageName = currentPage === 'products' ? 'Product Management' : 'High Revenue Shops Report';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-gray-600">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{pageName}</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EE4D2D] rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-gray-900">John's Store</p>
              <p className="text-gray-500 text-xs">Seller</p>
            </div>
            <div className="w-10 h-10 bg-[#EE4D2D] rounded-full flex items-center justify-center text-white">
              JS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}