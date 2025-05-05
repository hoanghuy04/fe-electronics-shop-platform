import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col } from "antd";
import { ArrowUpOutlined, ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import axios from "axios";

const Overview = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/revenue")
      .then((response) => {
        setRevenueData(response.data);
      })
      .catch(() => {
        setRevenueData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Cấu hình biểu đồ Column
  const config = {
    data: revenueData,
    xField: "date",
    yField: "amount",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      date: { alias: "Ngày" },
      amount: { alias: "Doanh thu (VNĐ)" },
    },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tổng quan</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={revenueData.reduce((sum, item) => sum + item.amount, 0)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600" }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng mới"
              value={10}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Sản phẩm bán chạy"
              value={5}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>
      <Card className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Biểu đồ doanh thu</h2>
        {loading ? <div>Đang tải...</div> : <Column {...config} />}
      </Card>
    </div>
  );
};

export default Overview;