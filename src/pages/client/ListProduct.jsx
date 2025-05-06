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
  Breadcrumb,
} from "antd";
import ProductCard from "../../components/ProductCard";
import { ProductContext } from "../../hooks/ProductContext";
import { Info } from "lucide-react";
import { FilterOutlined, DownOutlined } from "@ant-design/icons";
import { productService } from './../../services/product.service';
import { normalizeCPU, normalizeGPU, normalizeSSD } from './../../utils/productUtils';

const initItemsBreadcum = [
  {
    title: <a href="/">Trang chủ</a>,
  },
];

const ListProduct = () => {
  const { categorySlug, brandSlug } = useParams();
  const { brands, categories, products, loading } = useContext(ProductContext);
  const { state } = useLocation();

  // State declarations
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);
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
  const [itemsBreadcum, setItemsBreadcum] = useState(initItemsBreadcum);

  // Constants
  const itemsPerPage = 10;
  const searchResults = state?.searchResults || [];

  // Initial data fetch and setup
  useEffect(() => {

    console.log(brandSlug);
    

    // Set breadcrumb items based on categorySlug
    const category = categories.find((c) => c.slug === categorySlug);
    const breadcrumbItems = [...initItemsBreadcum];
    if (category) {
      breadcrumbItems.push({
        title: category.name,
      });
      setItemsBreadcum(breadcrumbItems);
    }
    else {
      breadcrumbItems.push({
        title: "Tất cả sản phẩm",
      });
      setItemsBreadcum(breadcrumbItems);
    }

    const fetchData = async () => {
      if (products?.length) {
        const prices = products.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setMinMaxPrice([minPrice, maxPrice]);

        const isAllCategory = categorySlug === "all";
        let initialFilteredProducts = products;
        let category = null;
        let brand = null;
        
        brand = brands.find((b) => b.name == brandSlug) || null;
        console.log(brand);
        

        if (brand) {
          setSelectedBrands([brand.name]);
          initialFilteredProducts = initialFilteredProducts.filter(
            (p) => p.brand === brand.name
          );
        }

        if (!isAllCategory && categories?.length) {
          category = categories.find((c) => c.slug === categorySlug) || null;
          setSelectedCategory(category);

          if (category) {
            initialFilteredProducts = initialFilteredProducts.filter(
              (p) => p.category_id.toString() === category.id
            );
          }
        }

        setFilteredProducts(initialFilteredProducts);

        const descFilters = {};
        initialFilteredProducts.forEach((product) => {
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
        const brands = await productService.getListOfBrands();
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
          : await productService.searchProductsByFilters(filters);


      // Apply sorting if selected
      if (sortOption) {
        results = [...results].sort((a, b) => {
          switch (sortOption) {
            case "noi-bat":
              return (b.popularity || b.id) - (a.popularity || a.id);
            case "moi-nhat":
              return (b.created_at || b.id) - (a.created_at || a.id);
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
      ...Object.keys(descriptionFilters).slice(0, 9).map((key) => ({
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
      <div className="text-sm text-gray-500 mb-4">
        <Breadcrumb items={itemsBreadcum} />
      </div>
      <div className="bg-white mx-auto p-4 rounded-lg">
        {/* Product List */}
        <div className="flex flex-col w-full p-4 pt-0" >
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