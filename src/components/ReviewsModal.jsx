import React, { useState } from "react";
import { Modal, Button, Rate, Progress, Checkbox } from "antd";

const ReviewsModal = ({ product, reviews, isReviewsModalVisible, handleReviewsModalCancel }) => {
  // Trạng thái bộ lọc
  const [filterRating, setFilterRating] = useState(null); // Lọc theo số sao: null (tất cả), 1, 2, 3, 4, 5

  // Tính trung bình đánh giá
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  // Tính phần trăm cho từng mức rating
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
    return {
      star,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
      count,
    };
  });

  // Lọc danh sách đánh giá dựa trên tiêu chí
  const filteredReviews = reviews.filter((review) => {
    const matchesRating = filterRating ? Math.floor(review.rating) === filterRating : true;
    return matchesRating;
  });

  // Hàm xử lý khi chọn bộ lọc sao
  const handleRatingFilter = (star) => {
    setFilterRating(star === filterRating ? null : star); // Nếu chọn lại thì bỏ lọc
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span>{`Tất cả đánh giá cho ${product.title}`}</span>
          <span className="text-lg text-gray-500">{`(${reviews.length} đánh giá)`}</span>
        </div>
      }
      visible={isReviewsModalVisible}
      onCancel={handleReviewsModalCancel}
      width={1680}
      footer={[
        <Button key="close" onClick={handleReviewsModalCancel}>
          Đóng
        </Button>,
      ]}
      className="text-2xl"
    >
      <div className="flex p-4 bg-gray-50 rounded-lg">
        {/* Hình ảnh sản phẩm */}
        <div className="w-1/4 mr-10 flex items-center justify-center">
          <div className="relative">
            <img
              src={product.image_url[0]}
              alt={product.title}
              className="w-full h-64 object-contain rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 opacity-20 rounded-lg"></div>
          </div>
        </div>

        {/* Nội dung đánh giá */}
        <div className="flex-1 space-y-6">
          {/* Trung bình đánh giá và đồ thị */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <span className="text-4xl font-bold text-yellow-500 mr-4">
                {averageRating.toFixed(1)}
              </span>
              <div>
                <Rate disabled allowHalf value={averageRating} className="text-xl" />
                <p className="text-gray-500 text-sm">Dựa trên {reviews.length} đánh giá</p>
              </div>
            </div>

            {/* Đồ thị phân phối rating */}
            <div className="space-y-2">
              {ratingDistribution.map((rating) => (
                <div key={rating.star} className="flex items-center">
                  <span className="w-12 text-sm text-gray-600">{rating.star} ★</span>
                  <Progress
                    percent={rating.percentage}
                    showInfo={false}
                    strokeColor={
                      rating.star >= 4 ? "#52c41a" : rating.star >= 3 ? "#faad14" : "#ff4d4f"
                    }
                    className="flex-1 mx-2"
                  />
                  <span className="w-16 text-sm text-gray-500">
                    {rating.count} ({Math.round(rating.percentage)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tiêu chí lọc */}
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex space-x-4">
              {[5, 4, 3, 2, 1].map((star) => (
                <Button
                  key={star}
                  type={filterRating === star ? "primary" : "default"}
                  onClick={() => handleRatingFilter(star)}
                  className="flex items-center mr-4"
                >
                  {star} ★
                </Button>
              ))}
            </div>
          </div>

          {/* Danh sách đánh giá */}
          {filteredReviews.length > 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md max-h-96 overflow-y-auto">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">{review.user_name}</span>
                      <Rate
                        disabled
                        allowHalf
                        value={review.rating}
                        className="ml-2 text-yellow-500"
                      />
                    </div>
                    <span className="text-gray-500 text-sm">Đăng ngày 10/04/2025</span>
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                  {review.image_url?.length > 0 && (
                    <div className="mt-2 flex space-x-2">
                      {review.image_url.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Review ${index}`}
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">
              Không có đánh giá nào phù hợp với tiêu chí lọc.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewsModal;