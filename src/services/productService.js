import { get, post } from "./request";

export const normalizeGPU = (gpuName) => {
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

export const normalizeCPU = (cpuString) => {
  if (!cpuString) return "";
  const match = cpuString.match(/Intel® Core™ (i\d|Ultra \d)/i);
  return match ? `Intel® Core™ ${match[1]}` : cpuString.split(",")[0].trim();
};

export const normalizeSSD = (ssdString) => {
  if (!ssdString) return "";
  const match = ssdString.match(/(\d+(?:GB|TB))\s*(SSD)/i);
  return match ? `${match[1]} ${match[2]}` : ssdString.split(" ")[0].trim();
};

export const saveViewedProduct = (product) => {
  const viewedProducts =
    JSON.parse(localStorage.getItem("viewedProducts")) || [];
  if (!viewedProducts.some((p) => p.id === product.id)) {
    viewedProducts.push(product);
    localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
  }
};

// Get viewed products from localStorage
export const getViewedProducts = () =>
  JSON.parse(localStorage.getItem("viewedProducts")) || [];

// Fetch all products
export const getProducts = async () => {
  try {
    const products = await get("products");
    if (!Array.isArray(products)) {
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    }
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Search products by title
export const searchProductsByTitle = async (keyword) => {
  try {
    const products = await getProducts();
    if (!keyword?.trim()) return products;
    return products.filter((p) =>
      p.title.toLowerCase().includes(keyword.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching products by title:", error);
    return [];
  }
};

// Search products by slug
export const searchProductsBySlug = async (slug) => {
  try {
    const products = await get(`products?slug=${slug}`);
    if (!Array.isArray(products)) {
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    }
    return products;
  } catch (error) {
    console.error("Error searching products by slug:", error);
    return [];
  }
};

export const searchProductsByFilters = async (filters) => {
  try {
    const { categorySlug, priceRange, brands, descriptionFilters } = filters;
    const products = await getProducts();

    // lấy ra id của danh muc theo categorySlug
    const categories = await getListOfCategories();
    const category = categories.find((cat) => cat.slug === categorySlug);
    const categoryId = category ? category.id : null;
    


    return products.filter((product) => {
      // Lọc theo danh mục
      const matchCategory =
        !categorySlug || categorySlug === "all"
          ? true
          : product.category_id == categoryId;

      // Lọc theo giá
      const matchPrice =
        priceRange?.length === 2
          ? product.price >= priceRange[0] && product.price <= priceRange[1]
          : true;

      // Lọc theo hãng
      const matchBrand =
        brands?.length > 0 ? brands.includes(product.brand) : true;

      // Lọc theo thuộc tính động trong descriptionFilters
      const matchDescription = Object.keys(descriptionFilters || {}).every(
        (key) => {
          const selectedValues = descriptionFilters[key];
          if (!selectedValues?.length) return true; // Không có giá trị được chọn, bỏ qua

          const productValue = product.description?.[key];
          if (!productValue) return false; // Sản phẩm không có thuộc tính này

          // So sánh trực tiếp giá trị gốc với các giá trị được chọn
          return selectedValues.some((value) => productValue === value);
        }
      );

      return matchCategory && matchPrice && matchBrand && matchDescription;
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    return [];
  }
};

// Fetch categories
export const getListOfCategories = async () => {
  try {
    const categories = await get("categories");
    if (!Array.isArray(categories)) {
      throw new Error("Dữ liệu danh mục không hợp lệ");
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch brands
export const getListOfBrands = async () => {
  try {
    const brands = await get("brands");
    if (!Array.isArray(brands)) {
      throw new Error("Dữ liệu hãng không hợp lệ");
    }
    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};
