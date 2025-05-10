import { toast } from "sonner";
import { get, post, put } from "./request";
import { productService } from "./product.service";
import dayjs from "dayjs";

export const categoryService = {
  addCategory: async (data) => {
    try {
      const response = await post("categories", data);
      if (!response) {
        throw new Error("Failed to add category");
      }
      return response;
    } catch (error) {
      toast.error("Lỗi khi thêm danh mục:", error);
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await put(`categories/${id}`, data);
      if (!response) {
        throw new Error("Failed to update category");
      }
      return response;
    } catch (error) {
      toast.error("Lỗi khi cập nhật danh mục:", error);
      throw error;
    }
  },

  getListOfCategories: async () => {
    try {
      const categories = await get("categories");
      if (!Array.isArray(categories)) {
        throw new Error("Dữ liệu danh mục không hợp lệ");
      }
      return categories;
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách danh mục:", error);
      return [];
    }
  },

  countProductsPerCategory: async () => {
    try {
      const products = await productService.getProducts();
      const countMap = {};
      products.forEach((product) => {
        const categoryId = product.category_id;
        countMap[categoryId] = (countMap[categoryId] || 0) + 1;
      });
      return countMap;
    } catch (error) {
      toast.error("Lỗi khi đếm sản phẩm theo danh mục:", error);
      return {};
    }
  },

  sumTotalSalesPerCategory: async () => {
    try {
      const products = await productService.getProducts();
      const salesMap = {};
      products.forEach((product) => {
        const categoryId = product.category_id;
        const sales = product.total_sales || 0;
        salesMap[categoryId] = (salesMap[categoryId] || 0) + sales;
      });
      return salesMap;
    } catch (error) {
      toast.error("Lỗi khi tính tổng doanh số theo danh mục:", error);
      return {};
    }
  },

  getAveragePriceByCategory: async (categoryId) => {
    try {
      const products = await productService.getProducts();
      const categoryProducts = products.filter((p) => p.category_id === categoryId);
      if (categoryProducts.length === 0) return 0;
      const totalPrice = categoryProducts.reduce((sum, p) => sum + (p.price || 0), 0);
      return Number((totalPrice / categoryProducts.length).toFixed(2));
    } catch (error) {
      toast.error("Lỗi khi tính giá trung bình theo danh mục:", error);
      return 0;
    }
  },

  getOverviewStatsByFilter: async (type, date) => {
    try {
      const products = await productService.getProducts();
      const categories = await get("categories");
      const orders = await get("orders");

      const format = {
        day: "YYYY-MM-DD",
        month: "YYYY-MM",
        year: "YYYY",
      }[type];

      const currentKey = dayjs(date).format(format);

      let revenue = 0;
      let totalSold = 0;
      let newCategories = 0;

      // Calculate revenue and total sold
      for (const order of orders) {
        const orderKey = dayjs(order.order_date).format(format);
        if (orderKey !== currentKey) continue;

        for (const product of order.products) {
          const fullProduct = await productService.getProductById(product.id);
          if (!fullProduct) continue;

          const categoryId = fullProduct.category_id;
          if (!categoryId) continue;

          const productRevenue = product.price * product.quantity * (1 - product.discount);
          revenue += productRevenue;
          totalSold += product.quantity;
        }
      }

      // Calculate new categories
      for (const category of categories) {
        const createdKey = dayjs(category.created_date).format(format);
        if (createdKey === currentKey) {
          newCategories += 1;
        }
      }

      return {
        revenue: Number(revenue.toFixed(2)),
        totalSold,
        newCategories,
      };
    } catch (error) {
      toast.error("Lỗi khi lấy thống kê tổng quan:", error);
      return { revenue: 0, totalSold: 0, newCategories: 0 };
    }
  },
};