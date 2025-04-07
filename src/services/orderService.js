import { get } from "./request";

export const getLatestOrder = async () => {
  try {
    const orders = await get("orders");

    if (!orders || !Array.isArray(orders)) {
      throw new Error("Dữ liệu đơn hàng không hợp lệ");
    }
    const latestOrder = orders.sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    )[0];
    if (!latestOrder) {
      throw new Error("Không có đơn hàng nào.");
    }
    return latestOrder;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
