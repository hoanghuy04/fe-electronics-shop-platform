import { Layout } from "antd";
import HeaderAdmin from './../pages/admin/Header';
import FooterAdmin from './../pages/admin/Footer';
import Sidebar from './../pages/admin/SideBar';
import { Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

const DefaultLayoutAdmin = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} className="bg-gray-800">
        <div className="text-white text-center py-4 text-xl font-bold">E-Shop Admin</div>
        <Sidebar />
      </Sider>
      <Layout>
        <HeaderAdmin />
        <Content className="p-6 bg-gray-100">
          <Outlet/>
        </Content>
        <FooterAdmin />
      </Layout>
    </Layout>
  );
};

export default DefaultLayoutAdmin;