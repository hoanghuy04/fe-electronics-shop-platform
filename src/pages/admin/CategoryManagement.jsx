"use client"

import { Button, Tag, Modal, Form, Input, message, Checkbox, Tooltip, Select } from "antd"
import {
  PencilLine,
  BarChart3,
  Package,
  FolderOpen,
  LayoutDashboard,
  Plus,
  Search,
  FolderX,
  FolderPlus,
  Eye,
  EyeOff,
} from "lucide-react"
import { use, useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Pie } from "@ant-design/charts"
import { ProductContext } from './../../hooks/ProductContext';

export default function CategoryManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add") // "add" hoặc "edit"
  const [selectedCategory, setSelectedCategory] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const { products, categories } = useContext(ProductContext)
  const [tableData, setTableData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [form] = Form.useForm()

  // Search filters
  const [filters, setFilters] = useState({
    name: "",
    status: "",
  })

  // Card 1: Total categories
  const totalCategories = () => tableData.length

  // Card 2: Category status
  const categoryStatus = () => {
    const active = tableData.filter((category) => category.active === 1).length
    const inactive = tableData.filter((category) => category.active === 0).length
    return { active, inactive }
  }

  // Card 3: Top categories by sales
  const topCategories = () => {
    // Calculate total sales for each category
    const categorySales = {}

    categories.forEach((category) => {
      const sales = products
        .filter((product) => product.category_id === category.id)
        .reduce((sum, product) => sum + product.total_sales, 0)

      categorySales[category.id] = {
        id: category.id,
        name: category.name,
        totalSales: sales,
        active: category.active,
      }
    })

    // Sort by total sales and get top 5
    return Object.values(categorySales)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5)
  }

  // Card 4: Product distribution by category (for pie chart)
  const productDistribution = () => {
    const distribution = {}

    categories.forEach((category) => {
      const count = products.filter((product) => product.category_id === category.id).length
      if (count > 0) {
        distribution[category.id] = {
          type: category.name,
          value: count,
        }
      }
    })

    return Object.values(distribution)
  }

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows)
  }

  const toggleCategoryStatus = async () => {
    if (selectedRows.length === 0) {
      message.warning("Vui lòng chọn ít nhất một danh mục!")
      return
    }

    try {
      // Toggle active status for selected categories
      const updatedCategories = tableData.map((category) => {
        if (selectedRows.some((row) => row.id === category.id)) {
          return { ...category, active: category.active === 1 ? 0 : 1 }
        }
        return category
      })

      setTableData(updatedCategories)
      setSelectedRows([])
      message.success(`Đã cập nhật trạng thái ${selectedRows.length} danh mục thành công`)
    } catch (error) {
      console.error("Failed to update categories:", error)
      message.error("Đã xảy ra lỗi khi cập nhật danh mục, vui lòng thử lại")
    }
  }

  useEffect(() => {
    setTableData(categories)
    setFilteredData(categories)
  }, [categories])

  // Apply filters to data
  useEffect(() => {
    let result = [...tableData]

    if (filters.name) {
      result = result.filter((item) => item.name.toLowerCase().includes(filters.name.toLowerCase()))
    }

    if (filters.status === "active") {
      result = result.filter((item) => item.active === 1)
    } else if (filters.status === "inactive") {
      result = result.filter((item) => item.active === 0)
    }

    setFilteredData(result)
  }, [filters, tableData])

  const showModal = (category = {}) => {
    setSelectedCategory(category)
    setModalMode(category.id ? "edit" : "add")
    setIsModalOpen(true)

    if (!category.id) {
      form.resetFields()
    }
  }

  const showAddCategoryModal = () => {
    showModal()
  }

  const handleOk = () => {
    form.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setModalMode("add")
    form.resetFields()
  }

  const onFinish = async (values) => {
    try {
      const categoryData = {
        ...values,
        active: values.active ? 1 : 0,
        created_date: new Date().toISOString(),
      }

      if (modalMode === "edit" && selectedCategory.id) {
        // Update existing category
        const updatedCategories = tableData.map((category) =>
          category.id === selectedCategory.id ? { ...category, ...categoryData } : category,
        )
        setTableData(updatedCategories)
        setIsModalOpen(false)
      } else {
        // Add new category
        const newCategory = {
          id: String(tableData.length + 1),
          ...categoryData,
        }
        setTableData([newCategory, ...tableData])
        setIsModalOpen(false)
      }

      form.resetFields()
      message.success(modalMode === "edit" ? "Cập nhật danh mục thành công" : "Thêm danh mục thành công")
    } catch (error) {
      console.log("Operation failed:", error)
      message.error("Đã xảy ra lỗi, vui lòng thử lại")
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
    message.error("Vui lòng kiểm tra lại thông tin")
  }

  const columns = [
    {
      name: "Tên danh mục",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center py-2">
          <FolderOpen className="mr-2 text-blue-500" size={18} />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: "Ngày tạo",
      selector: (row) => row.created_date,
      sortable: true,
      cell: (row) => new Date(row.created_date).toLocaleDateString("vi-VN"),
    },
    {
      name: "Số sản phẩm",
      selector: (row) => {
        const count = products.filter((product) => product.category_id === row.id).length
        return count
      },
      sortable: true,
    },
    {
      name: "Tổng doanh số",
      selector: (row) => {
        const sales = products
          .filter((product) => product.category_id === row.id)
          .reduce((sum, product) => sum + product.total_sales, 0)
        return sales
      },
      sortable: true,
      cell: (row) => {
        const sales = products
          .filter((product) => product.category_id === row.id)
          .reduce((sum, product) => sum + product.total_sales, 0)
        return <span>{sales} sản phẩm</span>
      },
    },
    {
      name: "Trạng thái",
      selector: (row) => row.active,
      sortable: true,
      cell: (row) => (
        <Tag color={row.active === 1 ? "green" : "red"}>{row.active === 1 ? "Đang hoạt động" : "Đã ẩn"}</Tag>
      ),
    },
    {
      name: "",
      cell: (row) => (
        <div className="flex justify-center">
          <Tooltip title="Chỉnh sửa">
            <PencilLine
              className="cursor-pointer text-blue-500 mr-2"
              size={18}
              onClick={() => {
                setSelectedCategory(row)
                showModal(row)
              }}
            />
          </Tooltip>
          <Tooltip title={row.active === 1 ? "Ẩn danh mục" : "Hiện danh mục"}>
            {row.active === 1 ? (
              <EyeOff
                className="cursor-pointer text-red-500"
                size={18}
                onClick={() => {
                  const updatedCategories = tableData.map((category) =>
                    category.id === row.id ? { ...category, active: 0 } : category,
                  )
                  setTableData(updatedCategories)
                }}
              />
            ) : (
              <Eye
                className="cursor-pointer text-green-500"
                size={18}
                onClick={() => {
                  const updatedCategories = tableData.map((category) =>
                    category.id === row.id ? { ...category, active: 1 } : category,
                  )
                  setTableData(updatedCategories)
                }}
              />
            )}
          </Tooltip>
        </div>
      ),
    },
  ]

  useEffect(() => {
    if (isModalOpen && modalMode === "edit" && selectedCategory.id) {
      form.setFieldsValue({
        ...selectedCategory,
        active: selectedCategory.active === 1,
      })
    }
  }, [selectedCategory, isModalOpen, modalMode, form])

  // Config for pie chart
  const pieConfig = {
    appendPadding: 10,
    data: productDistribution(),
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="space-y-6">
        {/* Modal for Adding/Editing */}
        <Modal
          title={modalMode === "edit" ? "Cập nhật danh mục" : "Thêm danh mục mới"}
          width={600}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="CategoryForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={modalMode === "add" ? { active: true } : {}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="horizontal"
          >
            <Form.Item
              label="Tên danh mục"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Slug" name="slug" rules={[{ required: true, message: "Vui lòng nhập slug" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Trạng thái" name="active" valuePropName="checked">
              <Checkbox>Đang hoạt động</Checkbox>
            </Form.Item>
          </Form>
        </Modal>

        {/* Overview Section */}
        <h2 className="font-bold text-xl flex items-center space-x-2 mb-2 pb-2 mt-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-gray-800 text-2xl">Tổng quan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Metrics */}
          <div className="space-y-6">
            {/* Card 1: Total Categories */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Tổng số danh mục</h3>
                <p className="text-3xl font-bold text-green-600">{totalCategories()}</p>
              </div>
            </div>

            {/* Card 2: Category Status */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Tình trạng danh mục</h3>
                <div className="flex gap-4">
                  <p className="text-xl font-bold text-blue-600">
                    {categoryStatus().active} <span className="text-sm font-normal">đang hoạt động</span>
                  </p>
                  <p className="text-xl font-bold text-red-500">
                    {categoryStatus().inactive} <span className="text-sm font-normal">đã ẩn</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Top Categories */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Top danh mục hoạt động mạnh nhất</h3>
              </div>
              <div className="space-y-4">
                {topCategories().map((category, index) => (
                  <div key={category.id} className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.active === 1 ? "Đang hoạt động" : "Đã ẩn"}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-900">{category.totalSales} sản phẩm đã bán</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FolderOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Phân bố sản phẩm theo danh mục</h3>
            </div>
            <div className="h-[400px]">
              <Pie {...pieConfig} />
            </div>
          </div>
        </div>

        <h2 className="font-bold text-xl flex items-center space-x-2 mt-8 mb-2 pb-2">
          <Plus className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-gray-800 text-2xl">Chi tiết danh mục</span>
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Search and Filter Section */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative col-span-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <Input
                placeholder="Tìm kiếm theo tên danh mục"
                className="pl-10"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>

            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              className="w-full col-span-2"
              onChange={(value) => setFilters({ ...filters, status: value || "" })}
            >
              <Select.Option value="active">Đang hoạt động</Select.Option>
              <Select.Option value="inactive">Đã ẩn</Select.Option>
            </Select>

            <div className="text-end mb-4">
              <div className="space-x-2 flex items-center justify-end gap-2">
                <Tooltip title="Thêm danh mục mới">
                  <Button onClick={showAddCategoryModal} type="primary" icon={<FolderPlus size={18} />}>
                  </Button>
                </Tooltip>

                <Tooltip title="Thay đổi trạng thái danh mục đã chọn">
                  <Button
                    onClick={toggleCategoryStatus}
                    disabled={selectedRows.length === 0}
                    icon={<FolderX size={18} />}
                  >
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={8}
            paginationRowsPerPageOptions={[8, 16, 24]}
            highlightOnHover
            noDataComponent="Không tìm thấy danh mục nào"
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            selectableRowsHighlight
            customStyles={{
              headCells: {
                style: {
                  fontWeight: "bold",
                  color: "#2563eb",
                },
              },
              cells: {
                style: {
                  color: "#374151",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
