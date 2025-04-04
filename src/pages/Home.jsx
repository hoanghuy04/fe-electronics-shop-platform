import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import productsData from '../database/products.json'
import ProductCard from '../components/ProductCard';
import { searchProductsByTitle } from '../services/productService';

const Home = () => {
  const [laptops, setLaptops] = useState([])
  const [pcs, setPCs] = useState([])
  const [others, setOthers] = useState([])
  // Dữ liệu giả lập cho carousel và banner
  const carouselImages = [
    'https://file.hstatic.net/200000722513/file/thang_02_pc_gvn_banner_web_slider_800x400.jpg',
    'https://file.hstatic.net/200000722513/file/thang_04_laptop_gaming_banner_web_slider_800x400.jpg',
    'https://file.hstatic.net/200000722513/file/thang_03_laptop_rtx_5090_800x400.jpg',
    'https://file.hstatic.net/200000722513/file/thang_04_laptop_acer.png',
    'https://file.hstatic.net/200000722513/file/thang_12_laptop_acer_swift_800x400.png',
  ];

  const rightBanners = [
    'https://file.hstatic.net/200000722513/file/thang_02_layout_web_-01.png',
    'https://file.hstatic.net/200000722513/file/thang_02_layout_web_-02.png',
    'https://file.hstatic.net/200000722513/file/thang_02_layout_web_-03.png',
  ];

  const bottomBanners = [
    'https://file.hstatic.net/200000722513/file/thang_02_layout_web_-09_acdc7c6d37584f0eb1ce8d35ba45507e.png',
    'https://file.hstatic.net/200000722513/file/thang_02_layout_web_-08.png',
    'https://file.hstatic.net/200000722513/file/thang_02_layout_web_-07.png',
    'https://file.hstatic.net/200000722513/file/thang_02_layout_web_-06.png',
  ];

  const stickyBanners = [
    'https://file.hstatic.net/200000722513/file/thang_02_pc_gvn_banner_side_web.jpg', // Banner bên trái
    'https://file.hstatic.net/200000722513/file/thang_03_laptop_rtx_5090_sticky_230x697.jpg', // Banner bên phải
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await searchProductsByTitle('laptop');
        setLaptops(products)

        const pcs = await searchProductsByTitle('pc');
        setPCs(pcs)

        const others = await searchProductsByTitle('adobe');
        setOthers(others)
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

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
          <div className=" rounded-lg shadow-lg bg-white py-4  px-8">
            {/* Phần chính: Carousel và banner bên phải */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
              {/* Carousel */}
              <div className="lg:col-span-3">
                <Carousel autoplay duration={1} effect="fade" className="rounded-lg overflow-hidden ">
                  {carouselImages.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={`Carousel ${index + 1}`}
                        className="w-full object-cover p-2 rounded-2xl "
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Banner bên phải */}
              <div className="lg:col-span-1 flex flex-col justify-between gap-3.5">
                {rightBanners.map((banner, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block rounded-lg overflow-hidden transition-shadow duration-200"
                  >
                    <img
                      src={banner}
                      alt={`Right Banner ${index + 1}`}
                      className=" object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Banner dưới carousel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {bottomBanners.map((banner, index) => (
                <a
                  key={index}
                  href="#"
                  className="block rounded-lg overflow-hidden transition-shadow duration-200"
                >
                  <img
                    src={banner}
                    alt={`Bottom Banner ${index + 1}`}
                    className="object-cover"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10  rounded-lg shadow-lg bg-white py-4  px-8">
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
                  <div key={laptop._id.$oid}>
                    <ProductCard product={laptop} />
                  </div>
                ))
              ) : (
                <div>Không có laptop nào để hiển thị</div>
              )}
            </Carousel>
          </div>

          <div className="mt-10  rounded-lg shadow-lg bg-white py-4  px-8">
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
                  <div key={pc._id.$oid}>
                    <ProductCard product={pc} />
                  </div>
                ))
              ) : (
                <div>Không có PC nào để hiển thị</div>
              )}
            </Carousel>
          </div>

          <div className="mt-10  rounded-lg shadow-lg bg-white py-4  px-8">
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
                  <div key={p._id.$oid}>
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div>Không có sản phẩm nào để hiển thị</div>
              )}
            </Carousel>
          </div>
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