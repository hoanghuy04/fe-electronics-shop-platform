import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { ProductContext } from "../hooks/ProductContext";
import { reviewService } from './../services/review.service';

export default function ProductCard(props) {
  const { product } = props;
  const discountedPrice = product.price - product.price * product.discount;
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch reviews and calculate average rating
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await reviewService.getReviewsByProductID(product.id);
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = (totalRating / reviews.length).toFixed(1);
          setAverageRating(avgRating);
          setReviewCount(reviews.length);
        } else {
          setAverageRating(0);
          setReviewCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [product.id]);

  // Check if product is new (within 30 days)
  const isNewProduct = () => {
    if (!product.created_at) return false;
    const createdDate = new Date(product.created_at);
    const currentDate = new Date();
    const diffInDays = (currentDate - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30;
  };

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

  // Render product card with conditional ribbons
  const renderProductCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* Product Image */}
      <div className="w-full aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url && product.image_url[0] ? product.image_url[0] : ""}
          alt={product.title}
          className="w-full h-full object-fit hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-medium truncate">{product.title}</h3>
        
        <div className="text-sm mb-2" style={{ background: "#ECECEC", borderRadius: "4px", color: "#6D6E72", padding: "4px 8px" }}>
          {Object.entries(product.description).map(([key, value]) => (
            <div key={key} className="truncate mb-2">
              {key}: {value}
            </div>
          ))}
        </div>

        
        {product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
          )}

        <div className="flex items-center justify-between space-x-2">
          <span className="text-lg font-bold text-primary">
            {discountedPrice.toLocaleString("vi-VN")}đ
          </span>
        {product.discount > 0 && (
          <span className="inline-block mt-1 px-2 py-1 w-[40px] bg-blue-100 text-primary text-xs rounded">
            -{Math.round(product.discount * 100)}%
          </span>
        )}
        </div>
        {/* Average Rating and Review Count */}
          <div className="mt-2 text-sm flex items-center">
            <span className="text-orange-500 ">{averageRating}</span> 
            <span><svg style={{height: "12px", width: "12px"}} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.09627 11.6195L2.82735 8.16864L0.268563 5.80414C0.268563 5.80414 -0.096986 5.48462 0.0248693 5.03728C0.146725 4.58994 0.634105 4.58994 0.634105 4.58994L4.04582 4.27041L5.38614 1.01124C5.38614 1.01124 5.5689 0.5 5.99538 0.5C6.42185 0.5 6.60461 1.01124 6.60461 1.01124L7.94493 4.27041L11.4785 4.58994C11.4785 4.58994 11.844 4.65385 11.9659 5.03728C12.0877 5.42071 11.844 5.67633 11.844 5.67633L9.1634 8.16864L9.89448 11.7473C9.89448 11.7473 10.0163 12.1308 9.71171 12.3864C9.40709 12.642 8.91971 12.3864 8.91971 12.3864L5.99538 10.5331L3.13197 12.3864C3.13197 12.3864 2.70551 12.642 2.33996 12.3864C1.97442 12.1308 2.09627 11.6195 2.09627 11.6195Z" fill="#FF8A00"></path></svg></span> 
            <span className="ms-3 text-gray-500">({reviewCount} lượt đánh giá)</span>
          </div>
      </div>
    </div>
  );

  return (
    <div key={product.id} className="py-4 px-2 cursor-pointer" onClick={handleClick}>
      {/* Apply multiple ribbons if both conditions are met */}
      {product.discount > 0 && isNewProduct() && product.discount > 0 ? (
        <Badge.Ribbon
          text={`Giảm ${(product.discount * 100).toFixed(0)}%`}
          style={{ padding: "4px 10px", fontSize: "16px", fontStyle: "italic", fontWeight: "bold" }}
          color="red"
        >
          {renderProductCard()}
        </Badge.Ribbon>
      ) : isNewProduct() ? (
        <Badge.Ribbon
          text="Sản phẩm mới"
          style={{ padding: "4px 10px", fontSize: "14px", fontWeight: "bold" }}
          color="green"
          placement="start"
        >
          {renderProductCard()}
        </Badge.Ribbon>
      ) : (
        renderProductCard()
      )}
    </div>
  );
}