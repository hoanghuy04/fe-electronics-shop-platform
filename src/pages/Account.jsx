import { Outlet } from "react-router-dom";
import { AccountSidebar } from "../components/AccountSidebar";
import { useEffect, useState } from "react";
import { get } from "../services/request";
import SpinLoading from "../components/SpinLoading";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await get("users/1");
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
