import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const ProductManagement = () => {
  return (
    <div>
      <Title level={2}>Product Management</Title>
      <p>Manage your products, add new items, or update existing ones.</p>
    </div>
  );
};

export default ProductManagement;