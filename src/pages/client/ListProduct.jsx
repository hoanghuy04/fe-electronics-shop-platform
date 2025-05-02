import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Slider, Checkbox, Pagination, Spin } from "antd";
import { getListOfBrands, getProducts } from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import { ProductContext } from "../../hooks/ProductContext";
import { Info } from "lucide-react";

const normalizeGPU = (gpuName) => {
  return gpuName
    .replace(/Integrated\s*/i, "")
    .replace(/NVIDIA\s*/gi, "")
    .replace(/Intel\s*/gi, "")
    .replace(/GeForce\s*/gi, "")
    .replace(/®|™/g, "")
    .replace(/Graphics/i, "Graphics") // giữ lại từ "Graphics"
    .trim();
};

const ListProduct = () => {
  const { categorySlug } = useParams();

  const { categories, products, loading } = useContext(ProductContext);
  const [brandOptions, setBrandOptions] = useState([]);
  const [gpuOptions, setGpuOptions] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 3000000000]);
  const [minMaxPrice, setMinMaxPrice] = useState([0, 0]);
  const [selectedCPUs, setSelectedCPUs] = useState([]);
  const [selectedRAMs, setSelectedRAMs] = useState([]);
  const [selectedGPUs, setSelectedGPUs] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const cpuOptions = [
    "Intel® Core™ i5",
    "Intel® Core™ i7",
    "Intel® Core™ i9",
    "Intel® Core™ Ultra 7",
  ];
  const ramOptions = ["8GB", "16GB", "32GB"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchproducts = async () => {
      if (products) {
        const prices = products.map((product) => product.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setMinMaxPrice([minPrice, maxPrice]);

        const gpus = products
          .map((p) => p.description["Card đồ họa"])
          .filter(Boolean) // loại bỏ undefined/null
          .map(normalizeGPU) // chuẩn hóa chuỗi
          .filter((value, index, self) => self.indexOf(value) === index) // loại trùng
          .sort();

        setGpuOptions(gpus);
      }

      const responseBrands = await getListOfBrands();
      if (Array.isArray(responseBrands)) {
        const brandsName = responseBrands.map((brand) => brand.name);
        setBrandOptions(brandsName);
      }
    };
    fetchproducts();
  }, [products, loading]);

  useEffect(() => {
    const matchedCategory = categories.find((c) => c.slug === categorySlug);
    const matchedCategoryId = matchedCategory?.id;

    let filtered = products.filter((product) => {
      const matchCategory =
        categorySlug && categorySlug !== "all"
          ? product.category_id == matchedCategoryId
          : true;
      const matchPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchCPU =
        selectedCPUs.length === 0 ||
        (product.description?.CPU &&
          selectedCPUs.some((cpu) => product.description.CPU.includes(cpu)));
      const matchRAM =
        selectedRAMs.length === 0 ||
        (product.description?.RAM &&
          selectedRAMs.some((ram) => product.description.RAM.includes(ram)));
      const matchGPU =
        selectedGPUs.length === 0 ||
        (product.description?.["Card đồ họa"] &&
          selectedGPUs.some((gpu) =>
            product.description["Card đồ họa"].includes(gpu)
          ));
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
    setCurrentPage(1); // Reset về trang 1 khi bộ lọc thay đổi
  }, [
    categorySlug,
    priceRange,
    selectedCPUs,
    selectedRAMs,
    selectedGPUs,
    selectedBrands,
    products,
    loading,
  ]);

  if (loading) {
    <div className="flex items-center justify-center">
      <Spin />
    </div>;
  }

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

  // Tính toán sản phẩm hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Xử lý khi người dùng chuyển trang
  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
  };

  return (
    <div className="container mx-auto p-4 flex">
      {/* Thanh lọc bên trái */}
      <div className="w-1/4 p-4 h-fit bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>
        <div className="mb-6">
          <h3 className="font-semibold">Khoảng giá</h3>
          <Slider
            range
            min={minMaxPrice[0]}
            max={minMaxPrice[1]}
            step={1000000}
            value={priceRange}
            onChange={onPriceChange}
          />
          <div className="flex justify-between text-sm">
            <span>{priceRange[0].toLocaleString()} VNĐ</span>
            <span>{priceRange[1].toLocaleString()} VNĐ</span>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold">CPU</h3>
          <Checkbox.Group
            options={cpuOptions}
            onChange={onCPUChange}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          />
        </div>
        <div className="mb-6">
          <h3 className="font-semibold">RAM</h3>
          <Checkbox.Group options={ramOptions} onChange={onRAMChange} />
        </div>
        <div className="mb-6">
          <h3 className="font-semibold">Card đồ họa</h3>
          <Checkbox.Group
            options={gpuOptions}
            onChange={onGPUChange}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          />
        </div>
        <div className="mb-6">
          <h3 className="font-semibold">Thương hiệu</h3>
          <Checkbox.Group options={brandOptions} onChange={onBrandChange} />
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="w-3/4 p-4 pt-0">
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* Phân trang */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={filteredProducts.length}
                  onChange={onPageChange}
                  showSizeChanger={false} // Ẩn tùy chọn thay đổi số sản phẩm trên trang
                />
              </div>
            )}
          </>
        ) : (
          <p className="font-bold text-2xl flex flex-col items-center justify-center h-full text-orange-400">
            <Info size={48} className="m-4" strokeWidth={1.75} />
            Hiện không có sản phẩm nào!
          </p>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
