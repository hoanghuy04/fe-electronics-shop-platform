
import * as XLSX from "xlsx";
import dayjs from "dayjs";

// Hàm định dạng tiền tệ VND
const formatVND = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

// Hàm tính độ rộng cột tự động
const calculateColumnWidths = (data) => {
  return Object.keys(data[0] || {}).map((key, index) => {
    const maxLength = data.reduce((max, row) => {
      const value = String(row[key] || "");
      return Math.max(max, value.length);
    }, key.length);
    return { wch: Math.min(Math.max(maxLength + 2, 10), 50) }; // Min 10, max 50 ký tự
  });
};

// Hàm áp dụng định dạng cho ô
const applyCellFormatting = (ws, cell, format) => {
  ws[cell] = ws[cell] || {};
  ws[cell].s = format;
};

// Hàm xuất báo cáo Excel
export const exportDashboardToExcel = (data, fileName) => {
  const wb = XLSX.utils.book_new();

  // Định dạng chung
  const headerStyle = {
    font: { name: "Times New Roman", sz: 12, bold: true },
    fill: { fgColor: { rgb: "E6F0FA" } },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const dataStyle = (rowIndex) => ({
    font: { name: "Times New Roman", sz: 11 },
    fill: { fgColor: { rgb: rowIndex % 2 === 0 ? "FFFFFF" : "F5F5F5" } },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
    alignment: { horizontal: "left", vertical: "center" },
  });

  const currencyStyle = (rowIndex) => ({
    ...dataStyle(rowIndex),
    numFmt: "#,##0 ₫",
    alignment: { horizontal: "right", vertical: "center" },
  });

  const numberStyle = (rowIndex) => ({
    ...dataStyle(rowIndex),
    alignment: { horizontal: "right", vertical: "center" },
  });

  // Sheet 1: Summary
  const summaryData = [
    { "Chỉ số": "Tổng đơn hàng", "Giá trị": data.totalOrders },
    { "Chỉ số": "Tổng doanh thu", "Giá trị": data.totalRevenue },
    { "Chỉ số": "Tổng người dùng", "Giá trị": data.totalUsers },
    { "Chỉ số": "Đơn hàng hôm nay", "Giá trị": data.todayOrders },
    { "Chỉ số": "Đánh giá trung bình", "Giá trị": `${data.averageRating}/5` },
    { "Chỉ số": "Sản phẩm hết hàng", "Giá trị": data.outOfStock },
    { "Chỉ số": "Doanh thu hôm nay", "Giá trị": data.dailyRevenue },
    { "Chỉ số": "Doanh thu tháng này", "Giá trị": data.monthlyRevenue },
  ];
  const summarySheet = XLSX.utils.json_to_sheet([
    { A: "Báo cáo Tổng quan Hệ thống" },
    { A: `Ngày: ${dayjs().format("DD/MM/YYYY")}` },
    {},
    ...summaryData,
  ], { skipHeader: true });
  summarySheet["!cols"] = [{ wch: 20 }, { wch: 30 }];
  applyCellFormatting(summarySheet, "A1", {
    font: { name: "Times New Roman", sz: 16, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
  });
  applyCellFormatting(summarySheet, "A2", {
    font: { name: "Times New Roman", sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
  });
  XLSX.utils.sheet_add_json(summarySheet, summaryData, {
    origin: "A4",
    header: ["Chỉ số", "Giá trị"],
  });
  for (let i = 0; i < summaryData.length; i++) {
    applyCellFormatting(summarySheet, `A${i + 4}`, headerStyle);
    applyCellFormatting(summarySheet, `B${i + 4}`, i === 1 || i === 6 || i === 7 ? currencyStyle(i) : dataStyle(i));
  }
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // Sheet 2: Revenue
  const revenueData = data.revenueData.map((item) => ({
    "Thời gian": item.month,
    "Doanh thu (VND)": item.value,
  }));
  const revenueTotal = revenueData.reduce((sum, item) => sum + item["Doanh thu (VND)"], 0);
  const revenueSheet = XLSX.utils.json_to_sheet([
    { A: "Báo cáo Tổng quan Hệ thống" },
    { A: `Ngày: ${dayjs().format("DD/MM/YYYY")}` },
    {},
    ...revenueData,
    { "Thời gian": "Tổng cộng", "Doanh thu (VND)": revenueTotal },
  ], { skipHeader: true });
  revenueSheet["!cols"] = calculateColumnWidths(revenueData);
  applyCellFormatting(revenueSheet, "A1", {
    font: { name: "Times New Roman", sz: 16, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
  });
  applyCellFormatting(revenueSheet, "A2", {
    font: { name: "Times New Roman", sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
  });
  XLSX.utils.sheet_add_json(revenueSheet, revenueData, {
    origin: "A4",
    header: ["Thời gian", "Doanh thu (VND)"],
  });
  for (let i = 0; i < revenueData.length + 1; i++) {
    applyCellFormatting(revenueSheet, `A${i + 4}`, headerStyle);
    applyCellFormatting(revenueSheet, `B${i + 4}`, currencyStyle(i));
  }
  XLSX.utils.book_append_sheet(wb, revenueSheet, "Revenue");

  // Sheet 3: OrderStatus
  const orderStatusData = data.orderStatusData.map((item) => ({
    "Trạng thái": item.type,
    "Số lượng": item.value,
  }));
  const orderStatusTotal = orderStatusData.reduce((sum, item) => sum + item["Số lượng"], 0);
  const orderStatusSheet = XLSX.utils.json_to_sheet([
    { A: "Báo cáo Tổng quan Hệ thống" },
    { A: `Ngày: ${dayjs().format("DD/MM/YYYY")}` },
    {},
    ...orderStatusData,
    { "Trạng thái": "Tổng cộng", "Số lượng": orderStatusTotal },
  ], { skipHeader: true });
  orderStatusSheet["!cols"] = calculateColumnWidths(orderStatusData);
  applyCellFormatting(orderStatusSheet, "A1", {
    font: { name: "Times New Roman", sz: 16, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
  });
  applyCellFormatting(orderStatusSheet, "A2", {
    font: { name: "Times New Roman", sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
  });
  XLSX.utils.sheet_add_json(orderStatusSheet, orderStatusData, {
    origin: "A4",
    header: ["Trạng thái", "Số lượng"],
  });
  for (let i = 0; i < orderStatusData.length + 1; i++) {
    applyCellFormatting(orderStatusSheet, `A${i + 4}`, headerStyle);
    applyCellFormatting(orderStatusSheet, `B${i + 4}`, numberStyle(i));
  }
  XLSX.utils.book_append_sheet(wb, orderStatusSheet, "OrderStatus");

  // Sheet 4: TopProducts
  const topProductsData = data.topProductsData.map((item) => ({
    "Tên sản phẩm": item.name,
    "Số lượng bán": item.sales,
  }));
  const topProductsSheet = XLSX.utils.json_to_sheet([
    { A: "Báo cáo Tổng quan Hệ thống" },
    { A: `Ngày: ${dayjs().format("DD/MM/YYYY")}` },
    {},
    ...topProductsData,
  ], { skipHeader: true });
  topProductsSheet["!cols"] = calculateColumnWidths(topProductsData);
  applyCellFormatting(topProductsSheet, "A1", {
    font: { name: "Times New Roman", sz: 16, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
  });
  applyCellFormatting(topProductsSheet, "A2", {
    font: { name: "Times New Roman", sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
  });
  XLSX.utils.sheet_add_json(topProductsSheet, topProductsData, {
    origin: "A4",
    header: ["Tên sản phẩm", "Số lượng bán"],
  });
  for (let i = 0; i < topProductsData.length; i++) {
    applyCellFormatting(topProductsSheet, `A${i + 4}`, headerStyle);
    applyCellFormatting(topProductsSheet, `B${i + 4}`, numberStyle(i));
  }
  XLSX.utils.book_append_sheet(wb, topProductsSheet, "TopProducts");

  // Sheet 5: UserGrowth
  const userGrowthData = data.userGrowthData.map((item) => ({
    "Thời gian": item.month,
    "Người dùng mới": item.newUsers,
    "Tổng người dùng": item.totalUsers,
  }));
  const userGrowthSheet = XLSX.utils.json_to_sheet([
    { A: "Báo cáo Tổng quan Hệ thống" },
    { A: `Ngày: ${dayjs().format("DD/MM/YYYY")}` },
    {},
    ...userGrowthData,
  ], { skipHeader: true });
  userGrowthSheet["!cols"] = calculateColumnWidths(userGrowthData);
  applyCellFormatting(userGrowthSheet, "A1", {
    font: { name: "Times New Roman", sz: 16, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
  });
  applyCellFormatting(userGrowthSheet, "A2", {
    font: { name: "Times New Roman", sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
  });
  XLSX.utils.sheet_add_json(userGrowthSheet, userGrowthData, {
    origin: "A4",
    header: ["Thời gian", "Người dùng mới", "Tổng người dùng"],
  });
  for (let i = 0; i < userGrowthData.length; i++) {
    applyCellFormatting(userGrowthSheet, `A${i + 4}`, headerStyle);
    applyCellFormatting(userGrowthSheet, `B${i + 4}`, numberStyle(i));
    applyCellFormatting(userGrowthSheet, `C${i + 4}`, numberStyle(i));
  }
  XLSX.utils.book_append_sheet(wb, userGrowthSheet, "UserGrowth");

  // Sheet 6: RecentOrders
  const recentOrdersData = data.recentOrders.map((item) => ({
    "Mã đơn": item.id,
    "Khách hàng": item.customer,
    "Ngày đặt": item.date,
    "Tổng tiền (VND)": item.amount,
    "Trạng thái": item.status,
  }));
  const recentOrdersSheet = XLSX.utils.json_to_sheet([
    { A: "Báo cáo Tổng quan Hệ thống" },
    { A: `Ngày: ${dayjs().format("DD/MM/YYYY")}` },
    {},
    ...recentOrdersData,
  ], { skipHeader: true });
  recentOrdersSheet["!cols"] = calculateColumnWidths(recentOrdersData);
  applyCellFormatting(recentOrdersSheet, "A1", {
    font: { name: "Times New Roman", sz: 16, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
  });
  applyCellFormatting(recentOrdersSheet, "A2", {
    font: { name: "Times New Roman", sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
  });
  XLSX.utils.sheet_add_json(recentOrdersSheet, recentOrdersData, {
    origin: "A4",
    header: ["Mã đơn", "Khách hàng", "Ngày đặt", "Tổng tiền (VND)", "Trạng thái"],
  });
  for (let i = 0; i < recentOrdersData.length; i++) {
    applyCellFormatting(recentOrdersSheet, `A${i + 4}`, headerStyle);
    applyCellFormatting(recentOrdersSheet, `B${i + 4}`, dataStyle(i));
    applyCellFormatting(recentOrdersSheet, `C${i + 4}`, dataStyle(i));
    applyCellFormatting(recentOrdersSheet, `D${i + 4}`, currencyStyle(i));
    applyCellFormatting(recentOrdersSheet, `E${i + 4}`, dataStyle(i));
  }
  XLSX.utils.book_append_sheet(wb, recentOrdersSheet, "RecentOrders");

  // Sheet 7: OutOfStock
  const outOfStockData = data.outOfStockProducts.map((item) => ({
    "Mã SP": item.id,
    "Tên sản phẩm": item.name,
    "Danh mục": item.category,
    "Thương hiệu": item.brand,
  }));
  const outOfStockSheet = XLSX.utils.json_to_sheet([
    { A: "Báo cáo Tổng quan Hệ thống" },
    { A: `Ngày: ${dayjs().format("DD/MM/YYYY")}` },
    {},
    ...outOfStockData,
  ], { skipHeader: true });
  outOfStockSheet["!cols"] = calculateColumnWidths(outOfStockData);
  applyCellFormatting(outOfStockSheet, "A1", {
    font: { name: "Times New Roman", sz: 16, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
  });
  applyCellFormatting(outOfStockSheet, "A2", {
    font: { name: "Times New Roman", sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
  });
  XLSX.utils.sheet_add_json(outOfStockSheet, outOfStockData, {
    origin: "A4",
    header: ["Mã SP", "Tên sản phẩm", "Danh mục", "Thương hiệu"],
  });
  for (let i = 0; i < outOfStockData.length; i++) {
    applyCellFormatting(outOfStockSheet, `A${i + 4}`, headerStyle);
    applyCellFormatting(outOfStockSheet, `B${i + 4}`, dataStyle(i));
    applyCellFormatting(outOfStockSheet, `C${i + 4}`, dataStyle(i));
    applyCellFormatting(outOfStockSheet, `D${i + 4}`, dataStyle(i));
  }
  XLSX.utils.book_append_sheet(wb, outOfStockSheet, "OutOfStock");

  // Thêm ghi chú ở dòng cuối mỗi sheet
  Object.keys(wb.Sheets).forEach((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const lastRow = XLSX.utils.sheet_to_json(ws).length + 5;
    XLSX.utils.sheet_add_aoa(ws, [[`Báo cáo được tạo bởi hệ thống vào ngày ${dayjs().format("DD/MM/YYYY")}`]], {
      origin: `A${lastRow}`,
    });
    applyCellFormatting(ws, `A${lastRow}`, {
      font: { name: "Times New Roman", sz: 10, italic: true },
      alignment: { horizontal: "left", vertical: "center" },
    });
  });

  // Xuất file
  XLSX.writeFile(wb, fileName);
};