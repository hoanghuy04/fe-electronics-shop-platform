📦 my-project
 ┣ 📂 public
 ┃ ┗ 📄 index.html
 ┣ 📂 src
 ┃ ┣ 📂 assets              # Chứa hình ảnh, biểu tượng, styles
 ┃ ┣ 📂 components          # Các component UI có thể tái sử dụng
 ┃ ┃ ┣ 📜 Header.jsx
 ┃ ┃ ┣ 📜 Footer.jsx
 ┃ ┃ ┗ 📜 AllRoutes.jsx
 ┃ ┣ 📂 layout              # Layout chung cho toàn bộ ứng dụng
 ┃ ┃ ┗ 📜 LayoutDefault.jsx
 ┃ ┣ 📂 pages               # Các trang chính của ứng dụng
 ┃ ┃ ┣ 📜 Home.jsx
 ┃ ┃ ┣ 📜 ProductDetail.jsx
 ┃ ┃ ┣ 📜 Cart.jsx
 ┃ ┃ ┗ 📜 NotFound.jsx
 ┃ ┣ 📂 store               # Redux Store
 ┃ ┃ ┣ 📂 reducers          # Chứa các reducer của Redux
 ┃ ┃ ┃ ┣ 📜 cartReducer.js
 ┃ ┃ ┃ ┣ 📜 userReducer.js
 ┃ ┃ ┃ ┗ 📜 index.js        # Kết hợp tất cả reducers
 ┃ ┃ ┣ 📜 actions.js        # Các action của Redux
 ┃ ┃ ┗ 📜 store.js          # Cấu hình Redux Store
 ┃ ┣ 📂 services            # Chứa các hàm gọi API
 ┃ ┃ ┣ 📜 request.js        # Cấu hình fetch API
 ┃ ┃ ┣ 📜 productService.js # CRUD sản phẩm
 ┃ ┃ ┗ 📜 userService.js    # CRUD user
 ┃ ┣ 📂 utils               # Các hàm tiện ích chung
 ┃ ┃ ┣ 📜 helpers.js
 ┃ ┃ ┗ 📜 constants.js      # Chứa các biến toàn cục
 ┃ ┣ 📂 database            # Giả lập database (dùng JSON Server)
 ┃ ┃ ┣ 📜 product-categories.json
 ┃ ┃ ┣ 📜 products.json
 ┃ ┃ ┣ 📜 users.json
 ┃ ┃ ┗ 📜 orders.json
 ┃ ┣ 📜 App.jsx             # Component gốc của ứng dụng
 ┃ ┣ 📜 main.jsx            # Điểm vào chính của React (ReactDOM)
 ┃ ┗ 📜 index.css           # CSS tổng thể
 ┣ 📜 package.json
 ┣ 📜 vite.config.js
 ┗ 📜 README.md