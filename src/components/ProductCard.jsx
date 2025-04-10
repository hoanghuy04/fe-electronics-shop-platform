import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd"; // Import Badge từ Ant Design

export default function ProductCard(props) {
  const { product } = props;
  const discountedPrice = product.price - product.price * product.discount;

  const navigate = useNavigate();

  return (
    <div
      key={product.id}
      className="px-2 mb-4 cursor-pointer"
      onClick={() => navigate(`/products/${product.slug}`)}
    >
      {/* Nếu có discount, bao bọc card bằng Badge.Ribbon */}
      {product.discount > 0 ? (
        <Badge.Ribbon text="Giảm giá" style={{padding: "4px 10px", fontSize: "16px", fontStyle: 'italic', fontWeight: "bold"}} color="red">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
            {/* Hình ảnh sản phẩm */}
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src={
                  product.image_url && product.image_url[0]
                    ? product.image_url[0]
                    : ""
                }
                alt={product.title}
                className="w-full h-full object-fit hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-4 flex flex-col">
              <h3 className="text-lg font-medium truncate">{product.title}</h3>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  {discountedPrice.toLocaleString("vi-VN")}đ
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <span className="inline-block mt-1 px-2 py-1 w-[40px] bg-blue-100 text-primary text-xs rounded">
                  -{Math.round(product.discount * 100)}%
                </span>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {Object.entries(product.description).map(([key, value]) => (
                  <p key={key} className="truncate">
                    {key}: {value}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Badge.Ribbon>
      ) : (
        // Nếu không có discount, hiển thị card bình thường
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
          {/* Hình ảnh sản phẩm */}
          <div className="w-full aspect-[4/3] overflow-hidden">
            <img
              src={
                product.image_url && product.image_url[0]
                  ? product.image_url[0]
                  : ""
              }
              alt={product.title}
              className="w-full h-full object-fit hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="p-4 flex flex-col">
            <h3 className="text-lg font-medium truncate">{product.title}</h3>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                {discountedPrice.toLocaleString("vi-VN")}đ
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="inline-block mt-1 px-2 py-1 w-[40px] bg-blue-100 text-primary text-xs rounded">
                -{Math.round(product.discount * 100)}%
              </span>
            )}
            <div className="mt-2 text-sm text-gray-500">
              {Object.entries(product.description).map(([key, value]) => (
                <p key={key} className="truncate">
                  {key}: {value}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}