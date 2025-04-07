import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { Dropdown, Menu, Input, Button, Modal } from "antd";
import { SearchOutlined, PhoneOutlined, MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartNotification from "./CartNotification";
import CartMini from "./CartMini";

const { Search } = Input;

const items = [
  {
    label: (
      <a
        href="https://www.antgroup.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Điện tử
      </a>
    ),
    key: "0",
  },
  {
    label: (
      <a
        href="https://www.aliyun.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing el
      </a>
    ),
    key: "1",
  },
  {
    label: "Sách",
    key: "3",
  },
];

const Header = () => {
  const { justAdded } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!justAdded) return;
    setProduct(justAdded);
    const timer = setTimeout(() => setProduct(null), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  return (
    <header className="shadow-lg py-4 sticky top-0 z-10 bg-blue-500">
      <div className="container mx-auto flex items-center gap-5 justify-between px-6 lg:px-8 text-white">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <div className="text-2xl font-bold">E_Shop</div>
          </Link>
        </div>

        {/* Dropdown "Danh mục" */}
        <Dropdown
          menu={{ items }}
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

        {/* Input tìm kiếm với button icon */}
        <div className="flex-1 mx-6">
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            enterButton={<Button icon={<SearchOutlined />} />}
            size="large"
            className="w-full max-w-lg rounded-md shadow-sm border-gray-300"
          />
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
        {/* {isAuthenticated ? (
          <div className="flex items-center text-gray-800 font-medium text-lg">
            <UserOutlined className="mr-2 text-xl" />
            <span className="truncate max-w-[120px]">{user?.username}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center hover:text-orange-500 font-medium text-lg transition-colors duration-200"
          >
            <UserOutlined className="mr-2 text-xl" />
            <span>Đăng nhập</span>
          </Link>
        )} */}
      </div>
    </header>
  );
};

export default Header;
