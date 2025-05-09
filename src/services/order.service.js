import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

import { addressService } from "./address.service";
import { productService } from "./product.service";
import { get, post, put } from "./request";

export const orderService = {
  createOrder: async (order) => {
    try {
      const response = await post("orders", order);

      for (const item of order.products) {
        const productId = item.id;
        const quantity = item.quantity;

        const product = await productService.getProductById(productId);

        if (product.stock >= quantity) {
          const updatedProduct = {
            ...product,
            stock: product.stock - quantity,
            total_sales: product.total_sales + quantity,
          };

          await productService.updateProduct(productId, updatedProduct);
        } else {
          console.error(`Sản phẩm "${item.title}" không đủ hàng trong kho.`);
        }
      }

      return response;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      return null;
    }
  },

  updateOrder: async (order, updatedFields) => {
    const now = new Date().toISOString();
    const updatedStatus = updatedFields.status || "PENDING";

    const newStatusHistory = {
      status: updatedStatus,
      updated_at: now,
      note: updatedFields.note || orderService.getDefaultNote(updatedStatus),
    };

    const isDelivered = updatedStatus === "DELIVERED";

    try {
      const updatedOrder = {
        ...order,
        ...updatedFields,
        payment_status: isDelivered ? "PAID" : order.payment_status,
        status: {
          current: updatedStatus,
          history: [...(order.status?.history || []), newStatusHistory],
        },
      };

      return await put(`orders/${order.id}`, updatedOrder);
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      throw error;
    }
  },

  getDefaultNote: (status) => {
    switch (status) {
      case "PENDING":
        return "Đơn hàng mới được tạo";
      case "CONFIRMED":
        return "Đơn hàng đang được xử lý";
      case "SHIPPED":
        return "Đơn hàng đang vận chuyển";
      case "DELIVERED":
        return "Đơn hàng đã hoàn thành";
      case "CANCELLED":
        return "Đơn hàng đã bị huỷ";
      default:
        return "Cập nhật trạng thái đơn hàng";
    }
  },

  getUserOrders: async (userId, page = 1, limit = 5) => {
    try {
      const response = await get(
        `orders?customer_id=${userId}&_page=${page}&_limit=${limit}&_sort=order_date&_order=desc`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      return [];
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await get(`orders/${id}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng theo ID:", error);
      return null;
    }
  },

  getLatestOrderByUserId: async (userId) => {
    try {
      const response = await get(`orders?customer_id=${userId}`);
      const sorted = response.sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
      );
      return sorted.length > 0 ? sorted[0] : null;
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng mới nhất:", error);
      return null;
    }
  },
  getOrdersByStatus: async (userId, status, page = 1, limit = 5) => {
    try {
      const allOrders = await get(`orders?customer_id=${userId}`);

      const filtered =
        status === "ALL"
          ? allOrders
          : allOrders.filter((o) => o.status?.current === status);

      const sorted = filtered.sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
      );

      const total = sorted.length;
      const start = (page - 1) * limit;
      const paginated = sorted.slice(start, start + limit);

      return { data: paginated, total };
    } catch (error) {
      console.error("Lỗi khi lọc đơn hàng:", error);
      return { data: [], total: 0 };
    }
  },

  getRevenueGroupedByBrand: async () => {
    try {
      const orders = await get("orders");
      if (!Array.isArray(orders) || orders.length === 0) return {};

      const revenueMap = {};

      for (const order of orders) {
        for (const product of order.products) {
          const fullProduct = await productService.getProductById(product.id);
          const brandId = fullProduct?.brand_id;

          if (!brandId) continue;

          const revenue =
            product.price * product.quantity * (1 - product.discount);

          if (revenueMap[brandId]) {
            revenueMap[brandId] += revenue;
          } else {
            revenueMap[brandId] = revenue;
          }
        }
      }

      return revenueMap;
    } catch (error) {
      console.error("Lỗi khi tính doanh thu tất cả brands:", error);
      return {};
    }
  },

  getOrdersPaginated: async (page = 1, limit = 5) => {
    try {
      const allOrders = await get("orders");

      if (!Array.isArray(allOrders)) throw new Error("Invalid order data");

      const sortedOrders = allOrders.sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
      );

      const total = sortedOrders.length;
      const start = (page - 1) * limit;
      const paginated = sortedOrders.slice(start, start + limit);

      const result = await Promise.all(
        paginated.map(async (order) => {
          let addressString = "";
          try {
            const addr = order.shipping_address?.address;
            const [province, district, ward] = await Promise.all([
              addressService.getProvinceById(addr?.province),
              addressService.getDistrictById(addr?.district, addr?.province),
              addressService.getWardById(addr?.ward, addr?.district),
            ]);

            addressString = [
              addr.street,
              ward?.full_name,
              district?.full_name,
              province?.full_name,
            ]
              .filter(Boolean)
              .join(", ");
          } catch (err) {
            console.warn("Không thể lấy địa chỉ đầy đủ:", err);
          }

          return {
            ...order,
            addressString,
          };
        })
      );

      return {
        data: result,
        total,
      };
    } catch (error) {
      console.error("Lỗi khi phân trang đơn hàng", error);
      return {
        data: [],
        total: 0,
      };
    }
  },

  getOrdersAndStats: async (
    type = "day",
    date = dayjs(),
    page = 1,
    limit = 5
  ) => {
    try {
      const allOrders = await get("orders");

      const format = {
        day: "YYYY-MM-DD",
        month: "YYYY-MM",
        year: "YYYY",
      }[type];

      const currentKey = dayjs(date).format(format);
      const prevKey = dayjs(date).subtract(1, type).format(format);

      const currentStats = { revenue: 0, totalOrders: 0, pendingOrders: 0 };
      const prevStats = { revenue: 0, totalOrders: 0, pendingOrders: 0 };

      const filtered = [];

      for (const order of allOrders) {
        const orderKey = dayjs.utc(order.order_date).local().format(format);

        const revenue = order.total_price;

        const stats =
          orderKey === currentKey
            ? currentStats
            : orderKey === prevKey
              ? prevStats
              : null;

        if (orderKey === currentKey) {
          filtered.push(order);
        }

        if (stats) {
          stats.revenue += revenue;
          stats.totalOrders += 1;
          if (order.status?.current === "PENDING") {
            stats.pendingOrders += 1;
          }
        }
      }

      const sorted = filtered.sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
      );
      const total = sorted.length;
      const start = (page - 1) * limit;
      const paginated = sorted.slice(start, start + limit);

      return {
        data: paginated,
        total,
        currentStats,
        prevStats,
      };
    } catch (e) {
      console.error("Lỗi khi lấy orders và thống kê:", e);
      throw e;
    }
  },

  getOrdersByYear: async (year) => {
    try {
      const allOrders = await get("orders");

      const filtered = allOrders.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate.getFullYear() === year;
      });

      const sorted = filtered.sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
      );

      return sorted;
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng theo năm:", error);
      return [];
    }
  },

  getRecentOrders: async () => {
    try {
      const allOrders = await get("orders");

      if (!Array.isArray(allOrders)) throw new Error("Invalid order data");

      const sortedOrders = allOrders.sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
      );

      const recentOrders = sortedOrders.slice(0, 10);

      const result = await Promise.all(
        recentOrders.map(async (order) => {
          let addressString = "";
          try {
            const addr = order.shipping_address?.address;
            const [province, district, ward] = await Promise.all([
              addressService.getProvinceById(addr?.province),
              addressService.getDistrictById(addr?.district, addr?.province),
              addressService.getWardById(addr?.ward, addr?.district),
            ]);

            addressString = [
              addr.street,
              ward?.full_name,
              district?.full_name,
              province?.full_name,
            ]
              .filter(Boolean)
              .join(", ");
          } catch (err) {
            console.warn("Không thể lấy địa chỉ đầy đủ:", err);
          }

          return {
            ...order,
            addressString,
          };
        })
      );

      return result;
    } catch (error) {
      console.error("Lỗi khi lấy 10 đơn hàng gần nhất:", error);
      return [];
    }
  },

  getListOrders: async () => {
    try {
      const allOrders = await get("orders");
      if (!Array.isArray(allOrders)) throw new Error("Invalid order data");

      return allOrders
    } catch (error) {
      console.error("Lỗi khi lấy tất cả đơn hàng:", error);
      return [];
    }
  },
}