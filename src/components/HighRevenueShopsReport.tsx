import React, { useState } from 'react';
import { Store, DollarSign, ShoppingBag, FileText, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ShopData {
  shopId: string;
  shopName: string;
  totalOrders: number;
  totalRevenue: number;
}

const mockShopData: ShopData[] = [
  { shopId: 'SHP001', shopName: 'Tech Galaxy Store', totalOrders: 1247, totalRevenue: 2847500000 },
  { shopId: 'SHP002', shopName: 'Fashion Paradise', totalOrders: 2156, totalRevenue: 1923400000 },
  { shopId: 'SHP003', shopName: 'Home Essentials Hub', totalOrders: 892, totalRevenue: 1567800000 },
  { shopId: 'SHP004', shopName: 'Beauty & Wellness Co', totalOrders: 1543, totalRevenue: 1289300000 },
  { shopId: 'SHP005', shopName: 'Sports Elite Pro', totalOrders: 678, totalRevenue: 987600000 },
  { shopId: 'SHP006', shopName: 'Electronics World', totalOrders: 1834, totalRevenue: 3456700000 },
  { shopId: 'SHP007', shopName: 'Trendy Apparel Shop', totalOrders: 945, totalRevenue: 756200000 },
  { shopId: 'SHP008', shopName: 'Smart Gadgets Plus', totalOrders: 1123, totalRevenue: 2134500000 },
];

export function HighRevenueShopsReport() {
  const [reportYear, setReportYear] = useState('2025');
  const [minRevenue, setMinRevenue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredData, setFilteredData] = useState<ShopData[]>(mockShopData);

  const handleGenerateReport = () => {
    // Filter data based on minimum revenue threshold
    const threshold = minRevenue ? parseFloat(minRevenue.replace(/,/g, '')) : 0;
    const filtered = mockShopData.filter(shop => shop.totalRevenue >= threshold);
    setFilteredData(filtered);
    setShowResults(true);
  };

  // Calculate summary statistics
  const totalShops = filteredData.length;
  const highestRevenue = filteredData.length > 0 
    ? Math.max(...filteredData.map(s => s.totalRevenue)) 
    : 0;
  const avgOrders = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, s) => sum + s.totalOrders, 0) / filteredData.length)
    : 0;

  // Prepare chart data (Top 5)
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent bg-white"
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
              type="text"
              placeholder="e.g., 10,000,000 VND"
              value={minRevenue}
              onChange={(e) => setMinRevenue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent"
            />
            <p className="text-gray-500 text-xs mt-1">SQL Parameter: @MinRevenue</p>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="w-full px-6 py-2 bg-[#EE4D2D] text-white rounded-lg hover:bg-[#D43F1F] transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Query Results</h3>
            <p className="text-gray-600 mt-1">
              Showing shops with revenue ≥ ₫{minRevenue || '0'} for year {reportYear}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-center text-gray-700">Shop ID</th>
                  <th className="px-6 py-3 text-left text-gray-700">Shop Name</th>
                  <th className="px-6 py-3 text-right text-gray-700">
                    Total Orders
                    <span className="block text-gray-500 text-xs font-normal">COUNT(DISTINCT Order_ID)</span>
                  </th>
                  <th className="px-6 py-3 text-right text-gray-700">
                    Total Revenue
                    <span className="block text-gray-500 text-xs font-normal">SUM(Quantity * Price)</span>
                  </th>
                  <th className="px-6 py-3 text-center text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((shop, index) => (
                  <tr 
                    key={shop.shopId} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-900">{shop.shopId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{shop.shopName}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900">{shop.totalOrders.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[#EE4D2D]">₫{shop.totalRevenue.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="inline-flex items-center gap-2 px-3 py-1 border border-[#EE4D2D] text-[#EE4D2D] rounded-lg hover:bg-[#FFF6F4] transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Horizontal Bar Chart */}
      {showResults && chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
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
                tickFormatter={(value) => `₫${(value / 1000000000).toFixed(1)}B`}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                width={180}
              />
              <Tooltip 
                formatter={(value: number) => [`₫${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #E5E7EB',
                  fontSize: '14px'
                }}
              />
              <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#EE4D2D" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* No Results Message */}
      {showResults && filteredData.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No Shops Found</h3>
          <p className="text-gray-600">
            No shops meet the specified criteria. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
