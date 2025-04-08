import { Outlet } from "react-router-dom";
import { AccountSidebar } from "../components/AccountSidebar";

export default function Account() {
  return (
    <div className="grid grid-cols-12 max-w-[1200px] mx-auto p-5">
      <div className="col-span-3">
        <AccountSidebar />
      </div>
      <div className="col-span-8">
        <Outlet />
      </div>
    </div>
  );
}
