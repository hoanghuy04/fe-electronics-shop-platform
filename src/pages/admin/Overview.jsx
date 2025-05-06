import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const Overview = () => {
  return (
    <div>
      <Title level={2}>Admin Overview</Title>
      <p>Welcome to the admin dashboard. View key metrics and manage your store here.</p>
    </div>
  );
};

export default Overview;