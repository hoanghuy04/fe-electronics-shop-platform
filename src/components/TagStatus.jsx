import { Tag } from "antd";

const statusColors = {
  PENDING: "gold",
  PROCESSING: "geekblue",
  SHIPPED: "cyan",
  DELIVERED: "green",
  CANCELLED: "volcano",
  PAID: "green",
  UNPAID: "orange",
};

const statusLabels = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đã gửi hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
  PAID: "Đã thanh toán",
  UNPAID: "Chưa thanh toán",
};

export default function TagStatus({ status }) {
  if (!status) return null;

  const color = statusColors[status] || "default";
  const label = statusLabels[status] || status;

  return <Tag color={color}>{label}</Tag>;
}
