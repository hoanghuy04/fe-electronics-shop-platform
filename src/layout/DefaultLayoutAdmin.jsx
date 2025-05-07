import { Content, Footer } from "antd/es/layout/layout";
import React from "react";
import { Layout, Menu, Avatar, Badge, Input } from "antd";
import {
  SearchOutlined,
  BellOutlined,
  TeamOutlined,
  ProjectOutlined,
  MessageOutlined,
  BarChartOutlined,
  DashboardOutlined,
  HddOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";
import { path } from "../constants/path";

const menuItems = [
  {
    key: path.homeAdmin,
    icon: <DashboardOutlined />,
    label: <NavLink to={path.homeAdmin}>Overview</NavLink>,
  },
  {
    key: `${path.homeAdmin}/${path.brandManagement}`,
    icon: <HddOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.brandManagement}`}>
        Brand Management
      </NavLink>
    ),
  },
  {
    key: `${path.homeAdmin}/${path.productManagement}`,
    icon: <ProjectOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.productManagement}`}>
        Product Management
      </NavLink>
    ),
  },
  {
    key: `${path.homeAdmin}/${path.userManagement}`,
    icon: <TeamOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.userManagement}`}>
        User Management
      </NavLink>
    ),
  },
  {
    key: `${path.homeAdmin}/${path.report}`,
    icon: <BarChartOutlined />,
    label: <NavLink to={`${path.homeAdmin}/${path.report}`}>Reports</NavLink>,
  },
  {
    key: `${path.homeAdmin}/${path.orderManagement}`,
    icon: <MessageOutlined />,
    label: (
      <NavLink to={`${path.homeAdmin}/${path.orderManagement}`}>
        Order Management
      </NavLink>
    ),
  },
];

export default function DefaultLayoutAdmin() {
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
          defaultSelectedKeys={[path.homeAdmin]}
          mode="inline"
          theme="light"
          items={menuItems}
        />
      </div>
      {/* Header */}
      <div className="bg-blue-600 py-4 shadow-lg flex items-center justify-between px-6 rounded-b-lg">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            className="w-64"
          />
          <div className="mr-10">
            <Badge className="cursor-pointer" count={5}>
              <BellOutlined className="text-xl text-white" />
            </Badge>
          </div>
          <Avatar src="https://picsum.photos/40" />
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
