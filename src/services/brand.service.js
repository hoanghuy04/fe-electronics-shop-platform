import dayjs from "dayjs";
import { orderService } from "./order.service";
import { productService } from "./product.service";
import { get, post, put } from "./request";

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
      const products = await productService.getProducts();
      const countMap = {};

      for (const product of products) {
        const brandId = product.brand_id;
        if (brandId) {
          countMap[brandId] = (countMap[brandId] || 0) + 1;
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
      const products = await productService.getProducts();
      const salesMap = {};

      for (const product of products) {
        const brandId = product.brand_id;
        const sales = product.total_sales || 0;

        if (brandId) {
          salesMap[brandId] = (salesMap[brandId] || 0) + sales;
        }
      }

      return salesMap;
    } catch (error) {
      console.error("Lỗi khi tính tổng số lượng bán theo thương hiệu:", error);
      return {};
    }
  },

  getAveragePriceByBrand: async (brandId) => {
    try {
      const products = await productService.getProductsByBrandId(brandId);
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

  getRevenueByBrand: async (brandId) => {
    const revenueMap = await orderService.getRevenueGroupedByBrand();
    return revenueMap[brandId] || 0;
  },

  getDailyRevenueStats: async () => {
    try {
      const orders = await get("orders");
      const now = new Date();
      const today = now.getDate();
      const yesterday = today - 1;
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      let current = 0;
      let previous = 0;

      for (const order of orders) {
        const d = new Date(order.order_date);
        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();
        const revenue = order.products.reduce(
          (sum, p) => sum + p.price * p.quantity * (1 - p.discount),
          0
        );

        if (day === today && month === thisMonth && year === thisYear)
          current += revenue;
        else if (day === yesterday && month === thisMonth && year === thisYear)
          previous += revenue;
      }

      const change =
        previous === 0 ? 100 : ((current - previous) / previous) * 100;

      return {
        value: Math.round(current),
        change: Number(change.toFixed(2)),
      };
    } catch (err) {
      console.error("Lỗi tính doanh thu ngày:", err);
      return { value: 0, change: 0 };
    }
  },

  getDailyUnitsSoldStats: async () => {
    try {
      const orders = await get("orders");
      const now = new Date();
      const today = now.getDate();
      const yesterday = today - 1;
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      let current = 0;
      let previous = 0;

      for (const order of orders) {
        const d = new Date(order.order_date);
        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();
        const quantity = order.products.reduce((sum, p) => sum + p.quantity, 0);

        if (day === today && month === thisMonth && year === thisYear)
          current += quantity;
        else if (day === yesterday && month === thisMonth && year === thisYear)
          previous += quantity;
      }

      const change =
        previous === 0 ? 100 : ((current - previous) / previous) * 100;

      return {
        value: current,
        change: Number(change.toFixed(2)),
      };
    } catch (err) {
      console.error("Lỗi tính số lượng bán trong ngày:", err);
      return { value: 0, change: 0 };
    }
  },

  getDailyNewBrandsStats: async () => {
    try {
      const brands = await get("brands");
      const now = new Date();
      const today = now.getDate();
      const yesterday = today - 1;
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      let current = 0;
      let previous = 0;

      for (const brand of brands) {
        const d = new Date(brand.created_date);
        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();

        if (day === today && month === thisMonth && year === thisYear)
          current++;
        else if (day === yesterday && month === thisMonth && year === thisYear)
          previous++;
      }

      const change =
        previous === 0 ? 100 : ((current - previous) / previous) * 100;

      return {
        value: current,
        change: Number(change.toFixed(2)),
      };
    } catch (err) {
      console.error("Lỗi tính brand mới theo ngày:", err);
      return { value: 0, change: 0 };
    }
  },

  getOverviewStatsByFilter: async (filterType, date) => {
    try {
      const orders = await get("orders");
      const brands = await get("brands");
      const target = dayjs(date);

      let rev = 0,
        sold = 0,
        newB = 0;

      for (const order of orders) {
        const d = dayjs(order.order_date);
        const isMatch =
          (filterType === "day" && d.isSame(target, "day")) ||
          (filterType === "month" && d.isSame(target, "month")) ||
          (filterType === "year" && d.isSame(target, "year"));

        if (isMatch) {
          rev += order.products.reduce(
            (sum, p) => sum + p.price * p.quantity * (1 - p.discount),
            0
          );
          sold += order.products.reduce((sum, p) => sum + p.quantity, 0);
        }
      }

      for (const brand of brands) {
        const d = dayjs(brand.created_date);
        if (
          (filterType === "day" && d.isSame(target, "day")) ||
          (filterType === "month" && d.isSame(target, "month")) ||
          (filterType === "year" && d.isSame(target, "year"))
        ) {
          newB++;
        }
      }

      return {
        revenue: rev,
        totalSold: sold,
        newBrands: newB,
      };
    } catch (err) {
      console.error("Lỗi thống kê tổng quan:", err);
      return {
        revenue: 0,
        totalSold: 0,
        newBrands: 0,
      };
    }
  },
};
