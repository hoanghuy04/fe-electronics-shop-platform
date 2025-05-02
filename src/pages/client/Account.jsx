import { Outlet } from "react-router-dom";
import { AccountSidebar } from "../../components/AccountSidebar";
import { useEffect, useState } from "react";
import { get } from "../../services/request";
import SpinLoading from "../../components/SpinLoading";
import { useAuth } from "../../hooks/AuthContext";

export default function Account() {
  const { user } = useAuth();
  const [loading] = useState(true);

  if (loading) {
    return <SpinLoading />;
  }

  return (
    <div className="grid grid-cols-12 max-w-7xl mx-auto p-5 gap-5">
      <div className="col-span-3">
        {!loading && <AccountSidebar user={user} />}
        {loading && <SpinLoading />}
      </div>
      <div className="col-span-8 rounded-sm">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}
