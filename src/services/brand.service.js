import { del, get, post, put } from "./request";

export const brandService = {
  getAllBrands: async () => {
    try {
      return await get("brands");
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      return [];
    }
  },

  getBrandBySlug: async (slug) => {
    try {
      const result = await get(`brands?slug=${slug}`);
      return result?.[0] || null;
    } catch (error) {
      console.error("Lỗi khi lấy thương hiệu theo slug:", error);
      return null;
    }
  },

  createBrand: async (brand) => {
    try {
      const existing = await get(`brands?slug=${brand.slug}`);
      if (existing.length > 0) {
        throw new Error("Slug đã tồn tại");
      }

      return await post("brands", {
        name: brand.name,
        slug: brand.slug,
        created_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Lỗi khi tạo thương hiệu:", error);
      throw error;
    }
  },

  updateBrand: async (id, brand) => {
    console.log(id, brand);
    try {
      return await put(`brands/${id}`, {
        name: brand.name,
        slug: brand.slug,
        created_date: brand.created_date,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật thương hiệu:", error);
      throw error;
    }
  },

  countProductsPerBrand: async () => {
    try {
      const products = await get("products");
      const countMap = {};

      for (const product of products) {
        const brandName = product.brand?.toUpperCase();
        if (brandName) {
          countMap[brandName] = (countMap[brandName] || 0) + 1;
        }
      }

      return countMap;
    } catch (error) {
      console.error("Lỗi khi đếm sản phẩm theo thương hiệu:", error);
      return {};
    }
  },

  sumTotalSalesPerBrand: async () => {
    try {
      const products = await get("products");
      const salesMap = {};

      for (const product of products) {
        const brandName = product.brand?.toUpperCase();
        const sales = product.total_sales || 0;

        if (brandName) {
          salesMap[brandName] = (salesMap[brandName] || 0) + sales;
        }
      }

      return salesMap;
    } catch (error) {
      console.error("Lỗi khi tính tổng số lượng bán theo thương hiệu:", error);
      return {};
    }
  },

  getAveragePriceByBrand: async (brandName) => {
    try {
      const products = await get(
        `products?brand=${encodeURIComponent(brandName)}`
      );
      if (!Array.isArray(products) || products.length === 0) return 0;

      const totalPrice = products.reduce(
        (sum, product) => sum + (product.price || 0),
        0
      );
      return Math.round(totalPrice / products.length);
    } catch (error) {
      console.error("Lỗi khi tính giá trung bình:", error);
      return 0;
    }
  },

  getRevenueByBrand: async (brandName) => {
    try {
      const products = await get(
        `products?brand=${encodeURIComponent(brandName)}`
      );
      if (!Array.isArray(products) || products.length === 0) return 0;

      const totalRevenue = products.reduce((sum, product) => {
        const price = product.price || 0;
        const discount = product.discount || 0;
        const quantity = product.total_sales || 0;
        return sum + price * (1 - discount) * quantity;
      }, 0);

      return Math.round(totalRevenue);
    } catch (error) {
      console.error("Lỗi khi tính doanh thu theo thương hiệu:", error);
      return 0;
    }
  },
};
