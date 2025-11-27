from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- CẤU HÌNH KẾT NỐI (Giữ nguyên thông tin của bạn) ---
def get_db_connection():
    server = 'LAPTOP-UJO9PM00\\SQLEXPRESS' 
    database = 'E_COMMERCE'
    conn_str = (
        f'DRIVER={{ODBC Driver 17 for SQL Server}};'
        f'SERVER={server};'
        f'DATABASE={database};'
        f'Trusted_Connection=yes;'
        f'Encrypt=yes;'
        f'TrustServerCertificate=yes;'
    )
    return pyodbc.connect(conn_str)

def rows_to_dict(cursor, rows):
    columns = [column[0] for column in cursor.description]
    results = []
    for row in rows:
        results.append(dict(zip(columns, row)))
    return results

# --- API 1: Lấy danh sách (READ) ---
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                Product_ID as id, 
                Name as name, 
                OriginalPrice as originalPrice, 
                StockQuantity as stock,
                Description as description
            FROM Product
        """)
        rows = cursor.fetchall()
        products = rows_to_dict(cursor, rows)
        conn.close()
        return jsonify(products)
    except Exception as e:
        print("Lỗi Get:", e)
        return jsonify({'error': str(e)}), 500
# --- API 2: Báo cáo Doanh thu cao (Đã cập nhật gọi SP) ---
@app.route('/api/reports/high-revenue', methods=['GET'])
def get_high_revenue_report():
    try:
        # Lấy tham số từ URL
        year = request.args.get('year', 2025)
        min_revenue = request.args.get('min_revenue', 0)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Gọi Stored Procedure sp_GetHighRevenueShops
        # Tham số: @ReportYear, @MinRevenue
        cursor.execute("{CALL sp_GetHighRevenueShops (?, ?)}", (year, float(min_revenue)))
        
        rows = cursor.fetchall()
        
        # Map dữ liệu trả về cho Frontend
        report_data = []
        columns = [column[0] for column in cursor.description]
        
        for row in rows:
            item = dict(zip(columns, row))
            report_data.append({
                'shopId': item['Shop_ID'],
                'shopName': item['ShopName'],
                'totalOrders': item['TotalOrders'],
                'totalRevenue': item['TotalRevenue']
            })
            
        conn.close()
        return jsonify(report_data)
    except Exception as e:
        print("Lỗi Report:", e)
        return jsonify({'error': str(e)}), 500
# --- API 3: Thêm mới (INSERT) ---
@app.route('/api/products', methods=['POST'])
def add_product():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Tạo ID là số nguyên (INT) thay vì chuỗi "PRD..."
        new_id = random.randint(1000, 999999)
        
        # 2. Lấy thời gian hiện tại cho CreateAt
        create_at = datetime.now()
        
        # 3. Gán Shop ID mặc định là 201 (Phải đảm bảo bảng Shop có ID=201)
        shop_id = 201
        
        # 4. Gọi Procedure theo ĐÚNG thứ tự tham số trong SQL bạn gửi:
        # @p_product_id, @p_stockquantity, @p_createat, @p_description, @p_name, @p_original_price, @p_shop_id
        cursor.execute("{CALL sp_InsertProduct (?, ?, ?, ?, ?, ?, ?)}", (
            new_id,                 # @p_product_id (INT)
            int(data['stock']),     # @p_stockquantity (INT)
            create_at,              # @p_createat (DATE)
            data.get('description', ''), # @p_description
            data['name'],           # @p_name
            float(data['originalPrice']), # @p_original_price
            shop_id                 # @p_shop_id (INT)
        ))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Thêm thành công!', 'new_id': new_id}), 201
    except Exception as e:
        print("Lỗi Insert:", e)
        # Trả về lỗi chi tiết để hiển thị lên frontend
        return jsonify({'error': str(e)}), 500
# --- API 4: Xóa (DELETE) ---
@app.route('/api/products/<int:id>', methods=['DELETE']) # Lưu ý: <int:id>
def delete_product(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Gọi sp_DeleteProduct chỉ cần 1 tham số
        cursor.execute("{CALL sp_DeleteProduct (?)}", (id,))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Xóa thành công!'}), 200
    except Exception as e:
        print("Lỗi Delete:", e)
        return jsonify({'error': str(e)}), 500
# --- API 5: Sửa (UPDATE) ---
@app.route('/api/products/<int:id>', methods=['PUT']) # Lưu ý: <int:id>
def update_product(id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        shop_id = 201 # Mặc định
        
        # Thứ tự tham số trong sp_UpdateProduct của bạn:
        # @p_product_id, @p_stockquantity, @p_description, @p_name, @p_original_price, @p_shop_id
        cursor.execute("{CALL sp_UpdateProduct (?, ?, ?, ?, ?, ?)}", (
            id,                     # @p_product_id
            int(data['stock']),     # @p_stockquantity
            data.get('description', ''), # @p_description
            data['name'],           # @p_name
            float(data['originalPrice']), # @p_original_price
            shop_id                 # @p_shop_id
        ))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Cập nhật thành công!'}), 200
    except Exception as e:
        print("Lỗi Update:", e)
        return jsonify({'error': str(e)}), 500
# --- API 6: Tìm kiếm sản phẩm (SEARCH) ---
@app.route('/api/products/search', methods=['GET'])
def search_products():
    try:
        # Lấy tham số từ URL
        keyword = request.args.get('keyword', '')
        max_price = request.args.get('max_price', 2000000000) # Nếu không nhập thì lấy số rất lớn
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Gọi Stored Procedure sp_SearchProducts
        cursor.execute("{CALL sp_SearchProducts (?, ?)}", (keyword, int(max_price)))
        
        rows = cursor.fetchall()
        
        # Map dữ liệu trả về cho khớp với Frontend
        # Frontend cần: id, name, originalPrice, stock, description
        products = []
        columns = [column[0] for column in cursor.description]
        
        for row in rows:
            item = dict(zip(columns, row))
            # Chuyển đổi key của Dictionary cho khớp với React
            products.append({
                'id': item['Product_ID'],
                'name': item['ProductName'],         # SP trả về ProductName
                'originalPrice': item['OriginalPrice'],
                'stock': item['StockQuantity'],
                'description': item['Description']
                # Bạn có thể thêm shopName, shopRating nếu muốn hiển thị thêm
            })
            
        conn.close()
        return jsonify(products)
    except Exception as e:
        print("Lỗi Search:", e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)