"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  message,
  Skeleton,
  Tag,
  Select,
  DatePicker,
} from "antd";
import {
  Plus,
  LayoutDashboard,
  PencilLine,
  Eye,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { orderService } from "../../services/order.service";
import { OverviewItem } from "../../components/OverviewItem";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function OrderManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [, setLoadingStats] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [totalRevenue, setTotalRevenue] = useState({ value: 0, change: 0 });
  const [totalOrders, setTotalOrders] = useState({ value: 0, change: 0 });
  const [pendingOrders, setPendingOrders] = useState({ value: 0, change: 0 });
  const [filterType, setFilterType] = useState("day");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const statusColors = {
    pending: "orange",
    processing: "blue",
    shipped: "cyan",
    delivered: "green",
    cancelled: "red",
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const handleFilterChange = (type) => {
    setFilterType(type);
    fetchOrderStats(type, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchOrderStats(filterType, date);
  };

  useEffect(() => {
    fetchOrderTableData();
    fetchOrderStats();
  }, []);

  const fetchOrderTableData = async (page = currentPage, limit = perPage) => {
    setLoadingTable(true);
    try {
      const response = await orderService.getOrdersPaginated(page, limit);
      setOrders(response.data);
      setTotalRows(response.total);
    } catch (error) {
      message.error("Failed to fetch orders");
      console.error(error);
    }
    setLoadingTable(false);
  };

  const fetchOrderStats = async (type = filterType, date = selectedDate) => {
    // setLoadingStats(true);
    // try {
    //   const stats = await orderService.getOverviewStatsByFilter(type, date);
    //   const prevDate = dayjs(date).subtract(1, type);
    //   const prevStats = await orderService.getOverviewStatsByFilter(
    //     type,
    //     prevDate
    //   );
    //   const calcChange = (current, prev) => {
    //     if (prev === 0) return current === 0 ? 0 : 100;
    //     return Number((((current - prev) / prev) * 100).toFixed(2));
    //   };
    //   const revenueChange = calcChange(stats.revenue, prevStats.revenue);
    //   const ordersChange = calcChange(stats.totalOrders, prevStats.totalOrders);
    //   const pendingChange = calcChange(
    //     stats.pendingOrders,
    //     prevStats.pendingOrders
    //   );
    //   setTotalRevenue({ value: stats.revenue, change: revenueChange });
    //   setTotalOrders({ value: stats.totalOrders, change: ordersChange });
    //   setPendingOrders({ value: stats.pendingOrders, change: pendingChange });
    // } catch (error) {
    //   message.error("Failed to fetch order statistics");
    //   console.error(error);
    // }
    // setLoadingStats(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm)
  );

  const showModal = (order = null) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    if (order) {
      form.setFieldsValue({
        ...order,
        date: dayjs(order.date),
      });
    } else {
      form.resetFields();
    }
  };

  const showViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
  };

  const handleOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    values.date = values.date.format("YYYY-MM-DD");

    if (selectedOrder) {
      try {
        await orderService.updateOrder(selectedOrder.id, values);
        message.success("Order updated successfully");
      } catch (error) {
        message.error("Failed to update order");
        console.error(error);
        return;
      }
    } else {
      try {
        await orderService.createOrder(values);
        message.success("Order created successfully");
      } catch (error) {
        message.error(error.message || "An error occurred");
        return;
      }
    }

    fetchOrderStats();
    fetchOrderTableData();
    handleCancel();
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.orderId,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => {
        const date = new Date(row.date);
        return date.toLocaleDateString();
      },
      sortable: true,
    },
    {
      name: "Items",
      selector: (row) => row.items,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <Tag color={statusColors[row.status] || "default"}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Tag>
      ),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) =>
        row.amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      sortable: true,
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Button type="link" onClick={() => showViewModal(row)}>
            <Eye className="text-blue-600 w-4 h-4" />
          </Button>
          <Button type="link" onClick={() => showModal(row)}>
            <PencilLine className="text-green-600 w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="font-bold text-xl flex items-center justify-between space-x-2 mb-4">
        <div className="flex items-center">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-gray-800 text-2xl">Order Overview</span>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={filterType}
            onChange={handleFilterChange}
            options={[
              { label: "Theo ngày", value: "day" },
              { label: "Theo tháng", value: "month" },
              { label: "Theo năm", value: "year" },
            ]}
          />
          <DatePicker
            picker={filterType}
            value={selectedDate}
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <OverviewItem
          title="Total Revenue"
          value={totalRevenue.value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          icon={<DollarOutlined className="text-green-500" />}
          change={{ value: totalRevenue.change, text: "vs previous period" }}
          className="bg-green-50"
          iconClassName="bg-white text-green-500"
        />

        <OverviewItem
          title="Total Orders"
          value={totalOrders.value.toLocaleString("en-US")}
          icon={<ShoppingCartOutlined className="text-blue-500" />}
          change={{ value: totalOrders.change, text: "vs previous period" }}
          className="bg-blue-50"
          iconClassName="bg-white text-blue-500"
        />

        <OverviewItem
          title="Pending Orders"
          value={pendingOrders.value}
          icon={<ClockCircleOutlined className="text-orange-500" />}
          change={{ value: pendingOrders.change, text: "vs previous period" }}
          className="bg-orange-50"
          iconClassName="bg-white text-orange-500"
        />
      </div>

      <h2 className="font-bold text-xl flex items-center space-x-2 mt-8 mb-2 pb-2">
        <ShoppingBag className="h-6 w-6 text-blue-600 mr-2" />
        <span className="text-gray-800 text-2xl">Order Details</span>
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-12 gap-3">
          <Input
            placeholder="Search by order ID or status..."
            allowClear
            onChange={handleSearch}
            className="col-span-3 h-8"
          />

          <div className="col-span-7"></div>

          <div className="col-span-2 text-end mb-4">
            <Button onClick={() => showModal()}>
              <Plus className="mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {loadingTable ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredOrders}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            onChangePage={(page) => {
              setCurrentPage(page);
              fetchOrderTableData(page, perPage);
            }}
            onChangeRowsPerPage={(newPerPage, page) => {
              setPerPage(newPerPage);
              setCurrentPage(page);
              fetchOrderTableData(page, newPerPage);
            }}
            highlightOnHover
            customStyles={{
              headCells: {
                style: {
                  fontWeight: "bold",
                  color: "#2563eb",
                  fontSize: "15px",
                },
              },
              cells: {
                style: {
                  color: "#374151",
                },
              },
            }}
          />
        )}
      </div>

      {/* Edit/Create Order Modal */}
      <Modal
        title={selectedOrder ? "Update Order" : "Create New Order"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Order ID"
            name="orderId"
            rules={[{ required: true, message: "Please enter the order ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Items"
            name="items"
            rules={[
              { required: true, message: "Please enter the number of items" },
            ]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter the amount" }]}
          >
            <Input type="number" min={0} step={0.01} prefix="$" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Order Modal */}
      <Modal
        title="Order Details"
        open={isViewModalOpen}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              handleViewCancel();
              showModal(selectedOrder);
            }}
          >
            Edit
          </Button>,
        ]}
        width={600}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Order ID:</span>
              </div>
              <span>{selectedOrder.orderId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <ClockCircleOutlined className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Date:</span>
              </div>
              <span>{new Date(selectedOrder.date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Items:</span>
              </div>
              <span>{selectedOrder.items}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <ShoppingCartOutlined className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Status:</span>
              </div>
              <Tag color={statusColors[selectedOrder.status] || "default"}>
                {selectedOrder.status.charAt(0).toUpperCase() +
                  selectedOrder.status.slice(1)}
              </Tag>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarOutlined className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Amount:</span>
              </div>
              <span>
                {selectedOrder.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
