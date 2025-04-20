import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom"; // Thêm useLocation
import { Slider, Checkbox, Pagination, Spin, Button } from "antd";
import { getListOfBrands, getProducts } from "../services/productService";
import ProductCard from "./../components/ProductCard";
import { ProductContext } from "../hooks/ProductContext";
import { Info } from "lucide-react";

const normalizeGPU = (gpuName) => {
  if (!gpuName) return "";
  return gpuName
    .replace(/Integrated\s*/i, "")
    .replace(/NVIDIA\s*/gi, "")
    .replace(/GeForce\s*/gi, "")
    .replace(/Intel\s*/gi, "")
    .replace(/®|™/g, "")
    .replace(/Graphics/i, "Graphics")
    .trim();
};

const ListProduct = () => {
  const { categorySlug, brandSlug } = useParams();
  const { categories, products, loading } = useContext(ProductContext);
  const location = useLocation(); // Thêm useLocation để lấy state

  const [brandOptions, setBrandOptions] = useState([]);
  const [gpuOptions, setGpuOptions] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minMaxPrice, setMinMaxPrice] = useState([0, 0]);
  const [selectedCPUs, setSelectedCPUs] = useState([]);
  const [selectedRAMs, setSelectedRAMs] = useState([]);
  const [selectedGPUs, setSelectedGPUs] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const itemsPerPage = 6;

  const cpuOptions = [
    "Intel® Core™ i5",
    "Intel® Core™ i7",
    "Intel® Core™ i9",
    "Intel® Core™ Ultra 7",
  ];
  const ramOptions = ["8GB", "16GB", "32GB"];

  // Lấy searchResults từ state
  const searchResults = location.state?.searchResults || [];

  // Fetch brands and set initial price range and GPU options
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchData = async () => {
      if (products?.length) {
        const prices = products.map((product) => product.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setMinMaxPrice([minPrice, maxPrice]);

        const gpus = [
          ...new Set(
            products
              .map((p) => normalizeGPU(p.description?.["Card đồ họa"]))
              .filter(Boolean)
          ),
        ].sort();
        setGpuOptions(gpus);
      }

      try {
        const responseBrands = await getListOfBrands();
        if (Array.isArray(responseBrands)) {
          const brands = responseBrands.map((brand) => brand.name);
          setBrandOptions(brands);

          // Pre-select brand checkbox if brandSlug is present
          if (brandSlug && brands.includes(brandSlug.toUpperCase())) {
            setSelectedBrands([brandSlug.toUpperCase()]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };
    fetchData();
  }, [products, brandSlug]);

  // Filter products based on searchResults or other filters
  useEffect(() => {
    let filtered = [];

    // Nếu searchResults có giá trị, sử dụng nó và bỏ qua các bộ lọc khác
    if (searchResults.length > 0) {
      filtered = searchResults;
    } else {
      // Thực hiện lọc như bình thường nếu không có searchResults
      const matchedCategory = categories.find((c) => c.slug === categorySlug);
      const matchedCategoryId = matchedCategory?.id;

      filtered = products.filter((product) => {
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
              normalizeGPU(product.description["Card đồ họa"]).includes(gpu)
            ));
        const matchBrand =
          selectedBrands.length === 0 ||
          selectedBrands.includes(product.brand);

        return (
          matchCategory &&
          matchPrice &&
          matchCPU &&
          matchRAM &&
          matchGPU &&
          matchBrand
        );
      });
    }

    // Apply sorting
    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case "name-asc":
            return a.title.localeCompare(b.title);
          case "name-desc":
            return b.title.localeCompare(a.title);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to page 1 on filter or sort change
  }, [
    categorySlug,
    priceRange,
    selectedCPUs,
    selectedRAMs,
    selectedGPUs,
    selectedBrands,
    products,
    sortOption,
    searchResults, // Thêm searchResults vào dependencies
  ]);

  const onPriceChange = (value) => {
    setPriceRange(value);
  };

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

  const handleSort = (option) => {
    setSortOption(option);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex">
      {/* Filter Sidebar */}
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
            value={selectedCPUs}
            onChange={onCPUChange}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          />
        </div>
        <div className="mb-6">
          <h3 className="font-semibold">RAM</h3>
          <Checkbox.Group
            options={ramOptions}
            value={selectedRAMs}
            onChange={onRAMChange}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          />
        </div>
        <div className="mb-6">
          <h3 className="font-semibold">Card đồ họa</h3>
          <Checkbox.Group
            options={gpuOptions}
            value={selectedGPUs}
            onChange={onGPUChange}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          />
        </div>
        <div className="mb-6">
          <h3 className="font-semibold">Thương hiệu</h3>
          <Checkbox.Group
            options={brandOptions}
            value={selectedBrands}
            onChange={onBrandChange}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          />
        </div>
      </div>

      {/* Product List */}
      <div className="flex flex-col w-3/4 p-4 pt-0">
        <div className="text-2xl font-bold">Tất cả sản phẩm</div>
        <div className="filter-options flex gap-2">
          <Button
            type={sortOption === "name-asc" ? "primary" : "default"}
            onClick={() => handleSort("name-asc")}
          >
            Tên A - Z
          </Button>
          <Button
            type={sortOption === "name-desc" ? "primary" : "default"}
            onClick={() => handleSort("name-desc")}
          >
            Tên Z - A
          </Button>
          <Button
            type={sortOption === "price-asc" ? "primary" : "default"}
            onClick={() => handleSort("price-asc")}
          >
            Giá tăng dần
          </Button>
          <Button
            type={sortOption === "price-desc" ? "primary" : "default"}
            onClick={() => handleSort("price-desc")}
          >
            Giá giảm dần
          </Button>
        </div>

        <div>
          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {filteredProducts.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredProducts.length}
                    onChange={onPageChange}
                    showSizeChanger={false}
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
    </div>
  );
};

export default ListProduct;