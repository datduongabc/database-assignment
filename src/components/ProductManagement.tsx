import React, { useState } from 'react';
import { Plus, Grid3X3 } from 'lucide-react';
import { FilterSection } from './FilterSection';
import { ProductTable } from './ProductTable';
import { AddProductModal } from './AddProductModal';

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  stock: number;
  description: string;
}

export function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // State lưu thông tin tìm kiếm
  const [filterParams, setFilterParams] = useState({ keyword: '', maxPrice: '' });

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Hàm này sẽ được gọi khi bấm "Apply Filter" ở FilterSection
  const handleSearch = (keyword: string, maxPrice: string) => {
    setFilterParams({ keyword, maxPrice });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">My Products</h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-[#EE4D2D] text-[#EE4D2D] rounded-lg flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" /> Batch Tools
              </button>
              <button onClick={handleAddNew} className="px-4 py-2 bg-[#EE4D2D] text-white rounded-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>
          </div>

          {/* Truyền hàm handleSearch xuống FilterSection */}
          <FilterSection onSearch={handleSearch} />
        </div>

        {/* Truyền filterParams xuống ProductTable */}
        <ProductTable 
            onEdit={handleEditProduct} 
            filterParams={filterParams} 
        />
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={editingProduct} 
      />
    </>
  );
}