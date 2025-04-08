import { NavLink } from "react-router-dom";
import { UserRound, MapPin, LogOut, Package } from "lucide-react";
import { path } from "../constants/path";

export function AccountSidebar() {
  return (
    <div className="border-r border-gray-300 py-6 bg-white">
      <div className="flex items-center space-x-3 px-5 pb-5 border-line-border border-b">
        <div className="rounded-full flex justify-center items-center">
          <UserRound className="text-white p-2 w-12 h-12 rounded-full bg-secondary mr-2" />
        </div>
        <div className="text-lg font-semibold">Huyền Trần Ngọc</div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <NavLink
            to={path.account}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-primary pb-2 ${
                isActive ? " text-primary" : "text-title"
              } `
            }
          >
            <UserRound />
            Thông tin tài khoản
          </NavLink>
        </div>

        <div>
          <NavLink
            to={path.address}
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-primary pb-2 ${
                isActive ? " text-primary" : ""
              } `
            }
          >
            <MapPin />
            Sổ địa chỉ
          </NavLink>
        </div>

        <div>
          <NavLink
            to={path.orderHistory}
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-primary pb-2 ${
                isActive ? " text-primary" : ""
              } `
            }
          >
            <Package />
            Quản lý đơn hàng
          </NavLink>
        </div>

        {/* <div>
          <NavLink
            to="/viewed-products"
            className={({ isActive }) => (isActive ? "text-primary" : "")}
          >
            Sản phẩm đã xem
          </NavLink>
        </div> */}

        <div>
          <NavLink
            to={path.logout}
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-primary pb-2 ${
                isActive ? " text-primary" : ""
              } `
            }
          >
            <LogOut />
            Đăng xuất
          </NavLink>
        </div>
      </div>
    </div>
  );
}
