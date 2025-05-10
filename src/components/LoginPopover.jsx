import {
  UserOutlined,
  LogoutOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { path } from "../constants/path";

export default function LoginPopover() {
  const { user, isAuthenticated, logout } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setPopoverOpen(false);
  };

  const content = isAuthenticated ? (
    <div className="w-[250px]">
      <Link
        to={path.account}
        onClick={() => setPopoverOpen(false)}
        className="font-semibold text-sm py-2 flex items-center gap-2 !text-title"
      >
        <span className="text-xl">👋</span>
        <div className="hover:underline">Xin chào, {user?.name}</div>
      </Link>
      <div className="border-t border-line-border my-1"></div>
      <div className="flex flex-col text-sm text-gray-800">
        <Link
          to={path.orderHistory}
          onClick={() => setPopoverOpen(false)}
          className="flex items-center gap-2 py-2"
        >
          <ShoppingOutlined className="!text-title text-xl" />
          <span className="hover:underline font-semibold !text-title">
            Đơn hàng của tôi
          </span>
        </Link>
        <Link
          to={path.viewed}
          onClick={() => setPopoverOpen(false)}
          className="flex items-center gap-2 py-2"
        >
          <EyeOutlined className="!text-title text-xl" />
          <span className="hover:underline font-semibold !text-title">
            Đã xem gần đây
          </span>
        </Link>
        <div className="border-t border-line-border my-1"></div>
        <div
          onClick={handleLogout}
          className="flex items-center gap-2 py-2 cursor-pointer"
        >
          <LogoutOutlined className="!text-title text-xl" />
          <span className="hover:underline font-semibold !text-title">
            Đăng xuất
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-[250px]">
      <div className="font-semibold text-sm mb-4 flex items-center gap-2">
        <span className="text-xl">👋</span>
        <div>Xin chào, vui lòng đăng nhập</div>
      </div>
      <div className="flex gap-3 mb-3">
        <Link to={path.login} onClick={() => setPopoverOpen(false)}>
          <button className="bg-black !text-white px-4 py-2 rounded-sm border border-black cursor-pointer">
            ĐĂNG NHẬP
          </button>
        </Link>
        <Link to={path.register} onClick={() => setPopoverOpen(false)}>
          <button className=" !text-title px-6 py-2 rounded-sm border border-line-border cursor-pointer">
            ĐĂNG KÝ
          </button>
        </Link>
      </div>
      <div className="border-t border-line-border my-5"></div>
      <div className="flex items-center gap-2 text-sm cursor-pointer">
        <QuestionCircleOutlined />
        <span className="hover:underline">Trợ giúp</span>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      open={popoverOpen}
      onOpenChange={(visible) => setPopoverOpen(visible)}
    >
      <Button
        icon={<UserOutlined />}
        type="primary"
        className="flex items-center gap-2 !bg-red-900 !hover:bg-red-800 !text-lg"
      >
        {isAuthenticated ? `Xin chào ${user?.name}` : "Đăng nhập"}
      </Button>
    </Popover>
  );
}
