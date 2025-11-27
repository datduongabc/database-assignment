import React, { useState } from 'react';
import { Store, DollarSign, ShoppingBag, FileText, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ShopData {
  shopId: string;
  shopName: string;
  totalOrders: number;
  totalRevenue: number;
}

export function HighRevenueShopsReport() {
  const [reportYear, setReportYear] = useState('2025');
  const [minRevenue, setMinRevenue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredData, setFilteredData] = useState<ShopData[]>([]); // Dữ liệu thật
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setShowResults(false);

    try {
      // Xử lý số tiền nhập vào (bỏ dấu phẩy nếu có)
      const threshold = minRevenue ? parseFloat(minRevenue.replace(/,/g, '')) : 0;
      
      // Gọi API Flask
      const response = await fetch(`http://127.0.0.1:5000/api/reports/high-revenue?year=${reportYear}&min_revenue=${threshold}`);
      
      if (!response.ok) {
        throw new Error('Lỗi kết nối Server');
      }

      const data = await response.json();
      setFilteredData(data);
      setShowResults(true);
    } catch (error) {
      console.error("Lỗi báo cáo:", error);
      alert("Không thể lấy dữ liệu báo cáo!");
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán thống kê
  const totalShops = filteredData.length;
  const highestRevenue = filteredData.length > 0 
    ? Math.max(...filteredData.map(s => s.totalRevenue)) 
    : 0;
  const avgOrders = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, s) => sum + s.totalOrders, 0) / filteredData.length)
    : 0;

  // Dữ liệu cho biểu đồ (Top 5)
  const chartData = [...filteredData]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map(shop => ({
      name: shop.shopName,
      revenue: shop.totalRevenue,
    }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-gray-900">High Revenue Shops Report</h2>
        <p className="text-gray-600 mt-1">Generate comprehensive revenue reports for shops meeting specific criteria</p>
      </div>

      {/* Report Criteria Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-[#EE4D2D]" />
          <h3 className="text-gray-900">Report Criteria</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Year */}
          <div>
            <label className="block text-gray-700 mb-2">
              Report Year <span className="text-[#EF4444]">*</span>
            </label>
            <select
              value={reportYear}
              onChange={(e) => setReportYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] bg-white"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <p className="text-gray-500 text-xs mt-1">SQL Parameter: @ReportYear</p>
          </div>

          {/* Minimum Revenue Threshold */}
          <div>
            <label className="block text-gray-700 mb-2">
              Minimum Revenue Threshold <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 10000000"
              value={minRevenue}
              onChange={(e) => setMinRevenue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
            />
            <p className="text-gray-500 text-xs mt-1">SQL Parameter: @MinRevenue</p>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className={`w-full px-6 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#EE4D2D] hover:bg-[#D43F1F]'
              }`}
            >
              {isLoading ? 'Processing...' : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in">
          {/* Total Shops Found */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-[#FFF6F4] rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-[#EE4D2D]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 mb-1">Total Shops Found</p>
              <h3 className="text-gray-900">{totalShops}</h3>
            </div>
          </div>

          {/* Highest Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-[#FFF6F4] rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#EE4D2D]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 mb-1">Highest Revenue</p>
              <h3 className="text-gray-900">₫{highestRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Avg Orders per Shop */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-[#FFF6F4] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#EE4D2D]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 mb-1">Avg. Orders per Shop</p>
              <h3 className="text-gray-900">{avgOrders}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {showResults && (
        <div className="bg-white rounded-lg shadow-sm animate-slide-in">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Query Results</h3>
            <p className="text-gray-600 mt-1">
              Showing shops with revenue ≥ ₫{parseFloat(minRevenue || '0').toLocaleString()} for year {reportYear}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-center text-gray-700">Shop ID</th>
                  <th className="px-6 py-3 text-left text-gray-700">Shop Name</th>
                  <th className="px-6 py-3 text-right text-gray-700">Total Orders</th>
                  <th className="px-6 py-3 text-right text-gray-700">Total Revenue</th>
                  <th className="px-6 py-3 text-center text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((shop) => (
                    <tr key={shop.shopId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-center text-gray-900">{shop.shopId}</td>
                      <td className="px-6 py-4 text-gray-900">{shop.shopName}</td>
                      <td className="px-6 py-4 text-right text-gray-900">{shop.totalOrders.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-[#EE4D2D] font-medium">₫{shop.totalRevenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="inline-flex items-center gap-2 px-3 py-1 border border-[#EE4D2D] text-[#EE4D2D] rounded-lg hover:bg-[#FFF6F4]">
                          <Eye className="w-4 h-4" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No shops found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Horizontal Bar Chart */}
      {showResults && chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-in">
          <h3 className="text-gray-900 mb-4">Top 5 Shops by Revenue</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                type="number"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₫${(value / 1000000).toFixed(0)}M`}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                width={150}
              />
              <Tooltip 
                formatter={(value: number) => [`₫${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#EE4D2D" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}