import React, { useContext, useEffect, useState } from "react";
import {
  SearchOutlined,
  PhoneOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import { Dropdown, Menu, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartNotification from "./CartNotification";
import CartMini from "./CartMini";
import { useAuth } from "../hooks/AuthContext";
import { ProductContext } from "../hooks/ProductContext";

const { Search } = Input;

const Header = () => {
  const { user, logout } = useAuth();
  const [greeted, setGreeted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const { justAdded } = useCart();
  const [product, setProduct] = useState(null);
  const { categories, products } = useContext(ProductContext);
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Thay visible bằng open

  const handleCategoryFilter = (slug) => {
    navigate(`products/category/${slug}`);
  };

  useEffect(() => {
    if (user?.name && !greeted) {
      setShowGreeting(true);
      setTimeout(() => {
        setShowGreeting(false);
        setGreeted(true);
      }, 2000);
    }
  }, [user, greeted]);

  useEffect(() => {
    if (!justAdded) return;
    setProduct(justAdded);
    const timer = setTimeout(() => setProduct(null), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);
  const handleLogout = () => {
    logout();
  };

  const userMenu = (
    <Menu
      className="rounded-xl shadow-lg p-2 bg-white"
      items={[
        {
          label: (
            <div className="flex items-center gap-2 text-black font-medium cursor-default px-2 py-1">
              <i className="fa-regular fa-hand-paper text-base"></i>
              Xin chào! {user?.name}
            </div>
          ),
          key: "greeting",
        },
        {
          label: (
            <div className="flex items-center gap-2 text-black hover:text-blue-500 px-2 py-1">
              <i className="fa-solid fa-box text-base"></i>
              Đơn hàng của tôi
            </div>
          ),
          key: "orders",
        },
        {
          label: (
            <div className="flex items-center gap-2 text-black hover:text-blue-500 px-2 py-1">
              <i className="fa-regular fa-clock text-base"></i>
              Đã xem gần đây
            </div>
          ),
          key: "recent",
        },
        {
          label: (
            <div
              className="flex items-center gap-2 text-black hover:text-red-500 px-2 py-1"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket text-base"></i>
              Đăng xuất
            </div>
          ),
          key: "logout",
        },
      ]}
    />
  );

  // Xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }

    const filtered = products
      .filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 4);

    setSearchResults(filtered);
    setDropdownOpen(true);
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/products/search?q=${value}`);
      setDropdownOpen(false);
      setSearchValue("");
    }
  };

  // Nội dung menu cho dropdown tìm kiếm
  const searchMenu = {
    items:
      searchResults.length > 0
        ? searchResults.map((product) => ({
            key: product.id,
            label: (
              <div
                className="flex items-center"
                onClick={() => {
                  navigate(`/products/${product.slug}`);
                  setDropdownOpen(false);
                  setSearchValue("");
                }}
              >
                <img
                  src={product.image_url[0] || "placeholder-image-url"}
                  alt={product.title}
                  className="w-12 h-12 object-cover mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{product.title}</p>
                  <p className="text-xs text-gray-500">
                    {product.price.toLocaleString()} VNĐ
                  </p>
                </div>
              </div>
            ),
          }))
        : [
            {
              key: "no-results",
              label: (
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              ),
              disabled: true, // Để không thể nhấp vào
            },
          ],
  };

  return (
    <header className="shadow-lg py-4 sticky top-0 z-10 bg-primary">
      <div className="container mx-auto flex items-center gap-5 justify-between px-6 lg:px-8 text-white">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <div className="text-2xl font-bold">E_Shop</div>
          </Link>
        </div>

        {/* Dropdown "Danh mục" */}
        {/* <Dropdown
          menu={{
            items: [
              {
                label: "Tất cả",
                key: "all",
                onClick: () => handleCategoryFilter("all"),
              },
              ...categories?.map((item) => ({
                label: item.name,
                key: item.id,
                onClick: () => handleCategoryFilter(item.slug),
              })),
            ],
          }}
          trigger={["click"]}
          overlayClassName="bg-white shadow-md rounded-md border border-gray-200"
          placement="bottomRight"
        >
          <a
            onClick={(e) => e.preventDefault()}
            className="relative flex items-center text-white font-medium text-lg px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
          >
            <span className="absolute inset-0 bg-black opacity-30 rounded-md"></span>
            <MenuOutlined className="mr-2 text-sm z-10" />
            <span className="z-10">Danh mục</span>
          </a>
        </Dropdown> */}

        {/* Input tìm kiếm với dropdown */}
        <div className="flex-1 mx-6">
          <Dropdown
            menu={searchMenu}
            open={dropdownOpen && searchResults.length > 0} // Thay visible bằng open
            onOpenChange={(open) => setDropdownOpen(open)} // Thay onVisibleChange bằng onOpenChange
            placement="bottomLeft"
            overlayClassName="bg-white shadow-lg rounded-md w-96" // Tùy chỉnh lớp overlay
          >
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              enterButton={<Button icon={<SearchOutlined />} />}
              size="large"
              value={searchValue}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              className="w-full max-w-lg rounded-md shadow-sm border-gray-300"
            />
          </Dropdown>
        </div>

        {/* Hotline */}
        <div className="flex items-center hover:text-blue-600 transition-colors duration-200">
          <PhoneOutlined className="mr-2 text-xl" />
          <span className="font-semibold text-lg">Hotline: 1900.5301</span>
        </div>

        {/* Tra cứu đơn hàng */}
        <Link
          to="/track-order"
          className="flex items-center hover:text-blue-600 mx-6 font-medium text-lg transition-colors duration-200"
        >
          <SearchOutlined className="mr-2 text-xl" />
          <span>Tra cứu đơn hàng</span>
        </Link>

        {/* Giỏ hàng */}
        <div className="relative">
          <CartMini />
          {product != null && <CartNotification product={product} />}
        </div>

        {/* Tên user */}
        {Object.keys(user).length > 0 ? (
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <div className="flex items-center cursor-pointer">
              <UserOutlined className="mr-2 text-lg" />
              <div className="truncate font-semibold text-lg">{user?.name}</div>
            </div>
          </Dropdown>
        ) : (
          <Link
            to="/login"
            className="flex items-center hover:text-orange-500 font-medium text-lg transition-colors duration-200"
          >
            <UserOutlined className="mr-2 text-xl" />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
