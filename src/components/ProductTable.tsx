import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, MoreVertical, ChevronLeft, ChevronRight, Box, ArrowUpDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  stock: number;
  description: string;
  // Để sort động, ta cần báo cho TS biết có thể truy cập bằng key string
  [key: string]: any; 
}

interface ProductTableProps {
  onEdit?: (product: Product) => void;
  filterParams?: { keyword: string; maxPrice: string };
}

export function ProductTable({ onEdit, filterParams }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- 1. State cho Sắp xếp ---
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Fetch dữ liệu (Giữ nguyên)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let url = 'http://127.0.0.1:5000/api/products';

        if (filterParams && (filterParams.keyword || filterParams.maxPrice)) {
          const params = new URLSearchParams();
          if (filterParams.keyword) params.append('keyword', filterParams.keyword);
          if (filterParams.maxPrice) params.append('max_price', filterParams.maxPrice);
          url = `http://127.0.0.1:5000/api/products/search?${params.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Không thể kết nối Server');
        
        const data = await response.json();
        setProducts(data);
        setCurrentPage(1); // Reset về trang 1 khi dữ liệu thay đổi
      } catch (err) {
        console.error(err);
        setError("Lỗi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filterParams]);

  // Xóa (Giữ nguyên)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
        alert("Đã xóa thành công!");
      } else {
        alert("Lỗi khi xóa!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    if (onEdit) onEdit(product);
  };

  // --- 2. Hàm xử lý khi bấm vào tiêu đề cột ---
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    // Nếu đang sort cột này rồi và là asc -> đổi thành desc
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- 3. Logic Sắp xếp dữ liệu ---
  const sortedProducts = React.useMemo(() => {
    let sortableItems = [...products];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Xử lý riêng cho trường hợp null/undefined
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [products, sortConfig]);

  // --- Phân trang trên danh sách ĐÃ SẮP XẾP ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left w-12">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#EE4D2D]" />
              </th>
              
              {/* Cột ID */}
              <th className="px-4 py-3 text-left text-gray-700 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort('id')}>
                <div className="flex items-center gap-1">
                  Product ID <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* Cột Name */}
              <th className="px-4 py-3 text-left text-gray-700 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort('name')}>
                <div className="flex items-center gap-1">
                  Name <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="px-4 py-3 text-left text-gray-700">Description</th>

              {/* Cột Price */}
              <th className="px-4 py-3 text-left text-gray-700 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort('originalPrice')}>
                <div className="flex items-center gap-1">
                  Price <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* Cột Stock */}
              <th className="px-4 py-3 text-left text-gray-700 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort('stock')}>
                <div className="flex items-center gap-1">
                  Stock <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="px-4 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#EE4D2D]" />
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{product.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Box className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-gray-500 text-sm truncate" title={product.description}>
                      {product.description || "No description"}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[#EE4D2D] font-medium">
                      ₫{product.originalPrice?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={product.stock === 0 ? 'text-red-500 font-medium' : 'text-gray-900'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">Chưa có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-gray-600 text-sm">
           Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}