import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  Carousel,
  Spin,
  Modal,
  Form,
  Rate,
  Input,
  Button,
} from "antd";
import ProductCard from "../../components/ProductCard";
import { searchProductsByTitle } from "../../services/productService";
import { useCart } from "../../hooks/useCart";
import { addReview, getReviewsByProductID } from "../../services/ReviewService"; // Thêm getReviewsByProductID
import ReviewsModal from "../../components/ReviewsModal";

const initItemsBreadcum = [
  {
    title: <a href="/">Trang chủ</a>,
  },
  {
    title: <a href="/products/category/all">Danh sách sản phẩm</a>,
  },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relevantProducts, setRelevantProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal thêm đánh giá
  const [isReviewsModalVisible, setIsReviewsModalVisible] = useState(false); // Modal xem tất cả đánh giá
  const [reviews, setReviews] = useState([]); // Danh sách đánh giá
  const [form] = Form.useForm();
  const { addToCart } = useCart();
  const [itemsBreadcum, setItemsBreadcum] = useState(initItemsBreadcum);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const products = await searchProductsByTitle("");
        if (products && Array.isArray(products)) {
          setAllProducts(products);
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy toàn bộ sản phẩm:", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    const fetchProduct = () => {
      try {
        const foundProduct = allProducts.find((p) => p.slug === slug);
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.image_url[0]);
          setItemsBreadcum((prev) => [...prev, { title: foundProduct.title }]);

          const keyword = foundProduct.title.split(" ")[0].toUpperCase();
          const related = allProducts.filter((productFilter) => {
            return (
              productFilter.title.toUpperCase().includes(keyword) &&
              productFilter.id !== foundProduct.id
            );
          });
          setRelevantProducts(related);
        } else {
          setProduct(null);
          setRelevantProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm sản phẩm:", error);
        setProduct(null);
        setRelevantProducts([]);
      }
    };

    fetchProduct();
  }, [slug, allProducts]);

  // Lấy danh sách đánh giá khi sản phẩm được tải
  useEffect(() => {
    if (!product) return;

    const fetchReviews = async () => {
      try {
        const productReviews = await getReviewsByProductID(product.id); // Giả định có API này
        if (productReviews && Array.isArray(productReviews)) {
          setReviews(productReviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [product]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showReviewsModal = () => {
    setIsReviewsModalVisible(true);
  };

  const handleReviewsModalCancel = () => {
    setIsReviewsModalVisible(false);
  };

  const handleSubmitReview = async (values) => {
    const userId = 1; // Giả định userId
    const username = "Trần Ngọc Huyền"; // Giả định username
    const reviewData = {
      product_id: product.id,
      user_id: userId,
      user_name: username,
      rating: values.rating,
      comment: values.comment,
    };

    try {
      const result = await addReview(reviewData);
      if (result) {
        console.log("Đánh giá đã được thêm:", result);
        setReviews((prev) => [...prev, result]); // Cập nhật danh sách đánh giá
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
    }
  };

  if (!product) {
    return <div className="container mx-auto py-8">Sản phẩm không tồn tại</div>;
  }

  const discountedPrice = product.price - product.price * product.discount;
  const thumbnailImages = product.image_url.filter((img) => img !== mainImage);

  return (
    <div className="container mx-auto px-6 lg:px-8 py-8">
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin tip={"loading ..."} size="large" />
        </div>
      ) : (
        <div className="breadcum">
          <div className="text-sm text-gray-500 mb-4">
            <Breadcrumb items={itemsBreadcum} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-lg shadow-lg bg-white py-4 px-8">
            <div>
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex space-x-2 mt-4 justify-center">
                {thumbnailImages.map((img, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                      mainImage === img ? "border-blue-500" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h1 className="font-bold text-3xl text-gray-800">
                {product.title}
              </h1>
              <div className="flex items-center mt-2">
                <span className="text-yellow-400">0.0 ★</span>
                <a href="/" className="ml-2 text-gray-500">
                  Xem đánh giá
                </a>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <span className="text-2xl font-bold text-primary">
                  {discountedPrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-white bg-primary px-2 py-1 rounded">
                    -{Math.round(product.discount * 100)}%
                  </span>
                )}
              </div>

              <div className="mt-5">
                <button
                  onClick={() => addToCart(product)}
                  className="bg-primary !text-white px-4 py-3 rounded-md cursor-pointer"
                >
                  MUA NGAY - GIAO NHANH TỐC HÀNH
                </button>
                <div className="mt-10 text-gray-700">
                  <p className="font-semibold">Thông tin chung:</p>
                  <ul className="list-disc list-inside">
                    <li>Hỗ trợ đổi mới trong 7 ngày.</li>
                  </ul>
                  <p className="font-bold text-primary">
                    Hỗ trợ trả góp MPOS (thẻ tín dụng), HDSAISON (
                    <a href="/" className="text-blue-500">
                      Xem chi tiết
                    </a>
                    ).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="device-configuration rounded-lg shadow-lg bg-white py-4 px-8">
              <div className="text-lg font-bold mb-4">Cấu hình thiết bị</div>
              <table className="w-full text-sm text-gray-700">
                <tbody>
                  {Object.entries(product.description).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200">
                      <td className="py-2 font-medium w-1/3">{key}</td>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="device-reviews rounded-lg shadow-lg bg-white py-4 px-8 pb-8">
              <div className="text-lg font-bold mb-4">Đánh giá sản phẩm</div>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 text-lg">
                  {reviews.length > 0
                    ? (
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                      ).toFixed(1) + " ★"
                    : "0.0 ★"}
                </span>
                <span className="ml-2 text-gray-500">
                  ({reviews.length} đánh giá)
                </span>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {reviews.slice(0, 2).map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{review.user_name}</span>
                      <span className="ml-2 text-yellow-500">
                        {review.rating} ★
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                    <span className="text-gray-500 text-sm">
                      Đăng ngày 10/04/2025
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-3">
                <div className="text-primary bg-white">
                  <Button onClick={showModal}>Đánh giá</Button>
                </div>
                <div className="text-white">
                  <Button type="primary" onClick={showReviewsModal}>
                    Xem tất cả đánh giá
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal thêm đánh giá */}
          <Modal
            title="Thêm đánh giá của bạn"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmitReview}>
              <Form.Item
                name="rating"
                label="Điểm đánh giá"
                rules={[
                  { required: true, message: "Vui lòng chọn điểm đánh giá!" },
                ]}
              >
                <Rate allowHalf defaultValue={5} />
              </Form.Item>
              <Form.Item
                name="comment"
                label="Bình luận"
                rules={[
                  { required: true, message: "Vui lòng nhập bình luận!" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập bình luận của bạn..."
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal xem tất cả đánh giá */}
          <ReviewsModal
            product={product}
            reviews={reviews}
            isReviewsModalVisible={isReviewsModalVisible}
            handleReviewsModalCancel={handleReviewsModalCancel}
          />

          <div className="mt-6 rounded-lg shadow-lg bg-white py-4 px-8">
            <div className="text-2xl font-bold m-0">Sản phẩm liên quan</div>
            <Carousel
              slidesToShow={4}
              slidesToScroll={1}
              arrows
              className="p-6"
            >
              {relevantProducts.map((relevantProduct) => (
                <ProductCard
                  key={relevantProduct.id}
                  product={relevantProduct}
                />
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
