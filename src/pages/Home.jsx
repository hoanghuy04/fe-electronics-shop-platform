import React, { useContext, useEffect, useState } from "react";
import { Carousel, Spin } from "antd";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../hooks/ProductContext";
import { categoryColor } from './../constants/categoryColor';
import { Link } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import laptopgaming from '../../public/laptop-gaming.png'
import chuotgaming from '../../public/chuot-gaming.png'

const Home = () => {
  const [laptops, setLaptops] = useState([]);
  const [pcs, setPCs] = useState([]);

  const { products, categories, brands, loading } = useContext(ProductContext)
  // Dữ liệu giả lập cho carousel và banner
  const carouselImages = [
    { src: "https://file.hstatic.net/200000722513/file/thang_02_pc_gvn_banner_web_slider_800x400.jpg", navigation: "products/category/pc-gvn" },
    { src: "https://file.hstatic.net/200000722513/file/thang_04_laptop_gaming_banner_web_slider_800x400.jpg", navigation: "products/category/laptop" },
    { src: "https://file.hstatic.net/200000722513/file/thang_03_laptop_rtx_5090_800x400.jpg", navigation: "products/category/all" },
  ];


  const rightBanners = [
    { src: "https://file.hstatic.net/200000722513/file/thang_02_layout_web_-01.png", navigation: "products/category/pc-gvn" },
    { src: "https://file.hstatic.net/200000722513/file/thang_02_layout_web_-02.png", navigation: "products/category/ban-phim" },
    { src: "https://file.hstatic.net/200000722513/file/thang_02_layout_web_-03.png", navigation: "products/category/ban-phim" }
  ];


  const bottomBanners = [
    { src: "https://file.hstatic.net/200000722513/file/thang_02_layout_web_-09_acdc7c6d37584f0eb1ce8d35ba45507e.png", navigation: "products/category/loa-micro-webcam" },
    { src: "https://file.hstatic.net/200000722513/file/thang_02_layout_web_-08.png", navigation: "products/category/man-hinh" },
    { src: "https://file.hstatic.net/200000722513/file/thang_02_layout_web_-07.png", navigation: "products/category/chuot-lot-chuot" },
    { src: "https://file.hstatic.net/200000722513/file/thang_02_layout_web_-06.png", navigation: "products/category/pc-gvn" }
  ];


  // const stickyBanners = [
  //   "https://file.hstatic.net/200000722513/file/thang_02_pc_gvn_banner_side_web.jpg", // Banner bên trái
  //   "https://file.hstatic.net/200000722513/file/thang_03_laptop_rtx_5090_sticky_230x697.jpg", // Banner bên phải
  // ];

  const searchProductsByTitle = (keyword) => {
    try {

      if (!products || !Array.isArray(products)) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ");
      }

      if (!keyword || keyword.trim() === "") return products;

      const filterProducts = products.filter((p) => {
        return p.title.toLowerCase().includes(keyword.toLowerCase());
      });

      return filterProducts;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    try {
      const lts = searchProductsByTitle("laptop");
      setLaptops(lts);

      const pcs = searchProductsByTitle("pc");
      setPCs(pcs);

    } catch (error) {
      console.error(error);
    }

  }, [products, loading]);

  if (loading) {
    <div className="flex items-center justify-center">
      <Spin />
    </div>
  }

  return (
    <div className="container mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col  gap-6">
        {/* Banner sticky bên trái */}
        {/* <div className="hidden lg:block w-[160px] flex-shrink-0">
          <a href="#" className="block sticky top-20">
            <img
              src={stickyBanners[0]}
              alt="Sticky Banner Left"
              className="w-[160px] object-cover rounded-lg shadow-lg"
            />
          </a>
        </div> */}

        <div className="main-content">
          <div className=" rounded-lg shadow-lg bg-white py-12 px-8">
            {/* Phần chính: Carousel và banner bên phải */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
              {/* Carousel */}
              <div className="lg:col-span-3">
                <Carousel
                  autoplay
                  duration={1}
                  effect="fade"
                  className="rounded-lg overflow-hidden "
                >
                  {carouselImages.map((image, index) => (
                    <NavLink key={index} to={(image.navigation)}>
                      <img
                        src={image.src}
                        alt={`Carousel ${index + 1}`}
                        className="w-full object-cover p-2 rounded-2xl "
                      />
                    </NavLink>
                  ))}
                </Carousel>
              </div>

              {/* Banner bên phải */}
              <div className="lg:col-span-1 flex flex-col justify-between gap-3.5">
                {rightBanners.map((banner, index) => (
                  <NavLink
                    key={index}
                    to={banner.navigation}
                    className="block rounded-lg overflow-hidden transition-shadow duration-200"
                  >
                    <img
                      src={banner.src}
                      alt={`Right Banner ${index + 1}`}
                      className=" object-cover"
                    />
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Banner dưới carousel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {bottomBanners.map((banner, index) => (
                <NavLink
                  key={index}
                  to={banner.navigation}
                  className="block rounded-lg overflow-hidden transition-shadow duration-200"
                >
                  <img
                    src={banner.src}
                    alt={`Bottom Banner ${index + 1}`}
                    className="object-cover"
                  />
                </NavLink>
              ))}
            </div>
          </div>

          <section className="mt-6  rounded-lg shadow-lg bg-white py-12 px-8">
            <div className="container mx-auto px-4">
              <div className="text-2xl md:text-3xl font-bold text-center mb-8">Thương hiệu nổi bật</div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {brands.map((brand, index) => (
                  <NavLink
                    key={index}
                    to={`products/category/${brand.slug}`}
                    className={`${categoryColor[index % 6]} rounded-xl p-6 text-center transition-transform hover:scale-105 hover:shadow-md`}
                  >
                    <div className="flex justify-center mb-4">
                      {brand.icon}
                    </div>
                    <h3 className="font-medium">{brand.name}</h3>
                  </NavLink>
                ))}
              </div>
            </div>
          </section>

          {/* Banners */}
          <section className="mt-6 rounded-lg shadow-lg bg-white py-12 px-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0 text-white">
                      <h3 className="text-2xl font-bold mb-2">Laptop Gaming</h3>
                      <p className="mb-4">Trải nghiệm chơi game đỉnh cao với laptop gaming mới nhất</p>
                      <div className="mt-10">
                        <NavLink to={"products/category/laptop-gaming"} className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors">
                          Khám phá ngay
                        </NavLink>
                      </div>
                    </div>
                    <div className="w-full h-full md:w-1/2">
                      <img src={laptopgaming} alt="Laptop Gaming" className="w-[306px] h-[306px]" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0 text-white">
                      <h3 className="text-2xl font-bold mb-2">Chuột Gaming</h3>
                      <p className="mb-4">Tối ưu phản xạ và độ chính xác trong từng pha hành động với chuột gaming hiệu suất cao</p>
                      <div className="mt-10">
                        <NavLink to={"products/category/chuot-lot-chuot"} className=" bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium transition-colors">
                          Tìm hiểu thêm
                        </NavLink>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <img src={chuotgaming} alt="Smart Home" className="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg shadow-lg bg-white py-10 px-8 mt-6">
            <div className="container mx-auto px-4">
              <div className="text-2xl md:text-3xl font-bold text-center mb-8">Danh Mục Sản Phẩm</div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((category, index) => (
                  <NavLink
                    key={index}
                    to={`products/category/${category.slug}`}
                    className={`${categoryColor[index % 6]} rounded-xl p-6 text-center transition-transform hover:scale-105 hover:shadow-md`}
                  >
                    <div className="flex justify-center mb-4">
                      {category.icon}
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </NavLink>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-6  rounded-lg shadow-lg bg-white py-12 px-8">
            <div className="text-2xl font-bold ml-3">Laptop Nổi Bật</div>
            <Carousel
              slidesToShow={4}
              slidesToScroll={1}
              arrows
              autoplay
              className="p-6"
            >
              {laptops.length > 0 ? (
                laptops.map((laptop) => (
                  <div key={laptop.id}>
                    <ProductCard product={laptop} />
                  </div>
                ))
              ) : (
                <div>Không có laptop nào để hiển thị</div>
              )}
            </Carousel>
          </div>

          <div className="mt-6 rounded-lg shadow-lg bg-white py-12 px-8">
            <div className="text-2xl font-bold ml-3">PC Nổi Bật</div>
            <Carousel
              slidesToShow={4}
              slidesToScroll={1}
              arrows
              autoplay
              className="p-6"
            >
              {pcs.length > 0 ? (
                pcs.map((pc) => (
                  <div key={pc.id}>
                    <ProductCard product={pc} />
                  </div>
                ))
              ) : (
                <div>Không có PC nào để hiển thị</div>
              )}
            </Carousel>
          </div>



          {/* <div className="mt-6  rounded-lg shadow-lg bg-white py-12 px-8">
            <div className="text-2xl font-bold ml-3">Sản phẩm khác</div>
            <Carousel
              slidesToShow={4}
              slidesToScroll={1}
              arrows
              autoplay
              className="p-6"
            >
              {others.length > 0 ? (
                others.map((p) => (
                  <div key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div>Không có sản phẩm nào để hiển thị</div>
              )}
            </Carousel>
          </div> */}


          {/* Features */}
          <section className="mt-6  rounded-lg shadow-lg bg-white py-12 px-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start p-4 py-12 border-r-2 border-gray-200 ">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Sản phẩm chính hãng</h3>
                    <p className="text-gray-600">Cam kết hàng chính hãng 100% với đầy đủ giấy tờ, hóa đơn</p>
                  </div>
                </div>

                <div className="flex items-start p-4 py-12 border-r-2 border-gray-200">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Giao hàng nhanh chóng</h3>
                    <p className="text-gray-600">Giao hàng nhanh trong vòng 2 giờ tại Hà Nội và TP.HCM</p>
                  </div>
                </div>

                <div className="flex items-start p-4 py-12 border-r-2 border-gray-200">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Bảo hành dài hạn</h3>
                    <p className="text-gray-600">Chính sách bảo hành lên đến 24 tháng cho các sản phẩm</p>
                  </div>
                </div>

                <div className="flex items-start p-4 py-12">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Thanh toán an toàn</h3>
                    <p className="text-gray-600">Hỗ trợ nhiều phương thức thanh toán an toàn, bảo mật</p>
                  </div>
                </div>
              </div>
            </div>
          </section>


        </div>

        {/* Banner sticky bên phải */}
        {/* <div className="hidden lg:block w-[160px] flex-shrink-0">
          <a href="#" className="block sticky top-20">
            <img
              src={stickyBanners[1]}
              alt="Sticky Banner Right"
              className="w-[160px] object-cover rounded-lg shadow-lg"
            />
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
