import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const OrderManagement = () => {
  return (
    <div>
      <Title level={2}>Order Management</Title>
      <p>View and manage customer orders.</p>
    </div>
  );
};

export default OrderManagement;