import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col } from "antd";
import { Column, Line } from "@ant-design/plots";
import { orderService } from "../../services/order.service";

const { Title } = Typography;

const Overview = () => {
  const [orders, setOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyCustomers, setMonthlyCustomers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const response = await orderService.getAllOrders();
        const data = response.data || [];

        const filtered = data.filter((order) => {
          const year = new Date(order.order_date || order.created_at).getFullYear();
          return year === currentYear && order.status === "PENDING";
        });



        const revenueByMonth = Array(12).fill(0);
        const customersByMonth = Array(12).fill().map(() => new Set());
        let totalRevenueCalc = 0;

        filtered.forEach((order) => {
          const date = new Date(order.order_date || order.created_at);
          const month = date.getMonth();


          const price = Number(order.total_price || 0);
          revenueByMonth[month] += price;
          customersByMonth[month].add(order.customer_id);
          totalRevenueCalc += price;
        });

        const monthlyRevenueData = revenueByMonth.map((value, idx) => ({
          month: `Tháng ${idx + 1}`,
          revenue: value,
        }));

        const monthlyCustomerData = customersByMonth.map((set, idx) => ({
          month: `Tháng ${idx + 1}`,
          customers: set.size,
        }));

        const totalCustomersSet = new Set();
        customersByMonth.forEach((set) => set.forEach((id) => totalCustomersSet.add(id)));



        setMonthlyRevenue(monthlyRevenueData);
        setMonthlyCustomers(monthlyCustomerData);
        setTotalRevenue(totalRevenueCalc);
        setTotalCustomers(totalCustomersSet.size);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      }
    };

    fetchOrders();
  }, []);
  

  return (
    <div>
      <Title level={2}>Admin Overview</Title>
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card title="Tổng lợi nhuận năm nay" bordered={false}>
            {totalRevenue.toLocaleString()} VNĐ
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tổng khách hàng năm nay" bordered={false}>
            {totalCustomers} khách hàng
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Lợi nhuận theo tháng">
            <Column
              data={monthlyRevenue}
              xField="month"
              yField="revenue"
              height={300}
              autoFit
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Khách hàng theo tháng">
            <Line
              data={monthlyCustomers}
              xField="month"
              yField="customers"
              height={300}
              autoFit
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
