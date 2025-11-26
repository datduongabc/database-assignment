import React, { useState } from 'react';
import { Plus, Grid3X3 } from 'lucide-react';
import { FilterSection } from './FilterSection';
import { ProductTable } from './ProductTable';
import { AddProductModal } from './AddProductModal';

export function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">My Products</h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-[#EE4D2D] text-[#EE4D2D] rounded-lg hover:bg-[#FFF6F4] transition-colors flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Batch Tools
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#EE4D2D] text-white rounded-lg hover:bg-[#D43F1F] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            </div>
          </div>

          <FilterSection />
        </div>

        {/* Product Table */}
        <ProductTable />
      </div>

      {/* Add Product Modal */}
      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}