import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Slider,
  Pagination,
  Spin,
  Button,
  Dropdown,
  Menu,
  Modal,
  Input,
} from "antd";
import {
  getListOfBrands,
  normalizeCPU,
  normalizeGPU,
  normalizeSSD,
  searchProductsByFilters,
} from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import { ProductContext } from "../../hooks/ProductContext";
import { Info } from "lucide-react";
import { FilterOutlined, DownOutlined } from "@ant-design/icons";

const ListProduct = () => {
  const { categorySlug, brandSlug } = useParams();
  const { categories, products, loading } = useContext(ProductContext);
  const { state } = useLocation();

  // State declarations
  const [brandOptions, setBrandOptions] = useState([]);
  const [gpuOptions, setGpuOptions] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minMaxPrice, setMinMaxPrice] = useState([0, 0]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterSection, setFilterSection] = useState("All");
  const [descriptionFilters, setDescriptionFilters] = useState({}); // Dynamic filters based on description

  // Constants
  const itemsPerPage = 10;
  const searchResults = state?.searchResults || [];

  // Initial data fetch and setup
  useEffect(() => {
    const fetchData = async () => {
      if (products?.length) {
        const prices = products.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setMinMaxPrice([minPrice, maxPrice]);
        setFilteredProducts(products);

        const gpus = [
          ...new Set(
            products
              .map((p) => normalizeGPU(p.description?.["Card đồ họa"]))
              .filter(Boolean)
          ),
        ].sort();
        setGpuOptions(gpus);

        // Generate dynamic description filters based on category
        const descFilters = {};
        const isAllCategory = categorySlug === "all";
        let relevantProducts = products;

        if (!isAllCategory && categories?.length) {
          const selectedCategory = categories.find(
            (c) => c.slug === categorySlug
          );
          if (selectedCategory) {
            relevantProducts = products.filter(
              (p) => p.category_id.toString() === selectedCategory.id
            );
          }
        }

        relevantProducts.forEach((product) => {
          if (product.description) {
            Object.keys(product.description).forEach((key) => {
              if (!descFilters[key]) {
                descFilters[key] = new Set();
              }
              descFilters[key].add(product.description[key]);
            });
          }
        });

        // Convert Sets to sorted arrays with selection state
        Object.keys(descFilters).forEach((key) => {
          descFilters[key] = [...descFilters[key]]
            .sort()
            .map((value) => ({ value, selected: false }));
        });
        setDescriptionFilters(descFilters);
      }

      try {
        const brands = await getListOfBrands();
        if (Array.isArray(brands)) {
          const brandNames = brands.map((b) => b.name);
          setBrandOptions(brandNames);

          if (brandSlug && brandNames.includes(brandSlug.toUpperCase())) {
            setSelectedBrands([brandSlug.toUpperCase()]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }

      // Set initial category from categorySlug
      if (categorySlug && categories?.length && categorySlug !== "all") {
        const matchedCategory = categories.find((c) => c.slug === categorySlug);
        if (matchedCategory) {
          setSelectedCategories([matchedCategory.slug]);
        }
      }
    };

    fetchData();
  }, [products, brandSlug, categorySlug, categories]);

  // Handle filter button click
  const handleFilter = async () => {
    try {
      const filters = {
        categorySlug:
          selectedCategories.length > 0 ? selectedCategories[0] : categorySlug,
        priceRange,
        brands: selectedBrands,
        descriptionFilters: Object.keys(descriptionFilters).reduce(
          (acc, key) => {
            acc[key] = descriptionFilters[key]
              .filter((item) => item.selected)
              .map((item) => item.value);
            return acc;
          },
          {}
        ),
      };

      let results =
        searchResults.length > 0
          ? searchResults
          : await searchProductsByFilters(filters);

      // Apply sorting if selected
      if (sortOption) {
        results = [...results].sort((a, b) => {
          switch (sortOption) {
            case "noi-bat":
              return (b.popularity || b.id) - (a.popularity || a.id);
            case "moi-nhat":
              return (b.createdAt || b.id) - (a.createdAt || a.id);
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            default:
              return 0;
          }
        });
      }

      setFilteredProducts(results);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch filtered products:", error);
      setFilteredProducts([]);
    }
  };

  // Filter change handlers
  const onPriceChange = (value) => setPriceRange(value);
  const onBrandChange = (checkedValues) => setSelectedBrands(checkedValues);
  const onCategoryChange = (checkedValues) =>
    setSelectedCategories(checkedValues);

  // Dynamic description filter handler
  const onDescriptionFilterChange = (key, value) => {
    setDescriptionFilters((prev) => ({
      ...prev,
      [key]: prev[key].map((item) =>
        item.value === value ? { ...item, selected: !item.selected } : item
      ),
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange(minMaxPrice);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setDescriptionFilters((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = prev[key].map((item) => ({ ...item, selected: false }));
        return acc;
      }, {})
    );
  };

  // Sort menu
  const sortMenu = (
    <Menu>
      <Menu.Item key="noi-bat">
        <Button
          type={sortOption === "noi-bat" ? "primary" : "default"}
          onClick={() => {
            setSortOption("noi-bat");
            handleFilter();
          }}
          className="w-full text-left"
        >
          Nổi bật
        </Button>
      </Menu.Item>
      <Menu.Item key="moi-nhat">
        <Button
          type={sortOption === "moi-nhat" ? "primary" : "default"}
          onClick={() => {
            setSortOption("moi-nhat");
            handleFilter();
          }}
          className="w-full text-left"
        >
          Mới nhất
        </Button>
      </Menu.Item>
      <Menu.Item key="price-asc">
        <Button
          type={sortOption === "price-asc" ? "primary" : "default"}
          onClick={() => {
            setSortOption("price-asc");
            handleFilter();
          }}
          className="w-full text-left"
        >
          Tăng theo giá
        </Button>
      </Menu.Item>
      <Menu.Item key="price-desc">
        <Button
          type={sortOption === "price-desc" ? "primary" : "default"}
          onClick={() => {
            setSortOption("price-desc");
            handleFilter();
          }}
          className="w-full text-left"
        >
          Giảm theo giá
        </Button>
      </Menu.Item>
    </Menu>
  );

  // Pagination
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

  // Determine filter buttons based on categorySlug
  const isAllCategory = categorySlug === "all";
  const filterButtons = isAllCategory
    ? [
        {
          label: "Bộ lọc",
          section: "All",
          icon: <FilterOutlined />,
        },
        {
          label: "Hãng",
          section: "Hãng",
        },
        {
          label: "Loại",
          section: "Loại",
        },
        {
          label: "Giá",
          section: "Giá",
        },
      ]
    : [
        {
          label: "Bộ lọc",
          section: "All",
          icon: <FilterOutlined />,
        },
        ...Object.keys(descriptionFilters).map((key) => ({
          label: key,
          section: key,
        })),
        {
          label: "Giá",
          section: "Giá",
        },
      ];

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 p-2 mb-4">
        <a href="/" className="text-blue-500 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Trang chủ
        </a>
        <span>/</span>
        <span className="text-gray-600">Tất cả sản phẩm</span>
      </div>
      <div className="bg-white mx-auto p-4">
        {/* Product List */}
        <div className="flex flex-col w-full p-4 pt-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {/* Dynamic Filter Buttons */}
              {filterButtons.map((btn) => (
                <Button
                  key={btn.section}
                  icon={btn.icon}
                  onClick={() => {
                    setFilterSection(btn.section);
                    setShowFilterModal(true);
                  }}
                >
                  {btn.label} {btn.section !== "All" && <DownOutlined />}
                </Button>
              ))}
            </div>
            <div className="flex items-center">
              <span className="mr-2">Xếp theo:</span>
              <Dropdown overlay={sortMenu} trigger={["click"]}>
                <Button>
                  {sortOption === "noi-bat"
                    ? "Nổi bật"
                    : sortOption === "moi-nhat"
                    ? "Mới nhất"
                    : sortOption === "price-asc"
                    ? "Tăng theo giá"
                    : sortOption === "price-desc"
                    ? "Giảm theo giá"
                    : "Sắp xếp"}{" "}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>

          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-0">
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
            <div className="flex flex-col items-center justify-center h-full text-orange-400">
              <Info size={48} className="mb-4" strokeWidth={1.75} />
              <p className="font-bold text-2xl">Hiện không có sản phẩm nào!</p>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        <Modal
          title={filterSection === "All" ? "Bộ lọc" : filterSection}
          open={showFilterModal}
          onCancel={() => setShowFilterModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowFilterModal(false)}>
              Đóng
            </Button>,
            <Button key="reset" onClick={resetFilters}>
              Bỏ chọn
            </Button>,
            <Button
              key="apply"
              type="primary"
              onClick={() => {
                handleFilter();
                setShowFilterModal(false);
              }}
            >
              Xem kết quả
            </Button>,
          ]}
          width={filterSection === "Giá" ? 600 : 1000}
        >
          <div className="py-4">
            {isAllCategory ? (
              <>
                {(filterSection === "Hãng" || filterSection === "All") && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Hãng</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {brandOptions.map((brand) => (
                        <Button
                          key={brand}
                          type={
                            selectedBrands.includes(brand)
                              ? "primary"
                              : "default"
                          }
                          onClick={() => {
                            const newSelectedBrands = selectedBrands.includes(
                              brand
                            )
                              ? selectedBrands.filter((b) => b !== brand)
                              : [...selectedBrands, brand];
                            setSelectedBrands(newSelectedBrands);
                          }}
                        >
                          {brand}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {(filterSection === "Loại" || filterSection === "All") && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Loại</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category.slug}
                          type={
                            selectedCategories.includes(category.slug)
                              ? "primary"
                              : "default"
                          }
                          onClick={() => {
                            const newSelectedCategories =
                              selectedCategories.includes(category.slug)
                                ? selectedCategories.filter(
                                    (c) => c !== category.slug
                                  )
                                : [category.slug];
                            setSelectedCategories(newSelectedCategories);
                          }}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {(filterSection === "All" ||
                  Object.keys(descriptionFilters).includes(filterSection)) && (
                  <>
                    {(filterSection === "All"
                      ? Object.keys(descriptionFilters)
                      : [filterSection]
                    ).map((key) => (
                      <div key={key} className="mb-6">
                        <h3 className="font-semibold mb-2">{key}</h3>
                        <div className="grid grid-cols-4 gap-2">
                          {descriptionFilters[key].map((item) => (
                            <Button
                              key={`${key}-${item.value}`}
                              type={item.selected ? "primary" : "default"}
                              onClick={() =>
                                onDescriptionFilterChange(key, item.value)
                              }
                            >
                              {key === "Card đồ họa"
                                ? normalizeGPU(item.value)
                                : key === "CPU"
                                ? normalizeCPU(item.value)
                                : key === "SSD"
                                ? normalizeSSD(item.value)
                                : item.value}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {(filterSection === "Giá" || filterSection === "All") && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Giá</h3>
                <Slider
                  range
                  min={minMaxPrice[0]}
                  max={minMaxPrice[1]}
                  step={1000000}
                  value={priceRange}
                  onChange={onPriceChange}
                />
                <div className="flex justify-between mt-2">
                  <Input
                    value={priceRange[0].toLocaleString()}
                    onChange={(e) => {
                      const value =
                        Number.parseInt(e.target.value.replace(/,/g, "")) || 0;
                      setPriceRange([value, priceRange[1]]);
                    }}
                    addonAfter="đ"
                    style={{ width: "45%" }}
                  />
                  <Input
                    value={priceRange[1].toLocaleString()}
                    onChange={(e) => {
                      const value =
                        Number.parseInt(e.target.value.replace(/,/g, "")) || 0;
                      setPriceRange([priceRange[0], value]);
                    }}
                    addonAfter="đ"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ListProduct;

// import { useState, useEffect, useContext } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import {
//   Slider,
//   Pagination,
//   Spin,
//   Button,
//   Dropdown,
//   Menu,
//   Modal,
//   Input,
// } from "antd";
// import {
//   getListOfBrands,
//   normalizeGPU,
//   searchProductsByFilters,
// } from "../../services/productService";
// import ProductCard from "../../components/ProductCard";
// import { ProductContext } from "../../hooks/ProductContext";
// import { Info } from "lucide-react";
// import { FilterOutlined, DownOutlined } from "@ant-design/icons";

// const ListProduct = () => {
//   const { categorySlug, brandSlug } = useParams();
//   const { categories, products, loading } = useContext(ProductContext);
//   const { state } = useLocation();

//   // State declarations
//   const [brandOptions, setBrandOptions] = useState([]);
//   const [gpuOptions, setGpuOptions] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState(products);
//   const [priceRange, setPriceRange] = useState([0, 0]);
//   const [minMaxPrice, setMinMaxPrice] = useState([0, 0]);
//   const [selectedCPUs, setSelectedCPUs] = useState([]);
//   const [selectedRAMs, setSelectedRAMs] = useState([]);
//   const [selectedGPUs, setSelectedGPUs] = useState([]);
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOption, setSortOption] = useState("");
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [filterSection, setFilterSection] = useState("All");
//   const [descriptionFilters, setDescriptionFilters] = useState({});
//   const [descriptionOptions, setDescriptionOptions] = useState({});

//   // Constants
//   const cpuOptions = [
//     "Intel® Core™ i5",
//     "Intel® Core™ i7",
//     "Intel® Core™ i9",
//     "Intel® Core™ Ultra 7",
//   ];
//   const ramOptions = ["8GB", "16GB", "32GB"];
//   const itemsPerPage = 10;
//   const searchResults = state?.searchResults || [];

//   // Extract unique description keys and options
//   useEffect(() => {
//     if (products?.length && categorySlug && categorySlug !== "all") {
//       const categoryProducts = products.filter((p) => {
//         const matchedCategory = categories.find(
//           (c) => c.slug === categorySlug
//         );
//         return matchedCategory
//           ? p.category_id === matchedCategory.id
//           : true;
//       });

//       const descKeys = [
//         ...new Set(
//           categoryProducts.flatMap((p) => Object.keys(p.description || {}))
//         ),
//       ];

//       const options = {};
//       descKeys.forEach((key) => {
//         const values = [
//           ...new Set(
//             categoryProducts
//               .map((p) => p.description[key])
//               .filter(Boolean)
//               .map((val) => (key === "Card đồ họa" ? normalizeGPU(val) : val))
//           ),
//         ].sort();
//         options[key] = values;
//       });

//       setDescriptionOptions(options);
//       setDescriptionFilters(
//         Object.fromEntries(descKeys.map((key) => [key, []]))
//       );
//     }
//   }, [products, categorySlug, categories]);

//   // Initial data fetch and setup
//   useEffect(() => {
//     const fetchData = async () => {
//       if (products?.length) {
//         const prices = products.map((p) => p.price);
//         const minPrice = Math.min(...prices);
//         const maxPrice = Math.max(...prices);
//         setPriceRange([minPrice, maxPrice]);
//         setMinMaxPrice([minPrice, maxPrice]);
//         setFilteredProducts(products);

//         const gpus = [
//           ...new Set(
//             products
//               .map((p) => normalizeGPU(p.description?.["Card đồ họa"]))
//               .filter(Boolean)
//           ),
//         ].sort();
//         setGpuOptions(gpus);
//       }

//       try {
//         const brands = await getListOfBrands();
//         if (Array.isArray(brands)) {
//           const brandNames = brands.map((b) => b.name);
//           setBrandOptions(brandNames);

//           if (brandSlug && brandNames.includes(brandSlug.toUpperCase())) {
//             setSelectedBrands([brandSlug.toUpperCase()]);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch brands:", error);
// _dependency_      }

//       if (categorySlug && categories?.length) {
//         const matchedCategory = categories.find((c) => c.slug === categorySlug);
//         if (matchedCategory) {
//           setSelectedCategories([matchedCategory.slug]);
//         }
//       }
//     };

//     fetchData();
//   }, [products, brandSlug, categorySlug, categories]);

//   // Handle filter button click
//   const handleFilter = async () => {
//     try {
//       const filters = {
//         categorySlug:
//           selectedCategories.length > 0 ? selectedCategories[0] : categorySlug,
//         priceRange,
//         cpus: selectedCPUs,
//         rams: selectedRAMs,
//         gpus: selectedGPUs,
//         brands: selectedBrands,
//         ...descriptionFilters,
//       };

//       let results =
//         searchResults.length > 0
//           ? searchResults
//           : await searchProductsByFilters(filters);

//       if (sortOption) {
//         results = [...results].sort((a, b) => {
//           switch (sortOption) {
//             case "noi-bat":
//               return (b.popularity || b.id) - (a.popularity || a.id);
//             case "moi-nhat":
//               return (b.createdAt || b.id) - (a.createdAt || a.id);
//             case "price-asc":
//               return a.price - b.price;
//             case "price-desc":
//               return b.price - b.price;
//             default:
//               return 0;
//           }
//         });
//       }

//       setFilteredProducts(results);
//       setCurrentPage(1);
//     } catch (error) {
//       console.error("Failed to fetch filtered products:", error);
//       setFilteredProducts([]);
//     }
//   };

//   // Filter change handlers
//   const onPriceChange = (value) => setPriceRange(value);
//   const onCPUChange = (checkedValues) => setSelectedCPUs(checkedValues);
//   const onRAMChange = (checkedValues) => setSelectedRAMs(checkedValues);
//   const onGPUChange = (checkedValues) => setSelectedGPUs(checkedValues);
//   const onBrandChange = (checkedValues) => setSelectedBrands(checkedValues);
//   const onCategoryChange = (checkedValues) =>
//     setSelectedCategories(checkedValues);
//   const onDescriptionFilterChange = (key, checkedValues) =>
//     setDescriptionFilters((prev) => ({ ...prev, [key]: checkedValues }));

//   // Reset all filters
//   const resetFilters = () => {
//     setPriceRange(minMaxPrice);
//     setSelectedCPUs([]);
//     setSelectedRAMs([]);
//     setSelectedGPUs([]);
//     setSelectedBrands([]);
//     setSelectedCategories([]);
//     setDescriptionFilters(
//       Object.fromEntries(Object.keys(descriptionFilters).map((key) => [key, []]))
//     );
//   };

//   // Sort menu
//   const sortMenu = (
//     <Menu>
//       <Menu.Item key="noi-bat">
//         <Button
//           type={sortOption === "noi-bat" ? "primary" : "default"}
//           onClick={() => {
//             setSortOption("noi-bat");
//             handleFilter();
//           }}
//           className="w-full text-left"
//         >
//           Nổi bật
//         </Button>
//       </Menu.Item>
//       <Menu.Item key="moi-nhat">
//         <Button
//           type={sortOption === "moi-nhat" ? "primary" : "default"}
//           onClick={() => {
//             setSortOption("moi-nhat");
//             handleFilter();
//           }}
//           className="w-full text-left"
//         >
//           Mới nhất
//         </Button>
//       </Menu.Item>
//       <Menu.Item key="price-asc">
//         <Button
//           type={sortOption === "price-asc" ? "primary" : "default"}
//           onClick={() => {
//             setSortOption("price-asc");
//             handleFilter();
//           }}
//           className="w-full text-left"
//         >
//           Tăng theo giá
//         </Button>
//       </Menu.Item>
//       <Menu.Item key="price-desc">
//         <Button
//           type={sortOption === "price-desc" ? "primary" : "default"}
//           onClick={() => {
//             setSortOption("price-desc");
//             handleFilter();
//           }}
//           className="w-full text-left"
//         >
//           Giảm theo giá
//         </Button>
//       </Menu.Item>
//     </Menu>
//   );

//   // Pagination
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, endIndex);

//   const onPageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spin />
//       </div>
//     );
//   }

//   // Determine filter buttons based on categorySlug
//   const filterButtons =
//     categorySlug === "all"
//       ? [
//           { key: "All", label: "Bộ lọc", icon: <FilterOutlined /> },
//           { key: "Hãng", label: "Hãng" },
//           { key: "Loại", label: "Loại" },
//           { key: "Giá", label: "Giá" },
//         ]
//       : [
//           { key: "All", label: "Bộ lọc", icon: <FilterOutlined /> },
//           ...Object.keys(descriptionOptions).map((key) => ({
//             key,
//             label: key,
//           })),
//         ];

//   return (
//     <div className="container mx-auto p-4">
//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 p-2 mb-4">
//         <a href="/" className="text-blue-500 flex items-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//             />
//           </svg>
//           Trang chủ
//         </a>
//         <span>/</span>
//         <span className="text-gray-600">Tất cả sản phẩm</span>
//       </div>
//       <div className="bg-white mx-auto p-4">
//         {/* Product List */}
//         <div className="flex flex-col w-full p-4 pt-0">
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex gap-2">
//               {filterButtons.map((btn) => (
//                 <Button
//                   key={btn.key}
//                   icon={btn.icon}
//                   onClick={() => {
//                     setFilterSection(btn.key);
//                     setShowFilterModal(true);
//                   }}
//                 >
//                   {btn.label} {btn.key !== "All" && <DownOutlined />}
//                 </Button>
//               ))}
//             </div>
//             <div className="flex items-center">
//               <span className="mr-2">Xếp theo:</span>
//               <Dropdown overlay={sortMenu} trigger={["click"]}>
//                 <Button>
//                   {sortOption === "noi-bat"
//                     ? "Nổi bật"
//                     : sortOption === "moi-nhat"
//                     ? "Mới nhất"
//                     : sortOption === "price-asc"
//                     ? "Tăng theo giá"
//                     : sortOption === "price-desc"
//                     ? "Giảm theo giá"
//                     : "Sắp xếp"}{" "}
//                   <DownOutlined />
//                 </Button>
//               </Dropdown>
//             </div>
//           </div>

//           {currentProducts.length > 0 ? (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
//                 {currentProducts.map((product) => (
//                   <ProductCard key={product.id} product={product} />
//                 ))}
//               </div>
//               {filteredProducts.length > itemsPerPage && (
//                 <div className="mt-6 flex justify-center">
//                   <Pagination
//                     current={currentPage}
//                     pageSize={itemsPerPage}
//                     total={filteredProducts.length}
//                     onChange={onPageChange}
//                     showSizeChanger={false}
//                   />
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full text-orange-400">
//               <Info size={48} className="mb-4" strokeWidth={1.75} />
//               <p className="font-bold text-2xl">Hiện không có sản phẩm nào!</p>
//             </div>
//           )}
//         </div>

//         {/* Filter Modal */}
//         <Modal
//           title={filterSection === "All" ? "Bộ lọc" : filterSection}
//           open={showFilterModal}
//           onCancel={() => setShowFilterModal(false)}
//           footer={[
//             <Button key="cancel" onClick={() => setShowFilterModal(false)}>
//               Đóng
//             </Button>,
//             <Button key="reset" onClick={resetFilters}>
//               Bỏ chọn
//             </Button>,
//             <Button
//               key="apply"
//               type="primary"
//               onClick={() => {
//                 handleFilter();
//                 setShowFilterModal(false);
//               }}
//             >
//               Xem kết quả
//             </Button>,
//           ]}
//           width={filterSection === "Giá" ? 600 : 1000}
//         >
//           <div className="py-4">
//             {(filterSection === "Hãng" || filterSection === "All") && (
//               <div className="mb-6">
//                 <h3 className="font-semibold mb-2">Hãng</h3>
//                 <div className="grid grid-cols-4 gap-2">
//                   {brandOptions.map((brand) => (
//                     <Button
//                       key={brand}
//                       type={
//                         selectedBrands.includes(brand) ? "primary" : "default"
//                       }
//                       onClick={() => {
//                         const newSelectedBrands = selectedBrands.includes(brand)
//                           ? selectedBrands.filter((b) => b !== brand)
//                           : [...selectedBrands, brand];
//                         setSelectedBrands(newSelectedBrands);
//                       }}
//                     >
//                       {brand}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {(filterSection === "Loại" || filterSection === "All") && (
//               <div className="mb-6">
//                 <h3 className="font-semibold mb-2">Loại</h3>
//                 <div className="grid grid-cols-4 gap-2">
//                   {categories.map((category) => (
//                     <Button
//                       key={category.slug}
//                       type={
//                         selectedCategories.includes(category.slug)
//                           ? "primary"
//                           : "default"
//                       }
//                       onClick={() => {
//                         const newSelectedCategories =
//                           selectedCategories.includes(category.slug)
//                             ? selectedCategories.filter(
//                                 (c) => c !== category.slug
//                               )
//                             : [category.slug];
//                         setSelectedCategories(newSelectedCategories);
//                       }}
//                     >
//                       {category.name}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {(filterSection === "Giá" || filterSection === "All") && (
//               <div className="mb-6">
//                 <h3 className="font-semibold mb-2">Giá</h3>
//                 <Slider
//                   range
//                   min={minMaxPrice[0]}
//                   max={minMaxPrice[1]}
//                   step={1000000}
//                   value={priceRange}
//                   onChange={onPriceChange}
//                 />
//                 <div className="flex justify-between mt-2">
//                   <Input
//                     value={priceRange[0].toLocaleString()}
//                     onChange={(e) => {
//                       const value =
//                         Number.parseInt(e.target.value.replace(/,/g, "")) || 0;
//                       setPriceRange([value, priceRange[1]]);
//                     }}
//                     addonAfter="đ"
//                     style={{ width: "45%" }}
//                   />
//                   <Input
//                     value={priceRange[1].toLocaleString()}
//                     onChange={(e) => {
//                       const value =
//                         Number.parseInt(e.target.value.replace(/,/g, "")) || 0;
//                       setPriceRange([priceRange[0], value]);
//                     }}
//                     addonAfter="đ"
//                     style={{ width: "45%" }}
//                   />
//                 </div>
//               </div>
//             )}

//             {filterSection === "All" && categorySlug === "all" && (
//               <>
//                 <div className="mb-6">
//                   <h3 className="font-semibold mb-2">CPU</h3>
//                   <div className="grid grid-cols-4 gap-2">
//                     {cpuOptions.map((cpu) => (
//                       <Button
//                         key={cpu}
//                         type={
//                           selectedCPUs.includes(cpu) ? "primary" : "default"
//                         }
//                         onClick={() => {
//                           const newSelectedCPUs = selectedCPUs.includes(cpu)
//                             ? selectedCPUs.filter((c) => c !== cpu)
//                             : [...selectedCPUs, cpu];
//                           setSelectedCPUs(newSelectedCPUs);
//                         }}
//                       >
//                         {cpu}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <h3 className="font-semibold mb-2">RAM</h3>
//                   <div className="grid grid-cols-4 gap-2">
//                     {ramOptions.map((ram) => (
//                       <Button
//                         key={ram}
//                         type={
//                           selectedRAMs.includes(ram) ? "primary" : "default"
//                         }
//                         onClick={() => {
//                           const newSelectedRAMs = selectedRAMs.includes(ram)
//                             ? selectedRAMs.filter((r) => r !== ram)
//                             : [...selectedRAMs, ram];
//                           setSelectedRAMs(newSelectedRAMs);
//                         }}
//                       >
//                         {ram}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <h3 className="font-semibold mb-2">Card đồ họa</h3>
//                   <div className="grid grid-cols-4 gap-2">
//                     {gpuOptions.map((gpu) => (
//                       <Button
//                         key={gpu}
//                         type={
//                           selectedGPUs.includes(gpu) ? "primary" : "default"
//                         }
//                         onClick={() => {
//                           const newSelectedGPUs = selectedGPUs.includes(gpu)
//                             ? selectedGPUs.filter((g) => g !== gpu)
//                             : [...selectedGPUs, gpu];
//                           setSelectedGPUs(newSelectedGPUs);
//                         }}
//                       >
//                         {gpu}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}

//             {categorySlug !== "all" &&
//               Object.keys(descriptionOptions).includes(filterSection) && (
//                 <div className="mb-6">
//                   <h3 className="font-semibold mb-2">{filterSection}</h3>
//                   <div className="grid grid-cols-4 gap-2">
//                     {descriptionOptions[filterSection].map((option) => (
//                       <Button
//                         key={option}
//                         type={
//                           descriptionFilters[filterSection].includes(option)
//                             ? "primary"
//                             : "default"
//                         }
//                         onClick={() => {
//                           const newSelected = descriptionFilters[
//                             filterSection
//                           ].includes(option)
//                             ? descriptionFilters[filterSection].filter(
//                                 (o) => o !== option
//                               )
//                             : [...descriptionFilters[filterSection], option];
//                           onDescriptionFilterChange(filterSection, newSelected);
//                         }}
//                       >
//                         {option}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//             {filterSection === "All" && categorySlug !== "all" && (
//               <>
//                 {Object.keys(descriptionOptions).map((key) => (
//                   <div key={key} className="mb-6">
//                     <h3 className="font-semibold mb-2">{key}</h3>
//                     <div className="grid grid-cols-4 gap-2">
//                       {descriptionOptions[key].map((option) => (
//                         <Button
//                           key={option}
//                           type={
//                             descriptionFilters[key].includes(option)
//                               ? "primary"
//                               : "default"
//                           }
//                           onClick={() => {
//                             const newSelected = descriptionFilters[key].includes(
//                               option
//                             )
//                               ? descriptionFilters[key].filter(
//                                   (o) => o !== option
//                                 )
//                               : [...descriptionFilters[key], option];
//                             onDescriptionFilterChange(key, newSelected);
//                           }}
//                         >
//                           {option}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default ListProduct;
