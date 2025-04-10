import React from "react";
import { Card, Typography } from "antd";
import { Tag } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AccountViewedProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  return (
    <Card
      cover={<img alt={product.title} src={product.image_url[0]} />}
      onClick={handleCardClick}
      className="p-0 shadow-lg rounded-lg cursor-pointer"
    >
      <div>
        <Title level={5} className="text-lg font-semibold">
          {product.title}
        </Title>

        <div className="flex justify-between items-end">
          <div className="flex flex-col items-center">
            <Text delete className="text-md !text-secondary">
              {product.price.toLocaleString()}đ
            </Text>
            <Text className="!text-primary text-xl font-bold">
              {(product.price * (1 - product.discount)).toLocaleString()}đ
            </Text>
          </div>

          <div>
            <Tag color="red" className="mt-2 text-white text-md font-semibold">
              -{product.discount}%
            </Tag>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccountViewedProductCard;
