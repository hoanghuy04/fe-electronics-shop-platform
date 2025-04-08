import { get } from "./request";

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
