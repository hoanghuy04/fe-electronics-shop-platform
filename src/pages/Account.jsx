import { Outlet } from "react-router-dom";
import { AccountSidebar } from "../components/AccountSidebar";
import { useEffect, useState } from "react";
import { get } from "../services/request";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import SpinLoading from "../components/SpinLoading";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  // const user = {
  //   id: "1",
  //   fullname: "Trần Ngọc Huyền",
  //   gender: 0,
  //   address: [
  //     {
  //       street: "14 Nguyễn Văn Bảo",
  //       ward: "Xã Khánh An",
  //       district: "Huyện An Phú",
  //       province: "Tỉnh An Giang",
  //     },
  //     {
  //       street: "12 Nguyễn Văn Bảo",
  //       ward: "Xã Khánh An",
  //       district: "Huyện An Phú",
  //       province: "Tỉnh An Giang",
  //     },
  //   ],
  //   email: "tranngochuyenn1909@gmail.com",
  //   password: "123456789",
  //   phone: "0964424149",
  //   // dob: "15/08/1995",
  // };

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
    <div className="grid grid-cols-12 max-w-5xl mx-auto p-5 gap-5">
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
