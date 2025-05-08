import { useContext } from "react";
import { DualAxes } from "@ant-design/charts";
import { ProductContext } from './../hooks/ProductContext';

export default function CategoryProductChart() {
  const { products, categories } = useContext(ProductContext);

  // Transform data for active and inactive products (similar to uvBillData)
  const productStatusData = categories.flatMap((category) => [
    {
      category: category.name,
      value: products.filter(
        (product) => product.category_id == category.id && product.status === "active"
      ).length,
      type: "Active Products",
    },
    {
      category: category.name,
      value: products.filter(
        (product) => product.category_id === category.id && product.active === 0
      ).length,
      type: "Inactive Products",
    },
  ]).filter((item) => item.value > 0); // Only include categories with products

  // Transform data for total products per category (similar to transformData)
  const totalProductData = categories
    .map((category) => ({
      category: category.name,
      count: products.filter((product) => product.category_id === category.id).length,
    }))
    .filter((item) => item.count > 0); // Only include categories with products

  // Chart configuration
  const config = {
    xField: "category",
    children: [
      {
        data: productStatusData,
        type: "interval",
        yField: "value",
        stack: true,
        colorField: "type",
        color: ["#52c41a", "#ff4d4f"], // Green for active, red for inactive
        style: { maxWidth: 80 },
        scale: { y: { domainMax: Math.max(...productStatusData.map((d) => d.value)) * 1.2 || 10 } },
        interaction: { elementHighlight: { background: true } },
        label: {
          position: "middle",
          content: (item) => (item.value > 0 ? item.value : ""),
        },
        tooltip: {
          title: (item) => `${item.category} - ${item.type}`,
          items: [{ field: "value", name: "Số lượng" }],
        },
      },
      {
        data: totalProductData,
        type: "line",
        yField: "count",
        colorField: () => "Total Products",
        color: "#1890ff", // Blue for total products
        style: { lineWidth: 2 },
        axis: { y: { position: "right", title: { text: "Tổng sản phẩm" } } },
        interaction: {
          tooltip: {
            crosshairs: false,
            marker: false,
            title: (item) => `${item.category} - Tổng sản phẩm`,
            items: [{ field: "count", name: "Số lượng" }],
          },
        },
        label: {
          position: "top",
          content: (item) => item.count,
        },
      },
    ],
    legend: {
      color: {
        position: "top",
        layout: { justifyContent: "center" },
      },
    },
    tooltip: {
      shared: true,
      showCrosshairs: false,
    },
  };

  return (
    <div style={{ height: "400px", width: "100%", position: "relative" }}>
      {productStatusData.length === 0 ? (
        <div>Không có dữ liệu để hiển thị biểu đồ</div>
      ) : (
        <DualAxes {...config} />
      )}
    </div>
  );
}