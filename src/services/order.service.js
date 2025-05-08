import { get, patch, post } from "./request";

export const orderService = {
  createOrder: async (order) => {
    try {
      const response = await post("orders", order);

      for (const item of order.products) {
        const productId = item.id;
        const quantity = item.quantity;

        const product = await get(`products/${productId}`);

        if (product.stock >= quantity) {
          const updatedProduct = {
            stock: product.stock - quantity,
            total_sales: product.total_sales + quantity,
          };

          await patch(`products/${productId}`, updatedProduct);
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
  getOrdersByStatus: async (userId, status = "ALL", page = 1, limit = 5) => {
    try {
      const queryParams = new URLSearchParams({ customer_id: userId });
      if (status !== "ALL") {
        queryParams.append("status", status);
      }

      const allOrders = await get(`orders?${queryParams.toString()}`);

      const sorted = allOrders.sort(
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
      );

      const total = sorted.length;

      const start = (page - 1) * limit;
      const paginated = sorted.slice(start, start + limit);
      console.log(paginated);
      return { data: paginated, total };
    } catch (error) {
      console.error("Lỗi khi lọc đơn hàng:", error);
      return { data: [], total: 0 };
    }
  },
};
