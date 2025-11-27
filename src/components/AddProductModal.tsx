import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Toast } from './Toast';

// 1. Định nghĩa lại interface Product để dùng
interface Product {
  id: string;
  name: string;
  originalPrice: number;
  stock: number;
  description: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null; // Nhận thêm prop này từ cha
}

export function AddProductModal({ isOpen, onClose, productToEdit }: AddProductModalProps) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const maxNameLength = 120;

  const categories = {
    '': [],
    'electronics': ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Accessories'],
    'fashion': ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Accessories'],
    'home': ['Furniture', 'Kitchen', 'Decor', 'Bedding', 'Storage'],
    'beauty': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Tools'],
    'sports': ['Exercise Equipment', 'Outdoor Gear', 'Sports Apparel', 'Accessories'],
  };

  // 2. Dùng useEffect để điền dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        // --- CHẾ ĐỘ SỬA: Điền dữ liệu cũ vào form ---
        setProductName(productToEdit.name);
        setOriginalPrice(productToEdit.originalPrice.toString());
        setStock(productToEdit.stock.toString());
        setDescription(productToEdit.description || '');
        
        // Vì DB chưa lưu Ảnh và Category, ta điền giả để form không bị lỗi validate
        setImages(['https://placehold.co/600x400']); 
        setCategory('electronics'); 
        setSubcategory('Smartphones');
      } else {
        // --- CHẾ ĐỘ THÊM MỚI: Reset form trắng tinh ---
        setProductName('');
        setOriginalPrice('');
        setStock('');
        setDescription('');
        setImages([]);
        setCategory('');
        setSubcategory('');
      }
    }
  }, [isOpen, productToEdit]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 9));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 9));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePriceChange = (value: string) => {
    setOriginalPrice(value);
    if (value && parseFloat(value) <= 0) {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
  };

  // 3. Hàm Submit thông minh (Xử lý cả Thêm và Sửa)
  const handleSubmit = async () => {
    // Validation
    if (!productName || !category || !description || !originalPrice || !stock || images.length === 0) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }

    if (parseFloat(originalPrice) <= 0) {
      setPriceError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }

    // Chuẩn bị dữ liệu
    const productData = {
      name: productName,
      originalPrice: parseFloat(originalPrice),
      stock: parseInt(stock),
      description: description
    };

    try {
      let response;
      
      if (productToEdit) {
        // --- GỌI API SỬA (PUT) ---
        response = await fetch(`http://127.0.0.1:5000/api/products/${productToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData), // API Sửa không cần gửi ID trong body
        });
      } else {
        // --- GỌI API THÊM MỚI (POST) ---
        const newId = 'PRD' + Math.floor(Math.random() * 100000);
        response = await fetch('http://127.0.0.1:5000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...productData, id: newId }), // API Thêm cần ID
        });
      }

      if (response.ok) {
        alert(productToEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Lỗi Server: " + (errorData.error || "Thao tác thất bại"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến Server Backend!");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header: Đổi tiêu đề động */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-gray-900">
                {productToEdit ? 'Edit Product' : 'Basic Information'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Product Images */}
              <div>
                <label className="block text-gray-900 mb-2">
                  Product Images <span className="text-[#EF4444]">*</span>
                </label>
                <p className="text-gray-500 mb-3">Upload up to 9 images. First image will be the cover photo.</p>
                
                <div className="grid grid-cols-5 gap-4">
                  {/* Upload Area */}
                  {images.length < 9 && (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#EE4D2D] transition-colors cursor-pointer bg-gray-50"
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-xs text-center">Upload Image</span>
                      </label>
                    </div>
                  )}
                  
                  {/* Image Previews */}
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-[#EE4D2D] text-white text-xs px-2 py-1 rounded">
                          Cover
                        </div>
                      )}
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-gray-900 mb-2">
                  Product Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Input product name..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value.slice(0, maxNameLength))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-gray-500 text-xs">
                    {productName.length}/{maxNameLength}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-900 mb-2">
                  Category <span className="text-[#EF4444]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent bg-white"
                  >
                    <option value="">Select Main Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Living</option>
                    <option value="beauty">Beauty & Personal Care</option>
                    <option value="sports">Sports & Outdoor</option>
                  </select>
                  
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    disabled={!category}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Subcategory</option>
                    {category && categories[category as keyof typeof categories].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                {category && subcategory && (
                  <div className="mt-2 text-gray-600">
                    Category Path: <span className="text-[#EE4D2D]">
                      {category.charAt(0).toUpperCase() + category.slice(1)} {' > '} {subcategory}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-900 mb-2">
                  Product Description <span className="text-[#EF4444]">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Rich Text Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">B</button>
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700 italic">I</button>
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700 underline">U</button>
                    <div className="w-px bg-gray-300 mx-1"></div>
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">•</button>
                    <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">1.</button>
                  </div>
                  <textarea
                    placeholder="Describe your product in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Sales Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Sales Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Original Price */}
                  <div>
                    <label className="block text-gray-900 mb-2">
                      Original Price <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">₫</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={originalPrice}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent ${
                          priceError ? 'border-[#EF4444]' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {priceError && (
                      <p className="mt-1 text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Price must be greater than 0
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-gray-900 mb-2">
                      Stock Quantity <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Nút bấm đổi chữ động */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#EE4D2D] text-white rounded-lg hover:bg-[#D43F1F] transition-colors"
              >
                {productToEdit ? 'Update Product' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="Error: Please fill in all required fields correctly"
          type="error"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}