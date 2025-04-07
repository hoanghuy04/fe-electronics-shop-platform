import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Slider, Checkbox, Row, Col } from "antd";
import { getProducts } from "../services/productService";

const ListProduct = () => {
  const { categorySlug } = useParams(); // Lấy categorySlug từ URL
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 30000000]); // Khoảng giá
  const [selectedCPUs, setSelectedCPUs] = useState([]);
  const [selectedRAMs, setSelectedRAMs] = useState([]);
  const [selectedGPUs, setSelectedGPUs] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [productData, setProductData] = useState([]);

  // Danh sách tùy chọn lọc
  const cpuOptions = [
    "Intel® Core™ i5",
    "Intel® Core™ i7",
    "Intel® Core™ Ultra 7",
  ];
  const ramOptions = ["16GB", "32GB"];
  const gpuOptions = [
    "Integrated Intel® Arc™ Graphics",
    "Intel® Iris® Xe Graphics",
    "NVIDIA® GeForce® RTX 3050 Ti",
    "NVIDIA® GeForce® GTX 1660 Super",
  ];
  const brandOptions = ["LENOVO", "ASUS", "MSI", "GVN"];

  useEffect(() => {
    const fetchProductData = async () => {
      const response = await getProducts();

      if (Array.isArray(response)) {
        setProductData(response);
      }
    };

    fetchProductData();
  }, []);

  // Lọc sản phẩm khi thay đổi các bộ lọc
  useEffect(() => {
    let filtered = productData.filter((product) => {
      const matchCategory =
        categorySlug && categorySlug !== "all"
          ? product.slug.includes(categorySlug)
          : true;

      const matchPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchCPU =
        selectedCPUs.length === 0 ||
        selectedCPUs.some((cpu) => product.description.CPU.includes(cpu));

      const matchRAM =
        selectedRAMs.length === 0 ||
        selectedRAMs.some((ram) => product.description.RAM.includes(ram));

      const matchGPU =
        selectedGPUs.length === 0 ||
        selectedGPUs.some((gpu) =>
          product.description["Card đồ họa"].includes(gpu)
        );

      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      return (
        matchCategory &&
        matchPrice &&
        matchCPU &&
        matchRAM &&
        matchGPU &&
        matchBrand
      );
    });
    setFilteredProducts(filtered);
  }, [
    categorySlug,
    priceRange,
    selectedCPUs,
    selectedRAMs,
    selectedGPUs,
    selectedBrands,
    productData,
  ]);

  // Xử lý thay đổi giá
  const onPriceChange = (value) => {
    setPriceRange(value);
  };

  // Xử lý thay đổi checkbox
  const onCPUChange = (checkedValues) => {
    setSelectedCPUs(checkedValues);
  };
  const onRAMChange = (checkedValues) => {
    setSelectedRAMs(checkedValues);
  };
  const onGPUChange = (checkedValues) => {
    setSelectedGPUs(checkedValues);
  };
  const onBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
  };

  return (
    <div className="container mx-auto p-4 flex">
      {/* Thanh lọc bên trái */}
      <div className="w-1/4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>

        {/* Lọc theo giá */}
        <div className="mb-6">
          <h3 className="font-semibold">Khoảng giá</h3>
          <Slider
            range
            min={0}
            max={30000000}
            step={1000000}
            defaultValue={[0, 30000000]}
            onChange={onPriceChange}
            value={priceRange}
          />
          <div className="flex justify-between text-sm">
            <span>{priceRange[0].toLocaleString()} VNĐ</span>
            <span>{priceRange[1].toLocaleString()} VNĐ</span>
          </div>
        </div>

        {/* Lọc theo CPU */}
        <div className="mb-6">
          <h3 className="font-semibold">CPU</h3>
          <Checkbox.Group options={cpuOptions} onChange={onCPUChange} />
        </div>

        {/* Lọc theo RAM */}
        <div className="mb-6">
          <h3 className="font-semibold">RAM</h3>
          <Checkbox.Group options={ramOptions} onChange={onRAMChange} />
        </div>

        {/* Lọc theo GPU */}
        <div className="mb-6">
          <h3 className="font-semibold">Card đồ họa</h3>
          <Checkbox.Group options={gpuOptions} onChange={onGPUChange} />
        </div>

        {/* Lọc theo Brand */}
        <div className="mb-6">
          <h3 className="font-semibold">Thương hiệu</h3>
          <Checkbox.Group options={brandOptions} onChange={onBrandChange} />
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="w-3/4 p-4">
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col span={8} key={product.id}>
              <Card
                hoverable
                cover={<img alt={product.title} src={product.image_url[0]} />}
                className="h-full"
              >
                <Card.Meta
                  title={product.title}
                  description={
                    <>
                      <p className="text-red-500 font-bold">
                        {(
                          product.price *
                          (1 - product.discount)
                        ).toLocaleString()}{" "}
                        VNĐ
                      </p>
                      <p className="line-through text-gray-500">
                        {product.price.toLocaleString()} VNĐ
                      </p>
                      <p>CPU: {product.description.CPU}</p>
                      <p>RAM: {product.description.RAM}</p>
                      <p>GPU: {product.description["Card đồ họa"]}</p>
                      <p>Brand: {product.brand}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ListProduct;
