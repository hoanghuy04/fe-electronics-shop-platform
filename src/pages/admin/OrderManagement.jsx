import React, { useState, useEffect } from "react";
import { Table, Select, message } from "antd";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách đơn hàng từ json-server
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/orders");
      setOrders(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách đơn hàng");
    }
    setLoading(false);
  };

  // Cấu hình cột cho Table
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()} VNĐ`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ xác nhận", value: "Pending" },
        { text: "Đang xử lý", value: "Processing" },
        { text: "Đã giao", value: "Delivered" },
        { text: "Hủy", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 150 }}
        >
          <Select.Option value="Pending">Chờ xác nhận</Select.Option>
          <Select.Option value="Processing">Đang xử lý</Select.Option>
          <Select.Option value="Delivered">Đã giao</Select.Option>
          <Select.Option value="Cancelled">Hủy</Select.Option>
        </Select>
      ),
    },
  ];

  // Xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.patch(`http://localhost:3001/orders/${id}`, { status });
      setOrders(
        orders.map((order) => (order.id === id ? response.data : order))
      );
      message.success("Cập nhật trạng thái thành công");
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OrderManagement;