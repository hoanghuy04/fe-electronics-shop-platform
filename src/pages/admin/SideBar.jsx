import { Menu } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, ShoppingOutlined, FileTextOutlined, BarChartOutlined } from "@ant-design/icons";
import { path } from "../../constants/path";

const Sidebar = () => {
    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
                {
                    key: "1",
                    icon: <HomeOutlined />,
                    label: <Link to={path.homeAdmin}>Tổng quan</Link>,
                },
                {
                    key: "2",
                    icon: <ShoppingOutlined />,
                    label: <Link to={`${path.homeAdmin}/${path.productManagement}`}>Sản phẩm</Link>,
                },
                {
                    key: "3",
                    icon: <FileTextOutlined />,
                    label: <Link to={`${path.homeAdmin}/${path.orderManagement}`}>Đơn hàng</Link>,
                },
                {
                    key: "4",
                    icon: <BarChartOutlined />,
                    label: <Link to={`${path.homeAdmin}/${path.report}`}>Báo cáo</Link>,
                },
            ]}
        />
    );
};

export default Sidebar;