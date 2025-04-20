import { get, post } from "./request";

export const saveViewedProduct = (product) => {
  const viewedProducts = JSON.parse(localStorage.getItem("viewedProducts")) || [];
  
  // Kiểm tra nếu sản phẩm đã tồn tại thì không thêm lại
  const isProductExist = viewedProducts.some((p) => p.id === product.id);
  if (!isProductExist) {
    viewedProducts.push(product);
    localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
  }
};

export const getViewedProducts = () => {
  return JSON.parse(localStorage.getItem("viewedProducts")) || [];
};

export const getProducts = async () => {
  try {
    const products = await get("products");

    if (!products || !Array.isArray(products)) {
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    }

    return products;
  } catch (error) {
    console.error(error);
  }
};

export const searchProductsByTitle = async (keyword) => {
  try {
    const products = await get("products");

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

export const searchProductsBySlug = async (slug) => {
  try {
    const products = await get(`products?slug=${slug}`);

    if (!products || !Array.isArray(products)) {
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    } else return products;
  } catch (error) {
    console.error(error);
  }
};

export const getListOfCategories = async () => {
  try {
    const categories = await get(`categories`);

    if (!categories || !Array.isArray(categories)) {
      throw new Error("Dữ liệu danh mục không hợp lệ");
    } else return categories;
  } catch (error) {
    console.error(error);
  }
};

export const getListOfBrands = async () => {
  try {
    const categories = await get(`brands`);

    if (!categories || !Array.isArray(categories)) {
      throw new Error("Dữ liệu hãng không hợp lệ");
    } else return categories;
  } catch (error) {
    console.error(error);
  }
};


