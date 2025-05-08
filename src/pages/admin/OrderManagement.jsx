"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  message,
  Skeleton,
  Select,
  DatePicker,
  Divider,
  Steps,
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
import TagStatus from "../../components/TagStatus";
import useAddress from "../../hooks/useAddress";
import AddressDisplay from "../../components/AddressDisplay";
import HistoryCartItem from "../../components/HistoryCartItem";

export default function OrderManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [, setLoadingStats] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState({ value: 0, change: 0 });
  const [totalOrders, setTotalOrders] = useState({ value: 0, change: 0 });
  const [pendingOrders, setPendingOrders] = useState({ value: 0, change: 0 });
  const [filterType, setFilterType] = useState("day");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const ORDER_FLOW = [
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "PROCESSING", label: "Đang xử lý" },
    { key: "SHIPPED", label: "Đã gửi hàng" },
    { key: "DELIVERED", label: "Đã giao hàng" },
  ];

  const CANCEL_STEP = { key: "CANCELLED", label: "Đã huỷ" };

  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [selectedDate, filterType, currentPage, perPage]);

  const historyMap = {};
  (selectedOrder?.status.history || []).forEach((item) => {
    historyMap[item.status] = item;
  });

  // const completedKeys = selectedOrder?.status.history.map((h) => h.status);

  const stepsToRender = [...ORDER_FLOW];
  if (selectedOrder?.status.current === "CANCELLED") {
    const lastStatusBeforeCancel = selectedOrder?.status.history
      .reverse()
      .find((h) => h.status !== "CANCELLED")?.status;

    const insertIndex =
      ORDER_FLOW.findIndex((s) => s.key === lastStatusBeforeCancel) + 1;
    stepsToRender.splice(insertIndex, 0, CANCEL_STEP);
  }

  const handleFilterChange = (type) => {
    setFilterType(type);
    fetchData(type, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchData(filterType, date);
  };

  useEffect(() => {
    fetchData(currentPage, perPage);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchData(page, newPerPage);
  };

  const fetchData = async (page = 1, limit = 5) => {
    setLoadingTable(true);
    try {
      const { data, total, currentStats, prevStats } =
        await orderService.getOrdersAndStats(
          filterType,
          selectedDate,
          page,
          limit
        );

      setOrders(data);
      setTotalRows(total);

      const calcChange = (current, prev) => {
        if (prev === 0) return current === 0 ? 0 : 100;
        return Number((((current - prev) / prev) * 100).toFixed(2));
      };

      setTotalRevenue({
        value: currentStats.revenue,
        change: calcChange(currentStats.revenue, prevStats.revenue),
      });

      setTotalOrders({
        value: currentStats.totalOrders,
        change: calcChange(currentStats.totalOrders, prevStats.totalOrders),
      });

      setPendingOrders({
        value: currentStats.pendingOrders,
        change: calcChange(currentStats.pendingOrders, prevStats.pendingOrders),
      });
    } catch (error) {
      message.error("Không thể tải dữ liệu thống kê & đơn hàng", error);
    }
    setLoadingTable(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm)
  );

  const showModal = (order = null) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
    console.log(order);

    if (order) {
      form.setFieldsValue({
        status: order.status?.current,
      });
    } else {
      form.resetFields();
    }
  };

  const showViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };
  const handleStatusUpdate = async (values) => {
    console.log("Dữ liệu cập nhật:", values);
    try {
      const updatedOrder = orderService.updateOrder(selectedOrder, {
        status: values.status,
        note: values.note,
      });

      await orderService.updateOrder(selectedOrder.id, updatedOrder);
      message.success("Cập nhật trạng thái thành công");

      setIsStatusModalOpen(false);
      form.resetFields();
      fetchData(currentPage, perPage);
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại");
    }
  };

  const columns = [
    {
      name: "STT",
      cell: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Mã",
      selector: (row) => row.id,
      sortable: true,
      width: "200px",
    },
    {
      name: "Ngày đặt đơn",
      selector: (row) => {
        const [year, month, day] = row.order_date.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Tên KH",
      selector: (row) => row.shipping_address.full_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.addressString,
      sortable: false,
      width: "300px",
      wrap: true,
    },
    {
      name: "Tổng tiền",
      selector: (row) => row.total_price.toLocaleString("vi-VN") ?? "0",
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) => <TagStatus status={row.status?.current} />,
      sortable: true,
    },
    {
      name: "",
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
          title="Tổng doanh thu"
          value={totalRevenue.value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          icon={<DollarOutlined className="text-green-500" />}
          change={{ value: totalRevenue.change, text: "so với kì trước" }}
          className="bg-green-50"
          iconClassName="bg-white text-green-500"
        />

        <OverviewItem
          title="Tổng hoá đơn"
          value={totalOrders.value.toLocaleString("en-US")}
          icon={<ShoppingCartOutlined className="text-blue-500" />}
          change={{ value: totalOrders.change, text: "so với kì trước" }}
          className="bg-blue-50"
          iconClassName="bg-white text-blue-500"
        />

        <OverviewItem
          title="Hoá đơn chờ xử lý"
          value={pendingOrders.value}
          icon={<ClockCircleOutlined className="text-orange-500" />}
          change={{ value: pendingOrders.change, text: "so với kì trước" }}
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

          <div className="col-span-2 text-end mb-4"></div>
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
            noDataComponent="Không tìm thấy order nào nào"
            // selectableRows
            // onSelectedRowsChange={handleRowSelected}
            // selectableRowsHighlight
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
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

      <Modal
        title="Chi tiết đơn hàng"
        open={isViewModalOpen}
        centered
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsViewModalOpen(false);
              showModal(selectedOrder);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={1000}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Mã đơn hàng:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Ngày đặt hàng:</strong>{" "}
                {new Date(selectedOrder.order_date).toLocaleString("vi-VN")}
              </p>
              <p>
                <strong>Trạng thái đơn hàng:</strong>{" "}
                <TagStatus status={selectedOrder.status.current} />
              </p>
              <p>
                <strong>Trạng thái thanh toán:</strong>{" "}
                <TagStatus status={selectedOrder.payment_status} />
              </p>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Khách hàng:</strong>{" "}
                {selectedOrder.shipping_address.full_name}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {selectedOrder.shipping_address.phone}
              </p>
              <p className="col-span-2">
                <strong>Địa chỉ:</strong>{" "}
                <AddressDisplay
                  address={selectedOrder.shipping_address.address}
                />
              </p>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {selectedOrder.payment_method}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {selectedOrder.total_price.toLocaleString()}
              </p>
            </div>

            {selectedOrder.status.history?.length > 0 && (
              <>
                <Divider />
                <p>
                  <strong>Lịch sử trạng thái:</strong>
                </p>
                <Steps
                  size="small"
                  current={stepsToRender.findIndex(
                    (s) => s.key === selectedOrder.status.current
                  )}
                >
                  {stepsToRender.map((step) => {
                    const historyItem = historyMap[step.key];
                    const isCancelled = step.key === "CANCELLED";

                    return (
                      <Steps.Step
                        key={step.key}
                        status={
                          isCancelled
                            ? "error"
                            : historyItem
                            ? "finish"
                            : "wait"
                        }
                        title={step.label}
                        description={
                          historyItem
                            ? `${dayjs(historyItem.updated_at).format(
                                "HH:mm:ss D/M/YYYY"
                              )}: ${historyItem.note}`
                            : "Chưa có dữ liệu"
                        }
                      />
                    );
                  })}
                </Steps>
              </>
            )}

            {selectedOrder.products && (
              <>
                <Divider />
                <p>
                  <strong>Sản phẩm:</strong>
                </p>
                {selectedOrder.products.map((product) => (
                  <HistoryCartItem product={product} key={product.id} />
                ))}
              </>
            )}

            {selectedOrder.note && (
              <>
                <Divider />
                <p>
                  <strong>Ghi chú:</strong> {selectedOrder.note}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isStatusModalOpen}
        centered
        destroyOnClose
        onCancel={() => {
          setIsStatusModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleStatusUpdate}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              placeholder="Chọn trạng thái đơn hàng"
              options={[
                { label: "Chờ xác nhận", value: "PENDING" },
                { label: "Đang xử lý", value: "PROCESSING" },
                { label: "Đã gửi hàng", value: "SHIPPED" },
                { label: "Đã giao hàng", value: "DELIVERED" },
                { label: "Đã hủy", value: "CANCELLED" },
              ]}
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Lý do thay đổi trạng thái" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
