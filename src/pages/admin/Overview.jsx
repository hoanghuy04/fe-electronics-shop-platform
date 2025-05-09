import { useState, useEffect, useContext } from "react";
import { Typography, Table, Tag, Button, Select, Spin, Tooltip } from "antd";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  Calendar,
  Star,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import dayjs from "dayjs";

import { orderService } from "../../services/order.service";
import { userApi } from "../../services/user.service";
import { productService } from "../../services/product.service";
import { reviewService } from "../../services/review.service";
import { AdminContext } from "../../hooks/AdminContext";
import { path } from "../../constants/path";
import { NavLink } from "react-router-dom";
import { exportDashboardToExcel } from "../../utils/exportUtil";

const { Title, Text } = Typography;
const { Option } = Select;

// Định nghĩa các màu
const colors = {
  blue: "#1890ff",
  green: "#52c41a",
  red: "#ff4d4f",
  yellow: "#faad14",
  purple: "#722ed1",
  cyan: "#13c2c2",
  orange: "#fa8c16",
  pink: "#eb2f96",
  lime: "#a0d911",
  gold: "#faad14",
};

// Custom formatter for VND
const formatVND = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

// Custom tooltip for Recharts
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="text-gray-700 font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${
              formatter ? formatter(entry.value) : entry.value
            }`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const currentyear = new Date().getFullYear();
const currentmonth = new Date().getMonth();

const orderStatuses = [
  "DELIVERED",
  "PENDING",
  "CANCELLED",
  "RETURNED",
  "PROCESSING",
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [revenueChartTimeRange, setRevenueChartTimeRange] = useState("month");
  const [userGrowthChartTimeRange, setUserGrowthChartTimeRange] =
    useState("month");
  const [data, setData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { users, orders, products, loading, brands, categories } =
    useContext(AdminContext);

  const fetchRevenueData = async (range) => {
    const responseRevenue = await orderService.getOrdersByYear(currentyear);
    if (range === "week") {
      const startOfWeek = dayjs().startOf("week");
      const weekData = Array(7)
        .fill(0)
        .map((_, i) => {
          const date = startOfWeek.add(i, "day");
          const dailyRevenue = responseRevenue
            .filter(
              (order) =>
                dayjs(order.order_date).format("YYYY-MM-DD") ===
                date.format("YYYY-MM-DD")
            )
            .reduce((sum, order) => sum + (order.total_price || 0), 0);
          return {
            month: date.format("DD/MM"),
            value: dailyRevenue,
            category: "Doanh thu",
          };
        });
      return weekData;
    } else if (range === "month") {
      const startOfMonth = dayjs().startOf("month");
      const daysInMonth = dayjs().daysInMonth();
      const monthData = Array(daysInMonth)
        .fill(0)
        .map((_, i) => {
          const date = startOfMonth.add(i, "day");
          const dailyRevenue = responseRevenue
            .filter(
              (order) =>
                dayjs(order.order_date).format("YYYY-MM-DD") ===
                date.format("YYYY-MM-DD")
            )
            .reduce((sum, order) => sum + (order.total_price || 0), 0);
          return {
            month: date.format("DD/MM"),
            value: dailyRevenue,
            category: "Doanh thu",
          };
        });
      return monthData;
    } else {
      const yearData = Array(12)
        .fill(0)
        .map((_, i) => {
          const month = i;
          const year = currentyear;
          const monthName = new Date(year, month, 1).toLocaleString("vi-VN", {
            month: "short",
          });
          const monthlyRevenue = responseRevenue
            .filter((order) => new Date(order.order_date).getMonth() === month)
            .reduce((sum, order) => sum + (order.total_price || 0), 0);
          return {
            month: `${monthName} ${year}`,
            value: monthlyRevenue,
            category: "Doanh thu",
          };
        });
      return yearData;
    }
  };

  const fetchUserGrowthData = async (range) => {
    if (range === "week") {
      const startOfWeek = dayjs().startOf("week");
      const weekData = await Promise.all(
        Array(7)
          .fill(0)
          .map(async (_, i) => {
            const date = startOfWeek.add(i, "day");
            const newUsers = await userApi.getNoUsersByMonthYear(
              date.month() + 1,
              date.year()
            );
            const totalUsers = await userApi.getTotalUsersBeforeYear(
              date.year() + 1
            );
            return {
              month: date.format("DD/MM"),
              newUsers,
              totalUsers,
            };
          })
      );
      return weekData;
    } else if (range === "month") {
      const startOfMonth = dayjs().startOf("month");
      const daysInMonth = dayjs().daysInMonth();
      const monthData = await Promise.all(
        Array(daysInMonth)
          .fill(0)
          .map(async (_, i) => {
            const date = startOfMonth.add(i, "day");
            const newUsers = await userApi.getNoUsersByMonthYear(
              date.month() + 1,
              date.year()
            );
            const totalUsers = await userApi.getTotalUsersBeforeYear(
              date.year() + 1
            );
            return {
              month: date.format("DD/MM"),
              newUsers,
              totalUsers,
            };
          })
      );
      return monthData;
    } else {
      const yearData = await Promise.all(
        Array(12)
          .fill(0)
          .map(async (_, i) => {
            const month = i;
            const year = currentyear - (month > currentmonth ? 1 : 0);
            const monthName = new Date(year, month, 1).toLocaleString("vi-VN", {
              month: "short",
            });
            const newUsers = await userApi.getNoUsersByMonthYear(
              month + 1,
              year
            );
            const totalUsers = await userApi.getTotalUsersBeforeYear(year + 1);
            return {
              month: `${monthName} ${year}`,
              newUsers,
              totalUsers,
            };
          })
      );
      return yearData;
    }
  };

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      let responseRevenue;
      if (timeRange === "day") {
        const { data: orders, currentStats } =
          await orderService.getOrdersAndStats("day", dayjs(), 1, 1000);
        responseRevenue = orders;
      } else if (timeRange === "week") {
        const startOfWeek = dayjs().startOf("week");
        const endOfWeek = dayjs().endOf("week");
        responseRevenue = await orderService.getOrdersByYear(currentyear);
        responseRevenue = responseRevenue.filter(
          (order) =>
            dayjs(order.order_date).isAfter(startOfWeek) &&
            dayjs(order.order_date).isBefore(endOfWeek)
        );
      } else if (timeRange === "month") {
        const { data: orders } = await orderService.getOrdersAndStats(
          "month",
          dayjs(),
          1,
          1000
        );
        responseRevenue = orders;
      } else {
        responseRevenue = await orderService.getOrdersByYear(currentyear);
      }

      // Đơn hàng theo trạng thái
      const orderStatusData = orderStatuses.map((status) => ({
        type: status,
        value: responseRevenue.filter(
          (order) => order.status?.current === status
        ).length,
      }));

      // Top 10 sản phẩm bán chạy
      const allProducts = await productService.getProducts();
      const topProductsData = allProducts
        .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
        .slice(0, 10)
        .map((product) => ({
          name: product.title,
          sales: product.total_sales || 0,
        }));

      // Đơn hàng gần đây
      const recentOrders = await orderService.getRecentOrders();
      const recentOrdersData = recentOrders.map((order) => ({
        key: order.id,
        id: order.id,
        customer:
          users.find((cust) => cust.id == order.customer_id)?.name || "N/A",
        date: new Date(order.order_date).toLocaleDateString("vi-VN"),
        amount: order.total_price || 0,
        status:
          {
            DELIVERED: "Đã giao",
            PENDING: "Đang chờ",
            CANCELLED: "Bị hủy",
            RETURNED: "Trả hàng",
            PROCESSING: "Đang xử lý",
          }[order.status?.current] || "N/A",
      }));

      // Sản phẩm hết hàng
      const outOfStockProducts = await productService.getOutOfStockProducts();
      const outOfStockData = outOfStockProducts.map((product) => ({
        key: product.id,
        id: product.id,
        name: product.title,
        category:
          categories.find((cat) => cat.id == product.category_id)?.name ||
          "N/A",
        brand: brands.find((b) => b.id == product.brand_id)?.name || "N/A",
      }));

      // Tổng số đơn hàng
      const totalOrders = responseRevenue.length;

      // Tổng doanh thu
      const totalRevenue = responseRevenue.reduce(
        (sum, order) => sum + (order.total_price || 0),
        0
      );

      // Tổng số sản phẩm
      const totalProducts = allProducts.length;

      // Tổng số người dùng
      const totalUsers = users.length;

      // Đơn hàng hôm nay
      const { data: todayOrdersList, currentStats } =
        await orderService.getOrdersAndStats("day", dayjs(), 1, 1000);
      const todayOrders = todayOrdersList.length;

      // Đánh giá trung bình
      const averageRating = await reviewService.getAvgRating();

      // Số sản phẩm hết hàng
      const outOfStock = outOfStockProducts.length;

      // Doanh thu hôm nay
      const dailyRevenue = currentStats.revenue || 0;

      // Doanh thu tháng này
      const { currentStats: monthStats } = await orderService.getOrdersAndStats(
        "month",
        dayjs(),
        1,
        1000
      );
      const monthlyRevenue = monthStats.revenue || 0;

      // Cập nhật state data
      setData({
        revenueData: await fetchRevenueData(revenueChartTimeRange),
        orderStatusData,
        topProductsData,
        userGrowthData: await fetchUserGrowthData(userGrowthChartTimeRange),
        recentOrders: recentOrdersData,
        outOfStockProducts: outOfStockData,
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        todayOrders,
        averageRating: averageRating.toFixed(1),
        outOfStock,
        dailyRevenue,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      setData({
        revenueData: [],
        orderStatusData: [],
        topProductsData: [],
        userGrowthData: [],
        recentOrders: [],
        outOfStockProducts: [],
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        todayOrders: 0,
        averageRating: 0,
        outOfStock: 0,
        dailyRevenue: 0,
        monthlyRevenue: 0,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportReport = () => {
    exportDashboardToExcel(
      data,
      `Dashboard_Report_${dayjs().format("YYYYMMDD")}.xlsx`
    );
  };

  useEffect(() => {
    fetchData();
  }, [loading, timeRange, revenueChartTimeRange, userGrowthChartTimeRange]);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  // Recent orders columns
  const recentOrdersColumns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatVND(amount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "Đang xử lý") color = "blue";
        else if (status === "Bị hủy") color = "red";
        else if (status === "Trả hàng") color = "orange";
        else if (status === "Đang chờ") color = "yellow";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  // Out of stock products columns
  const outOfStockColumns = [
    {
      title: "Mã SP",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  // Calculate total for pie chart
  const totalOrdersPie = data.orderStatusData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 m-0">
          Tổng quan hệ thống
        </h1>
        <div className="flex space-x-3">
          {/* <Select
            value={timeRange}
            style={{ width: 120 }}
            onChange={setTimeRange}
            popupMatchSelectWidth={false}
            className="mr-2"
          >
            <Option value="day">Hôm nay</Option>
            <Option value="week">Tuần này</Option>
            <Option value="month">Tháng này</Option>
            <Option value="year">Năm nay</Option>
          </Select> */}
          <Button
            icon={<RefreshCw size={16} />}
            onClick={() => fetchData()}
            loading={isRefreshing}
            style={{ marginRight: "10px" }}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<Download size={16} />}
            onClick={exportReport}
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Tổng đơn hàng
            </h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-blue-600">
                {data.totalOrders}
              </p>
              <Tooltip title="Tăng 12% so với tháng trước">
                <span className="ml-2 text-sm text-green-500 flex items-center">
                  <ArrowUp size={14} /> 12%
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Tổng doanh thu
            </h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-green-600">
                {(data.totalRevenue / 1000000000).toFixed(2)} tỷ
              </p>
              <Tooltip title="Tăng 8% so với tháng trước">
                <span className="ml-2 text-sm text-green-500 flex items-center">
                  <ArrowUp size={14} /> 8%
                </span>
              </Tooltip>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>Hôm nay: {(data.dailyRevenue / 1000000).toFixed(1)}M</p>
              <p>Tháng này: {(data.monthlyRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-cyan-100 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Tổng người dùng
            </h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-cyan-600">
                {data.totalUsers}
              </p>
              <Tooltip title="Tăng 5% so với tháng trước">
                <span className="ml-2 text-sm text-green-500 flex items-center">
                  <ArrowUp size={14} /> 5%
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-orange-100 p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Đơn hàng hôm nay
            </h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-orange-600">
                {data.todayOrders}
              </p>
              <Tooltip title="Giảm 3% so với hôm qua">
                <span className="ml-2 text-sm text-red-500 flex items-center">
                  <ArrowDown size={14} /> 3%
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Đánh giá trung bình
            </h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-yellow-600">
                {data.averageRating}
              </p>
              <span className="ml-1 text-lg text-yellow-600">/5</span>
              <Star className="h-4 w-4 text-yellow-500 ml-1" fill="#facc15" />
            </div>
            <div className="mt-2 w-full">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${data.averageRating * 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Sản phẩm hết hàng
            </h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-red-600">
                {data.outOfStock}
              </p>
              <Tooltip title="Tăng 2 sản phẩm so với tuần trước">
                <span className="ml-2 text-sm text-red-500 flex items-center">
                  <ArrowUp size={14} /> 2
                </span>
              </Tooltip>
            </div>
            <button className="mt-2 text-blue-600 text-sm hover:underline">
              Xem danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Doanh thu theo thời gian
            </h3>
            <Select
              value={revenueChartTimeRange}
              style={{ width: 120 }}
              onChange={setRevenueChartTimeRange}
            >
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
              <Option value="year">Năm</Option>
            </Select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.revenueData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <RechartsTooltip
                  content={
                    <CustomTooltip formatter={(value) => formatVND(value)} />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Doanh thu"
                  stroke={colors.blue}
                  fill={colors.blue}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Đơn hàng theo trạng thái
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="type"
                  label={({ type, value }) =>
                    `${type}: ${value} (${(
                      (value / totalOrdersPie) *
                      100
                    ).toFixed(0)}%)`
                  }
                >
                  {data.orderStatusData.map((entry, index) => {
                    const COLORS = [
                      colors.green,
                      colors.blue,
                      colors.red,
                      colors.yellow,
                      colors.purple,
                    ];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    );
                  })}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Top 10 sản phẩm bán chạy
          </h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data.topProductsData.map((p) => ({
                  ...p,
                  name: p.name.substring(0, 20),
                }))}
                margin={{
                  top: 5,
                  right: 30,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={160}
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip />
                <Bar dataKey="sales" name="Số lượng đã bán">
                  {data.topProductsData.map((entry, index) => {
                    const colorArray = [
                      colors.blue,
                      colors.green,
                      colors.purple,
                      colors.cyan,
                      colors.pink,
                      colors.yellow,
                      colors.lime,
                      colors.orange,
                      colors.red,
                      colors.gold,
                    ];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorArray[index % colorArray.length]}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Tỷ lệ người dùng mới
            </h3>
            <Select
              value={userGrowthChartTimeRange}
              style={{ width: 120 }}
              onChange={setUserGrowthChartTimeRange}
            >
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
              <Option value="year">Năm</Option>
            </Select>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.userGrowthData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="Người dùng mới"
                  stroke={colors.cyan}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalUsers"
                  name="Tổng người dùng"
                  stroke={colors.purple}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Đơn hàng gần đây
            </h3>
            <a
              href={`${path.homeAdmin}/${path.orderManagement}`}
              className="text-blue-600 hover:underline"
            >
              Xem tất cả
            </a>
          </div>
          <Table
            columns={recentOrdersColumns}
            dataSource={data.recentOrders}
            pagination={false}
            size="middle"
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Sản phẩm hết hàng
            </h3>
            <a
              href={`${path.homeAdmin}/${path.productManagement}`}
              className="text-blue-600 hover:underline"
            >
              Xem tất cả
            </a>
          </div>
          <Table
            columns={outOfStockColumns}
            dataSource={data.outOfStockProducts}
            pagination={false}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
