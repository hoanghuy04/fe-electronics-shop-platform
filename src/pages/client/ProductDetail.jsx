import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import { useCart } from "../../hooks/useCart";
import ReviewsModal from "../../components/ReviewsModal";
import { ProductContext } from "../../hooks/ProductContext";
import { productService } from './../../services/product.service';
import { reviewService } from "../../services/review.service";

const initItemsBreadcum = [
  {
    title: <a href="/">Trang chủ</a>,
  },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const { state } = useLocation();
  const [product, setProduct] = useState(null);
  const { viewedProducts, categories } = useContext(ProductContext);
  const [relevantProducts, setRelevantProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReviewsModalVisible, setIsReviewsModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [form] = Form.useForm();
  const { addToCart } = useCart();
  const [itemsBreadcum, setItemsBreadcum] = useState(initItemsBreadcum);

  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [replyForm] = Form.useForm();

  const handleReplyClick = (reviewId) => {
    setCurrentReviewId(reviewId);
    setIsReplyModalVisible(true);
  };

  const handleReplyModalCancel = () => {
    setIsReplyModalVisible(false);
    replyForm.resetFields();
  };

  const handleReplySubmit = async (values) => {
    const replyData = {
      id: Date.now().toString(),
      user_name: "Trần Ngọc Huyền (Nhân viên)",
      reply_text: values.reply_text,
      reply_date: new Date().toISOString().split("T")[0],
    };

    try {
      const updatedReview = await addReplyToReview(currentReviewId, [
        ...reviews.find((r) => r.id === currentReviewId).replies,
        replyData,
      ]);

      setReviews((prev) =>
        prev.map((review) =>
          review.id === currentReviewId ? updatedReview : review
        )
      );
      setIsReplyModalVisible(false);
      replyForm.resetFields();
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
    }
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.searchProductsByTitle("");
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

          // Update breadcrumb
          const breadcrumbItems = [...initItemsBreadcum];
          let categoryLink = "/products/all/brand/all";
          let categoryTitle = "Danh sách sản phẩm";

          // if (state?.categorySlug) {
          //   const category = categories.find(
          //     (c) => c.slug === state.categorySlug
          //   );
          //   if (category) {
          //     categoryLink = `/products/${category.slug}/brand/all`;
          //     categoryTitle = category.name;
          //   } else {
          //     categoryLink = `/products/${state.categorySlug}/brand/all`;
          //     categoryTitle = state.categorySlug
          //       .replace(/-/g, " ")
          //       .replace(/\b\w/g, (c) => c.toUpperCase());
          //   }
          // } else {
            const productCategory = categories.find(
              (c) => c.id.toString() === foundProduct.category_id.toString()
            );
            if (productCategory) {
              categoryLink = `/products/${productCategory.slug}/brand/all`;
              categoryTitle = productCategory.name;
            }
          // }

          breadcrumbItems.push({
            title: <a href={categoryLink}>{categoryTitle}</a>,
          });
          breadcrumbItems.push({ title: foundProduct.title });

          setItemsBreadcum(breadcrumbItems);
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
  }, [slug, allProducts, categories, state]);

  useEffect(() => {
    if (!product) return;

    const fetchReviews = async () => {
      try {
        const productReviews = await reviewService.getReviewsByProductID(product.id);
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
    const userId = 1;
    const username = "Trần Ngọc Huyền";
    const reviewData = {
      product_id: product.id,
      user_id: userId,
      user_name: username,
      rating: values.rating,
      comment: values.comment,
    };

    try {
      const result = await reviewService.addReview(reviewData);
      if (result) {
        console.log("Đánh giá đã được thêm:", result);
        setReviews((prev) => [...prev, result]);
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
                <span className="text-yellow-400">
                  {reviews.length > 0
                    ? (
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                      ).toFixed(1) + " ★"
                    : "0.0 ★"}
                </span>
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

          <div className="mt-6 rounded-lg shadow-lg bg-white py-4 px-8">
            <div className="text-2xl font-bold m-0">Sản phẩm tương tự</div>
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
                {reviews.map((review) => (
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

                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="mb-2">
                          <div className="flex items-center">
                            <span className="font-medium">
                              {reply.user_name}
                            </span>
                            <span className="ml-2 text-gray-500 text-sm">
                              {reply.reply_date}
                            </span>
                          </div>
                          <p className="text-gray-600">{reply.reply_text}</p>
                        </div>
                      ))}
                    </div>

                    <Modal
                      title="Trả lời đánh giá"
                      visible={isReplyModalVisible}
                      onCancel={handleReplyModalCancel}
                      footer={null}
                    >
                      <Form
                        form={replyForm}
                        layout="vertical"
                        onFinish={handleReplySubmit}
                      >
                        <Form.Item
                          name="reply_text"
                          label="Nội dung phản hồi"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung phản hồi!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={4}
                            placeholder="Nhập phản hồi của bạn..."
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Gửi phản hồi
                          </Button>
                        </Form.Item>
                      </Form>
                    </Modal>
                    <Button
                      type="link"
                      onClick={() => handleReplyClick(review.id)}
                      className="text-blue-500 mt-2"
                    >
                      Trả lời
                    </Button>
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

          <div className="mt-6 rounded-lg shadow-lg bg-white py-12 px-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold ml-3">Sản phẩm đã xem</div>
            </div>
            <Carousel
              slidesToShow={5}
              slidesToScroll={1}
              arrows
              autoplay
              className="p-6"
            >
              {viewedProducts.length > 0 ? (
                viewedProducts.map((p) => (
                  <div key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div>Không có sản phẩm nào để hiển thị</div>
              )}
            </Carousel>
          </div>

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

          <ReviewsModal
            product={product}
            reviews={reviews}
            isReviewsModalVisible={isReviewsModalVisible}
            handleReviewsModalCancel={handleReviewsModalCancel}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;