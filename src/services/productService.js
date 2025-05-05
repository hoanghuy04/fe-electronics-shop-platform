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

// Search products by filters
export const searchProductsByFilters = async (filters) => {
  try {
    const { categorySlug, priceRange, cpus, rams, gpus, brands } = filters;
    const products = await getProducts();

    return products.filter((product) => {
      const matchCategory =
        !categorySlug || categorySlug === "all"
          ? true
          : product.category_id === categorySlug;

      const matchPrice =
        priceRange?.length === 2
          ? product.price >= priceRange[0] && product.price <= priceRange[1]
          : true;

      const matchCPU =
        cpus?.length > 0
          ? product.description?.CPU &&
            cpus.some((cpu) => product.description.CPU.includes(cpu))
          : true;

      const matchRAM =
        rams?.length > 0
          ? product.description?.RAM &&
            rams.some((ram) => product.description.RAM.includes(ram))
          : true;

      const matchGPU =
        gpus?.length > 0
          ? product.description?.["Card đồ họa"] &&
            gpus.some((gpu) =>
              normalizeGPU(product.description["Card đồ họa"]).includes(gpu)
            )
          : true;

      const matchBrand =
        brands?.length > 0 ? brands.includes(product.brand) : true;

      return (
        matchCategory &&
        matchPrice &&
        matchCPU &&
        matchRAM &&
        matchGPU &&
        matchBrand
      );
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
