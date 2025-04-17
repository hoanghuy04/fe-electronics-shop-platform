import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { Dropdown, Menu, Input, Button, Modal, notification } from "antd";
import { SearchOutlined, PhoneOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartNotification from "./CartNotification";
import CartMini from "./CartMini";
import { UserOutlined } from "@ant-design/icons";
import LoginPage from "./LoginPage";
import { useAuth } from "../hooks/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';


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
  const { user, logout } = useAuth();
  const [greeted, setGreeted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const navigate = useNavigate();
  const { justAdded } = useCart();
  const [product, setProduct] = useState(null);


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
    navigate("/");
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
        {user ? (
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <div className="flex items-center cursor-pointer">
              <UserOutlined className="mr-2 text-xl" />
              <span className="truncate max-w-[120px] text-xl text-bold">{user?.name}</span>

              {showGreeting && (
                <div className="fixed top-20 right-5 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg z-50">
                  🥳 Xin chào! {user.name}
                </div>
              )}


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
        )/* )} */}
      </div>
    </header>
  );
};

export default Header;
