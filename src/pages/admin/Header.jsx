import React from "react";
import { Input, Button, Avatar, Dropdown, Menu } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";

const HeaderAdmin = () => {
    const menuItems = [
        { key: "1", label: "Hồ sơ" },
        { key: "2", label: "Cài đặt" },
        { key: "3", label: "Đăng xuất" },
    ];

    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
            <Input
                placeholder="Tìm kiếm sản phẩm, đơn hàng..."
                prefix={<SearchOutlined />}
                className="w-1/3"
                onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex items-center gap-4">
                <Button icon={<BellOutlined />} />
                <Dropdown menu={{ items: menuItems }}>
                    <Avatar icon={<UserOutlined />} className="cursor-pointer" />
                </Dropdown>
            </div>
        </div>
    );
};

export default HeaderAdmin;