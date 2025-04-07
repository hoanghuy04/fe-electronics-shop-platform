import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel, Spin } from "antd";
import ProductCard from "../components/ProductCard";
import { searchProductsByTitle } from "../services/productService";
import { useCart } from "../hooks/useCart";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null); // Sản phẩm hiện tại
  const [relevantProducts, setRelevantProducts] = useState([]); // Sản phẩm liên quan
  const [allProducts, setAllProducts] = useState([]); // Cache toàn bộ sản phẩm
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Lấy toàn bộ sản phẩm một lần duy nhất khi component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const products = await searchProductsByTitle(""); // Lấy toàn bộ sản phẩm
        if (products && Array.isArray(products)) {
          setAllProducts(products); // Lưu vào cache
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

          const keyword = foundProduct.title.split(" ")[0].toUpperCase();

          // Lọc các sản phẩm liên quan từ danh sách đã cache
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

  if (!product) {
    return <div className="container mx-auto py-8">Sản phẩm không tồn tại</div>;
  }

  const discountedPrice = product.price - product.price * product.discount;

  const thumbnailImages = product.image_url.filter((img) => img !== mainImage);

  return (
    <div className="container mx-auto px-6 lg:px-8 py-8">
      <div className="h-[541px]">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin tip={"loading ..."} size="large" className="" />
          </div>
        ) : (
          <div className="">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
              <a href="/" className="text-blue-500 hover:text-blue-700">
                Trang chủ
              </a>
              {"  "}/ {"  "}
              <a href="/category" className="text-blue-500 hover:text-blue-700">
                {product.title.includes("PC") ? "PC" : "Phần mềm"}
              </a>{" "}
              / <span className="text-gray-700">{product.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-lg shadow-lg bg-white py-4  px-8">
              {/* Hình ảnh sản phẩm */}
              <div>
                {/* Hình ảnh chính */}
                <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Hình ảnh phụ */}
                <div className="flex space-x-2 mt-4">
                  {thumbnailImages.map((img, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                        mainImage === img
                          ? "border-blue-500"
                          : "border-gray-300"
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

              {/* Thông tin sản phẩm */}
              <div>
                {/* Tiêu đề và đánh giá */}
                <h1 className="font-bold text-3xl  text-gray-800">
                  {product.title}
                </h1>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">0.0 ★</span>
                  <a href="/" className="ml-2 text-gray-500">
                    Xem đánh giá
                  </a>
                </div>

                {/* Giá và giảm giá */}
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-2xl font-bold text-blue-500">
                    {discountedPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-white bg-blue-500 px-2 py-1 rounded">
                      -{Math.round(product.discount * 100)}%
                    </span>
                  )}
                </div>

                {/* Khuyến mãi */}
                <div className="mt-5">
                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="bg-blue-500 !text-white px-4 py-3 rounded-md cursor-pointer"
                  >
                    MUA NGAY - GIAO NHANH TỐC HÀNH
                  </button>
                  <div className="mt-10 text-gray-700">
                    <p className="font-semibold">Thông tin chung:</p>
                    <ul className="list-disc list-inside">
                      <li>Hỗ trợ đổi mới trong 7 ngày.</li>
                    </ul>

                    <p className="font-bold text-blue-500">
                      Hỗ trợ trả góp MPOS (thẻ tín dụng), HDSAISON (
                      <a href="/" className="text-red-600">
                        Xem chi tiết
                      </a>
                      ).
                    </p>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                {/* <div className="mt-4">
              <h3 className="text-lg font-semibold">Thông tin chi tiết:</h3>
              <ul className="mt-2 space-y-1 text-gray-700">
                {Object.entries(product.description).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </li>
                ))}
              </ul>
            </div> */}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Cấu hình thiết bị */}
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

              {/* Đánh giá thiết bị */}
              <div className="device-reviews rounded-lg shadow-lg bg-white py-4 px-8 pb-8">
                <div className="text-lg font-bold mb-4">Đánh giá thiết bị</div>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 text-lg">4.5 ★</span>
                  <span className="ml-2 text-gray-500">(12 đánh giá)</span>
                </div>
                {/* Danh sách bình luận (giả lập) */}
                <div className="space-y-4">
                  {/* Bình luận 1 */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center">
                      <span className="font-medium">Nguyễn Văn A</span>
                      <span className="ml-2 text-yellow-500">5 ★</span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      Sản phẩm rất tốt, sử dụng mượt mà, đáng giá với số tiền bỏ
                      ra!
                    </p>
                    <span className="text-gray-500 text-sm">
                      Đăng ngày 01/04/2025
                    </span>
                  </div>
                  {/* Bình luận 2 */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center">
                      <span className="font-medium">Trần Thị B</span>
                      <span className="ml-2 text-yellow-500">4 ★</span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      Hài lòng, nhưng giao hàng hơi chậm. Cần cải thiện tốc độ
                      giao hàng.
                    </p>
                    <span className="text-gray-500 text-sm">
                      Đăng ngày 02/04/2025
                    </span>
                  </div>
                </div>
                {/* Nút xem thêm */}
                <div className="mt-4">
                  <a className="bg-blue-500 text-white py-3 px-4 rounded-lg shadow-lg cursor-pointer">
                    Xem thêm đánh giá
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg shadow-lg bg-white py-4  px-8">
              <div className="text-2xl font-bold m-0">Sản phẩm liên quan</div>
              <Carousel
                slidesToShow={4}
                slidesToScroll={1}
                arrows
                className="p-6"
              >
                {relevantProducts.map((relevantProduct) => {
                  return (
                    <ProductCard
                      key={relevantProduct.id}
                      product={relevantProduct}
                    />
                  );
                })}
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
