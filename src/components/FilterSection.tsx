import React, { useState } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

// Định nghĩa Props để truyền hàm search ra ngoài
interface FilterSectionProps {
  onSearch: (keyword: string, maxPrice: string) => void;
}

export function FilterSection({ onSearch }: FilterSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleApplyFilter = () => {
    // Gọi hàm onSearch được truyền từ cha
    onSearch(searchTerm, maxPrice);
  };

  const handleReset = () => {
    setSearchTerm('');
    setMaxPrice('');
    onSearch('', ''); // Reset về rỗng để hiện tất cả
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Product Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
          />
        </div>

        {/* Category Dropdown (Giữ nguyên giao diện, chưa xử lý logic) */}
        <div>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Price Range */}
        <div className="flex items-center gap-2 md:col-span-2">
          <span className="text-gray-500 text-sm">Max Price:</span>
          <input
            type="number"
            placeholder="Max Price (VND)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
          />
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex gap-3">
          <button 
            onClick={handleApplyFilter}
            className="flex-1 px-4 py-2 bg-[#EE4D2D] text-white rounded-lg hover:bg-[#D43F1F] transition-colors flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filter
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}