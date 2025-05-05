import { Outlet } from "react-router-dom";
import { AccountSidebar } from "../../components/AccountSidebar";
import { useAuth } from "../../hooks/AuthContext";

export default function Account() {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-12 max-w-7xl mx-auto p-5 gap-5">
      <div className="col-span-3">
        <AccountSidebar user={user} />
      </div>
      <div className="col-span-8 rounded-sm">
        <Outlet />
      </div>
    </div>
  );
}
