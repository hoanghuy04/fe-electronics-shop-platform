"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer } from "@/components/ui/chart"

// Giả định dữ liệu mẫu - thay thế bằng dữ liệu thực tế của bạn
const sampleData = [
  { category_name: "Điện thoại", active: 1200, inactive: 300 },
  { category_name: "Laptop", active: 800, inactive: 200 },
  { category_name: "Máy tính bảng", active: 600, inactive: 150 },
  { category_name: "Phụ kiện", active: 400, inactive: 100 },
  { category_name: "Đồng hồ", active: 300, inactive: 50 },
]

export default function CategorySalesChart({ data = sampleData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-yellow-100 p-3 rounded-full mr-4">
          {/* Thay thế bằng icon FolderOpen của lucide-react */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-yellow-600"
          >
            <path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1" />
            <path d="M5 19h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Phân bố sản phẩm theo danh mục</h3>
      </div>
      <div className="h-[500px]">
        <ChartContainer
          config={{
            active: {
              label: "Đang hoạt động",
              color: "hsl(142, 76%, 36%)", // Green color
            },
            inactive: {
              label: "Ngừng hoạt động",
              color: "hsl(0, 84%, 60%)", // Red color
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category_name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, name === "active" ? "Đang hoạt động" : "Ngừng hoạt động"]}
                labelFormatter={(label) => `Danh mục: ${label}`}
              />
              <Legend formatter={(value) => (value === "active" ? "Đang hoạt động" : "Ngừng hoạt động")} />
              <Bar dataKey="active" stackId="a" fill="var(--color-active)" />
              <Bar dataKey="inactive" stackId="a" fill="var(--color-inactive)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
