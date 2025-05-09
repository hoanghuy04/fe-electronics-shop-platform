import { Content, Footer } from "antd/es/layout/layout";
import { Menu, Avatar, Badge, Dropdown } from "antd";
import {
  BellOutlined,
  TeamOutlined,
  ProjectOutlined,
  MessageOutlined,
  BarChartOutlined,
  DashboardOutlined,
  HddOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { path } from "../constants/path";
import { useAuth } from "../hooks/AuthContext";
import { useEffect, useState } from "react";

const menuItems = [
  {
    key: path.homeAdmin,
    icon: <DashboardOutlined />,
    label: <NavLink to={path.homeAdmin}>Tổng quan</NavLink>,
  },
  {
    key: `${path.homeAdmin}/${path.brandManagement}`,
    icon: <HddOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.brandManagement}`}>
        Quản lý thương hiệu
      </NavLink>
    ),
  },
  {
    key: `${path.homeAdmin}/${path.productManagement}`,
    icon: <ProjectOutlined />,
    label: <NavLink to={`${path.homeAdmin}/${path.productManagement}`}>Quản lý Sản phẩm</NavLink>,

  },
  {
    key: `${path.homeAdmin}/${path.userManagement}`,
    icon: <TeamOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.userManagement}`}>
        Quản lý người dùng
      </NavLink>
    ),
  },
  {
    key: `${path.homeAdmin}/${path.categoryManagement}`,
    icon: <ProductOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.categoryManagement}`}>
        {" "}
        Quản lý danh mục
      </NavLink>
    ),
  },
  {
    key: `${path.homeAdmin}/${path.orderManagement}`,
    icon: <MessageOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.orderManagement}`}>
        Quản lý đơn hàng
      </NavLink>
    ),
  },
];

export default function DefaultLayoutAdmin() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const location = useLocation()

  const handleLogout = () => {
    logout();
  };

  // Handle switch to seller view
  const handleSwitchToSeller = () => {
    // Add your switch to seller logic here
    console.log("Switching to seller view...");
    navigate("/");
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ của tôi",
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => navigate("/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "seller",
      icon: <ShopOutlined />,
      label: "Chuyển sang bán hàng",
      onClick: handleSwitchToSeller,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr] grid-rows-[auto_1fr_auto]">
      {/* Sidebar */}
      <div className="bg-white shadow-md row-span-3">
        <div className="p-4 flex justify-center">
          <a
            href={path.homeAdmin}
            className="text-2xl font-bold text-blue-500 text-center cursor-pointer"
          >
            LOGO
          </a>
        </div>
        <Menu
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          theme="light"
          items={menuItems}
        />
      </div>
      {/* Header */}
      <div className="bg-blue-600 py-4 shadow-lg flex items-center justify-between px-6 rounded-b-lg">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <div className="flex items-center cursor-pointer">
              <Avatar
                src="https://picsum.photos/40"
                className="cursor-pointer"
              />
              <span className="ml-2 text-white hidden md:inline">
                <span className="italic">Admin: </span>
                {user.name}
              </span>
              <span className="ml-1 text-white">▼</span>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Main Content */}
      <Content className="p-6 bg-gray-100">
        <Outlet />
      </Content>

      {/* Footer */}
      <Footer className="text-center text-gray-500 bg-gray-200 shadow-md">
        Footer
      </Footer>
    </div>
  );
}
