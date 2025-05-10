"use client"

import { useState, useEffect } from "react"
import { Typography, Table, Tag, Button, Select, Spin } from "antd"
import { ShoppingCart, DollarSign, Calendar, Star, RefreshCw, Download, ArrowUp, ArrowDown } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import dayjs from "dayjs"
import { orderService } from "../../services/order.service"
import { userApi } from "../../services/user.service"
import { productService } from "../../services/product.service"
import { reviewService } from "../../services/review.service"
import { path } from "../../constants/path"
import { NavLink } from "react-router-dom"
import { exportDashboardToExcel } from "../../utils/exportUtil"
import { OverviewItem } from "../../components/OverviewItem"
import { categoryService } from "../../services/category.service"
import { brandService } from "../../services/brand.service"
import { debounce } from "../../utils/debounce"
import { get } from "../../services/request"

const { Text } = Typography
const { Option } = Select

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
}

const formatVND = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value)
}

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
    )
  }
  return null
}

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()

const orderStatuses = ["DELIVERED", "PENDING", "CANCELLED", "RETURNED", "PROCESSING"]

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("month")
  const [revenueChartTimeRange, setRevenueChartTimeRange] = useState("month")
  const [userGrowthChartTimeRange, setUserGrowthChartTimeRange] = useState("month")
  const [data, setData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [users, setUsers] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // In-memory cache
  let cache = {
    users: null,
    brands: null,
    categories: null,
    lastFetched: null,
  };

  // Cache expiration time (e.g., 5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Check if cached data is valid
      if (
        cache.users &&
        cache.brands &&
        cache.categories &&
        cache.lastFetched &&
        Date.now() - cache.lastFetched < CACHE_DURATION
      ) {
        setUsers(cache.users);
        setBrands(cache.brands);
        setCategories(cache.categories);
        setLoading(false);
        return;
      }

      const [usersResponse, brandsResponse, categoriesResponse] = await Promise.all([
        userApi.getAllUsers(),
        brandService.getAllBrands(),
        categoryService.getListOfCategories(),
      ]);

      // Update cache
      cache = {
        users: usersResponse,
        brands: brandsResponse,
        categories: categoriesResponse,
        lastFetched: Date.now(),
      };

      setUsers(usersResponse);
      setBrands(brandsResponse);
      setCategories(categoriesResponse);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchRevenueData = async (range) => {
    try {
      const year = currentYear;
      let startDate, endDate, format;

      if (range === "week") {
        startDate = dayjs().startOf("week").format("YYYY-MM-DD");
        endDate = dayjs().endOf("week").format("YYYY-MM-DD");
        format = "DD/MM";
      } else if (range === "month") {
        startDate = dayjs().startOf("month").format("YYYY-MM-DD");
        endDate = dayjs().endOf("month").format("YYYY-MM-DD");
        format = "DD/MM";
      } else {
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
        format = "MMM YYYY";
      }

      // Fetch orders within the date range
      const orders = await get(
        `orders?order_date_gte=${startDate}&order_date_lte=${endDate}`
      );

      // Aggregate revenue by date
      const revenueMap = {};

      if (range === "week" || range === "month") {
        const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
        for (let i = 0; i < days; i++) {
          const date = dayjs(startDate).add(i, "day");
          const dateKey = date.format(format);
          revenueMap[dateKey] = 0;
        }
      } else {
        for (let i = 0; i < 12; i++) {
          const date = dayjs().month(i).year(year);
          const dateKey = date.format(format);
          revenueMap[dateKey] = 0;
        }
      }

      orders.forEach((order) => {
        const date = dayjs(order.order_date);
        const dateKey = date.format(format);
        revenueMap[dateKey] = (revenueMap[dateKey] || 0) + (order.total_price || 0);
      });

      return Object.entries(revenueMap).map(([month, value]) => ({
        month,
        value,
        category: "Doanh thu",
      }));
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      return [];
    }
  };

  const fetchUserGrowthData = async (range) => {
    try {
      const users = await userApi.getAllUsers();
      let data = [];

      if (range === "week") {
        const startOfWeek = dayjs().startOf("week");
        data = Array(7)
          .fill(0)
          .map((_, i) => {
            const date = startOfWeek.add(i, "day");
            const newUsers = users.filter(
              (user) =>
                dayjs(user.created_at).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
            ).length;
            const totalUsers = users.filter(
              (user) => dayjs(user.created_at).isBefore(date.endOf("day"))
            ).length;
            return {
              month: date.format("DD/MM"),
              newUsers,
              totalUsers,
            };
          });
      } else if (range === "month") {
        const startOfMonth = dayjs().startOf("month");
        const daysInMonth = dayjs().daysInMonth();
        data = Array(daysInMonth)
          .fill(0)
          .map((_, i) => {
            const date = startOfMonth.add(i, "day");
            const newUsers = users.filter(
              (user) =>
                dayjs(user.created_at).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
            ).length;
            const totalUsers = users.filter(
              (user) => dayjs(user.created_at).isBefore(date.endOf("day"))
            ).length;
            return {
              month: date.format("DD/MM"),
              newUsers,
              totalUsers,
            };
          });
      } else {
        data = Array(12)
          .fill(0)
          .map((_, i) => {
            const month = i;
            const year = currentYear - (month > currentMonth ? 1 : 0);
            const date = dayjs().month(month).year(year);
            const newUsers = users.filter(
              (user) =>
                dayjs(user.created_at).month() === month &&
                dayjs(user.created_at).year() === year
            ).length;
            const totalUsers = users.filter(
              (user) => dayjs(user.created_at).isBefore(date.endOf("month"))
            ).length;
            return {
              month: date.format("MMM YYYY"),
              newUsers,
              totalUsers,
            };
          });
      }

      return data;
    } catch (error) {
      console.error("Error fetching user growth data:", error);
      return [];
    }
  };

  const calcChange = (current, prev) => {
    if (prev === 0) return current === 0 ? 0 : 100
    return Number((((current - prev) / prev) * 100).toFixed(2))
  }

  const fetchData = async () => {
    try {
      setIsRefreshing(true);

      // Fetch all core data in parallel
      const [
        allOrders,
        allProducts,
        recentOrdersResponse,
        outOfStockProducts,
        avgRating,
      ] = await Promise.all([
        get("orders?_sort=order_date&_order=desc"), // Fetch all orders
        get("products"), // Fetch all products
        get("orders?_sort=order_date&_order=desc&_limit=10"), // Recent orders
        get("products?stock_lte=0"), // Out-of-stock products
        reviewService.getAvgRating(), // Average rating
      ]);

      // Determine date ranges
      const prevDate = {
        day: dayjs().subtract(1, "day"),
        week: dayjs().subtract(1, "week"),
        month: dayjs().subtract(1, "month"),
        year: dayjs().subtract(1, "year"),
      }[timeRange];

      // Filter orders for current and previous periods
      const format = {
        day: "YYYY-MM-DD",
        week: "YYYY-MM-DD",
        month: "YYYY-MM",
        year: "YYYY",
      }[timeRange];

      const currentKey = dayjs().format(format);
      const prevKey = prevDate.format(format);

      const currentOrders = allOrders.filter((order) =>
        dayjs(order.order_date).format(format) === currentKey
      );
      const prevOrders = allOrders.filter((order) =>
        dayjs(order.order_date).format(format) === prevKey
      );

      // Calculate stats
      const currentStats = {
        revenue: currentOrders.reduce((sum, order) => sum + (order.total_price || 0), 0),
        totalOrders: currentOrders.length,
        pendingOrders: currentOrders.filter((order) => order.status?.current === "PENDING").length,
      };
      const prevStats = {
        revenue: prevOrders.reduce((sum, order) => sum + (order.total_price || 0), 0),
        totalOrders: prevOrders.length,
        pendingOrders: prevOrders.filter((order) => order.status?.current === "PENDING").length,
      };

      // Process order status data
      const orderStatusData = orderStatuses.map((status) => ({
        type: status,
        value: currentOrders.filter((order) => order.status?.current === status).length,
      }));

      // Process top products
      const topProductsData = allProducts
        .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
        .slice(0, 10)
        .map((product) => ({
          name: product.title,
          sales: product.total_sales || 0,
        }));

      // Process recent orders
      const recentOrdersData = recentOrdersResponse.map((order) => ({
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

      // Process out-of-stock products
      const outOfStockData = outOfStockProducts.map((product) => ({
        key: product.id,
        id: product.id,
        name: product.title,
        category: categories.find((cat) => cat.id == product.category_id)?.name || "N/A",
        brand: brands.find((b) => b.id == product.brand_id)?.name || "N/A",
      }));

      // Calculate metrics
      const totalOrders = currentOrders.length;
      const totalRevenue = currentStats.revenue;
      const totalProducts = allProducts.length;
      const totalUsers = users.length;
      const todayOrders = allOrders.filter(
        (order) => dayjs(order.order_date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
      ).length;
      const monthlyRevenue = allOrders
        .filter((order) => dayjs(order.order_date).format("YYYY-MM") === dayjs().format("YYYY-MM"))
        .reduce((sum, order) => sum + (order.total_price || 0), 0);
      const outOfStock = outOfStockProducts.length;

      // Previous period metrics
      const prevTotalOrders = prevOrders.length;
      const prevTotalRevenue = prevStats.revenue;
      const prevTotalProducts = allProducts.length; // Assuming products don't change
      const prevTotalUsers = users.filter(
        (user) => dayjs(user.created_at).isBefore(prevDate.endOf(timeRange))
      ).length;
      const prevTodayOrders = allOrders.filter(
        (order) => dayjs(order.order_date).format("YYYY-MM-DD") === prevDate.format("YYYY-MM-DD")
      ).length;
      const prevAverageRating = avgRating; // Assuming rating doesn't change significantly
      const prevOutOfStock = outOfStockProducts.length;

      // Set data
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
        averageRating: avgRating.toFixed(1),
        outOfStock,
        dailyRevenue: todayOrders
          ? allOrders
            .filter((order) => dayjs(order.order_date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD"))
            .reduce((sum, order) => sum + (order.total_price || 0), 0)
          : 0,
        monthlyRevenue,
        totalOrdersChange: calcChange(totalOrders, prevTotalOrders),
        totalRevenueChange: calcChange(totalRevenue, prevTotalRevenue),
        totalProductsChange: calcChange(totalProducts, prevTotalProducts),
        totalUsersChange: calcChange(totalUsers, prevTotalUsers),
        todayOrdersChange: calcChange(todayOrders, prevTodayOrders),
        averageRatingChange: calcChange(avgRating, prevAverageRating),
        outOfStockChange: calcChange(outOfStock, prevOutOfStock),
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
        totalOrdersChange: 0,
        totalRevenueChange: 0,
        totalProductsChange: 0,
        totalUsersChange: 0,
        todayOrdersChange: 0,
        averageRatingChange: 0,
        outOfStockChange: 0,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const debouncedFetchData = debounce(fetchData, 500);

  const exportReport = () => {
    exportDashboardToExcel(data, `Dashboard_Report_${dayjs().format("YYYYMMDD")}.xlsx`)
  }

  useEffect(() => {
    if (!loading) {
      debouncedFetchData()
    }
  }, [loading, timeRange, revenueChartTimeRange, userGrowthChartTimeRange])

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    )
  }

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
        let color = "green"
        if (status === "Đang xử lý") color = "blue"
        else if (status === "Bị hủy") color = "red"
        else if (status === "Trả hàng") color = "orange"
        else if (status === "Đang chờ") color = "yellow"
        return <Tag color={color}>{status}</Tag>
      },
    },
  ]

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
  ]

  const changeText = {
    day: "so với ngày trước",
    week: "so với tuần trước",
    month: "so với tháng trước",
    year: "so với năm trước",
  }[timeRange]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 m-0">Tổng quan hệ thống</h1>
        <div className="flex space-x-3">
          <Select value={timeRange} style={{ width: 120 }} onChange={setTimeRange} >
            <Option value="day">Ngày</Option>
            <Option value="week">Tuần</Option>
            <Option value="month">Tháng</Option>
            <Option value="year">Năm</Option>
          </Select>
          <Button
            icon={<RefreshCw size={16} />}
            onClick={debouncedFetchData}
            loading={isRefreshing}
            style={{ marginRight: "10px" , marginLeft: "10px"}}
          >
            Làm mới
          </Button>
          <Button type="primary" icon={<Download size={16} />} onClick={exportReport}>
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <OverviewItem
          title="Tổng đơn hàng"
          value={data.totalOrders}
          icon={<ShoppingCart className="text-blue-600" />}
          change={{
            value: data.totalOrdersChange,
            text: changeText,
          }}
          className="bg-blue-50"
          iconClassName="bg-white text-blue-600"
        />

        <OverviewItem
          title="Tổng doanh thu"
          value={`${(data.totalRevenue / 1000000000).toFixed(2)} tỷ`}
          icon={<DollarSign className="text-green-600" />}
          change={{
            value: data.totalRevenueChange,
            text: changeText,
            // text: (
            //   <div className="flex space-x-4">
            //     <div>Hôm nay: {(data.dailyRevenue / 1000000).toFixed(1)}M</div>
            //     <div>Tháng này: {(data.monthlyRevenue / 1000000).toFixed(1)}M</div>
            //   </div>
            // ),
          }}
          className="bg-green-50"
          iconClassName="bg-white text-green-600"
        />

        <OverviewItem
          title="Đơn hàng hôm nay"
          value={data.todayOrders}
          icon={<Calendar className="text-orange-600" />}
          change={{
            value: data.todayOrdersChange ? data.todayOrdersChange : 0,
            text: timeRange === "day" ? "so với ngày trước" : changeText,
          }}
          className="bg-orange-50"
          iconClassName="bg-white text-orange-600"
        />

        {/* Rating Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Đánh giá trung bình</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-yellow-600">{data.averageRating}</p>
              <span className="ml-1 text-lg text-yellow-600">/5</span>
              <Star className="h-4 w-4 text-yellow-500 ml-1" fill="#facc15" />
            </div>
            <div className="mt-2 w-full">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${data.averageRating * 20}%` }}></div>
              </div>
              <div className="flex items-center mt-2">
                {data.averageRatingChange > 0 ? (
                  <ArrowUp className="text-green-600 mr-1 h-4 w-4" />
                ) : data.averageRatingChange < 0 ? (
                  <ArrowDown className="text-red-600 mr-1 h-4 w-4" />
                ) : null}
                {/* <Text
                  className={`text-xs font-medium ${data.averageRatingChange > 0
                    ? "text-green-500"
                    : data.averageRatingChange < 0
                      ? "text-red-500"
                      : "text-gray-500"
                    }`}
                >
                  {Math.abs(data.averageRatingChange)}% {changeText}
                </Text> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Doanh thu theo thời gian</h3>
            <Select value={revenueChartTimeRange} style={{ width: 120 }} onChange={setRevenueChartTimeRange}>
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
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <RechartsTooltip content={<CustomTooltip formatter={(value) => formatVND(value)} />} />
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
      </div>

      {/* Products and Users Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top 10 sản phẩm bán chạy</h3>
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
                <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12 }} />
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
                    ]
                    return <Cell key={`cell-${index}`} fill={colorArray[index % colorArray.length]} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Tỷ lệ người dùng mới</h3>
            <Select value={userGrowthChartTimeRange} style={{ width: 120 }} onChange={setUserGrowthChartTimeRange}>
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
                <Line type="monotone" dataKey="totalUsers" name="Tổng người dùng" stroke={colors.purple} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Đơn hàng gần đây</h3>
            <NavLink to={`${path.homeAdmin}/${path.orderManagement}`} className="text-blue-600 hover:underline">
              Xem tất cả
            </NavLink>
          </div>
          <Table columns={recentOrdersColumns} dataSource={data.recentOrders} pagination={false} size="middle" />
        </div>

        {/* Out of Stock Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Sản phẩm hết hàng</h3>
            <NavLink to={`${path.homeAdmin}/${path.productManagement}`} className="text-blue-600 hover:underline">
              Xem tất cả
            </NavLink>
          </div>
          <Table columns={outOfStockColumns} dataSource={data.outOfStockProducts} pagination={false} size="small" />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
