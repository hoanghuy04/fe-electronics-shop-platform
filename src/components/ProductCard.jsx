import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  const { product } = props;
  const discountedPrice = product.price - product.price * product.discount;

  const navigate = useNavigate();

  const handleClick = () => {
    const viewedProducts = localStorage.getItem("viewedProducts");
    let data = [];
    if (viewedProducts) {
      data = JSON.parse(viewedProducts);
    }
    const isProductExist = data.some((item) => item.id === product.id);
    if (!isProductExist) {
      if (data.length >= 9) {
        data.shift();
      }
      data.push(product);
      localStorage.setItem("viewedProducts", JSON.stringify(data));
    }
    navigate(`/products/${product.slug}`);
  };

  return (
    <div
      key={product.id}
      className="py-4 px-2 cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 min-h-[487px]">
        {/* Hình ảnh sản phẩm */}
        <img
          src={
            product.image_url && product.image_url[0]
              ? product.image_url[0]
              : ""
          }
          alt={product.title}
          className="w-full h-[200px] object-cover hover:scale-105 duration-200"
        />

        {/* Thông tin sản phẩm */}
        <div className="p-4">
          <h3 className="text-lg font-medium truncate">{product.title}</h3>
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-500">
              {discountedPrice.toLocaleString("vi-VN")}đ
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-500 text-xs rounded">
              -{Math.round(product.discount * 100)}%
            </span>
          )}
          <div className="mt-2 text-sm text-gray-500">
            {Object.entries(product.description).map(([key, value]) => (
              <div key={key} className="wrapper">
                <p>
                  {key}: {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
