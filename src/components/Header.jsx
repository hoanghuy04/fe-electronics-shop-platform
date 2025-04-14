import React, { useContext, useEffect, useState } from "react";
import {
  SearchOutlined,
  PhoneOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Menu, Input, Button, Modal } from "antd";
import { useCart } from "../hooks/useCart";
import CartNotification from "./CartNotification";
import CartMini from "./CartMini";
import { UserOutlined } from "@ant-design/icons";
import LoginPage from "./LoginPage";
import { ProductContext } from "../hooks/ProductContext";

const { Search } = Input;

const stickyBanners = [
  "https://file.hstatic.net/200000722513/file/thang_02_pc_gvn_banner_side_web.jpg", // Banner bên trái
  "https://file.hstatic.net/200000722513/file/thang_03_laptop_rtx_5090_sticky_230x697.jpg", // Banner bên phải
];

const Header = () => {
  const { justAdded } = useCart();
  const [product, setProduct] = useState(null);
  const { categories, products } = useContext(ProductContext);
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCategoryFilter = (slug) => {
    navigate(`products/${slug}/brand/all`);
  };

  useEffect(() => {
    if (!justAdded) return;
    setProduct(justAdded);
    const timer = setTimeout(() => setProduct(null), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);

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

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/products/search?q=${value}`);
      setDropdownOpen(false);
      setSearchValue("");
    }
  };

  const searchMenu = {
    items: searchResults.length > 0 ? (
      searchResults.map((product) => ({
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
    ) : (
      [
        {
          key: "no-results",
          label: <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>,
          disabled: true,
        },
      ]
    ),
  };

  return (
    <div className="relative mb-16">
      {/* Header */}
      <header className="shadow-lg py-4 fixed w-full top-0 z-20 bg-primary">
        <div className="container mx-auto flex items-center gap-5 justify-between px-6 lg:px-8 text-white">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="text-2xl font-bold">E_Shop</div>
            </Link>
          </div>

          {/* Dropdown "Danh mục" */}
          <Dropdown
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
          </Dropdown>

          {/* Input tìm kiếm với dropdown */}
          <div className="flex-1 mx-6">
            <Dropdown
              menu={searchMenu}
              open={dropdownOpen && searchResults.length > 0}
              onOpenChange={(open) => setDropdownOpen(open)}
              placement="bottomLeft"
              overlayClassName="bg-white shadow-lg rounded-md w-96"
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
        </div>
      </header>

      {/* Sticky Banners */}
      <div className="hidden lg:block">
        {/* Left Banner */}
        <div
          className="fixed left-0 w-[150px] bg-gray-200 z-10"
          style={{ top: "80px" }}
        >
          <div className="text-center w-full h-full overflow-hidden rounded-r-lg shadow-lg">
            <NavLink to={"products/all/brand/all"}>
              <img src={stickyBanners[0]} alt="" className="object-contain" />
            </NavLink>
          </div>
        </div>

        {/* Right Banner */}
        <div
          className="fixed right-0 w-[150px] bg-gray-200 z-10"
          style={{ top: "80px" }}
        >
          <div className="text-center w-full h-full overflow-hidden rounded-l-lg shadow-lg">
            <NavLink to={"products/all/brand/all"}>
              <img src={stickyBanners[1]} alt="" className="object-contain" /></NavLink>
          </div>
        </div>

        {/* Tên user */}
        {/* {isAuthenticated ? (
          <div className="flex items-center text-gray-800 font-medium text-lg">
            <UserOutlined className="mr-2 text-xl" />
            <span className="truncate max-w-[120px]">{user?.username}</span>
          </div>
        ) : ( */}
          <Link
            to="/login"
            className="flex items-center hover:text-orange-500 font-medium text-lg transition-colors duration-200"
          >
            <UserOutlined className="mr-2 text-xl" />
            
            <span>Đăng nhập</span>
          </Link>
        {/* )} */}
      </div>
    </div>
  );
};

export default Header;