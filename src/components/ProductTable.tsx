import React, { useState } from 'react';
import { Pencil, Trash2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  originalPrice: number;
  stock: number;
  sales: number;
  isActive: boolean;
}

const mockProducts: Product[] = [
  {
    id: 'PRD001',
    name: 'Samsung Galaxy S24 Ultra 5G Smartphone',
    sku: 'SKU-ELEC-001',
    image: 'https://images.unsplash.com/photo-1502096472573-eaac515392c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzY0MDU0MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    originalPrice: 32499750,
    stock: 45,
    sales: 156,
    isActive: true,
  },
  {
    id: 'PRD002',
    name: 'MacBook Pro 16" M3 Max Laptop',
    sku: 'SKU-ELEC-002',
    image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQxMTE0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    originalPrice: 62475000,
    stock: 12,
    sales: 89,
    isActive: true,
  },
  {
    id: 'PRD003',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    sku: 'SKU-ELEC-003',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzY0MDk3MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    originalPrice: 8749750,
    stock: 0,
    sales: 234,
    isActive: false,
  },
  {
    id: 'PRD004',
    name: 'Premium Cotton T-Shirt Collection',
    sku: 'SKU-FASH-001',
    image: 'https://images.unsplash.com/photo-1685883518316-355533810d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwdHNoaXJ0fGVufDF8fHx8MTc2NDE0MTMwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    originalPrice: 749750,
    stock: 158,
    sales: 423,
    isActive: true,
  },
  {
    id: 'PRD005',
    name: 'Nike Air Max 270 Running Sneakers',
    sku: 'SKU-FASH-002',
    image: 'https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTY0NDAzMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    originalPrice: 3999750,
    stock: 67,
    sales: 312,
    isActive: true,
  },
  {
    id: 'PRD006',
    name: 'Urban Travel Backpack - 30L Capacity',
    sku: 'SKU-HOME-001',
    image: 'https://images.unsplash.com/photo-1680039211156-66c721b87625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMGJhZ3xlbnwxfHx8fDE3NjQxMzMzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    originalPrice: 1999750,
    stock: 34,
    sales: 178,
    isActive: true,
  },
];

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleToggleStatus = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleEdit = (id: string) => {
    console.log('Edit product:', id);
    // Edit logic would go here
  };

  const handleDelete = (id: string) => {
    console.log('Delete product:', id);
    // Delete logic would go here
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-[#EE4D2D] focus:ring-[#EE4D2D]"
                />
              </th>
              <th className="px-4 py-3 text-left text-gray-700">Product Info</th>
              <th className="px-4 py-3 text-left text-gray-700">SKU/Product ID</th>
              <th className="px-4 py-3 text-left text-gray-700">Original Price</th>
              <th className="px-4 py-3 text-left text-gray-700">Stock Quantity</th>
              <th className="px-4 py-3 text-left text-gray-700">Sales</th>
              <th className="px-4 py-3 text-left text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product.id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#EE4D2D] focus:ring-[#EE4D2D]"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="max-w-[300px]">
                      <p className="text-gray-900 line-clamp-2">{product.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-600">{product.sku}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[#EE4D2D]">₫{product.originalPrice.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={product.stock === 0 ? 'text-[#EF4444]' : 'text-gray-900'}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-900">{product.sales}</span>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleStatus(product.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      product.isActive ? 'bg-[#10B981]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        product.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#EE4D2D] text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}