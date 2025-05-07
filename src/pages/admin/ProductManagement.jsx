import { Button, Tag, Modal, Form, Input, Select, Upload, message } from "antd"
import { PencilLine, BarChart3, Package, ShoppingBag, DollarSign, TagIcon, LayoutDashboard, Plus, CloudUpload  } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { ProductContext } from "../../hooks/ProductContext"

const columnWidth = "calc(100% / 9)";

export default function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})
  const { categories, products } = useContext(ProductContext)
  const [tableData, setTableData] = useState(products)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])

  // Card 1: Total products
  const totalProducts = () => tableData.length

  // Card 2: In stock / out of stock products
  const stockStatus = () => {
    const inStock = tableData.filter((product) => product.stock > 0).length
    const outOfStock = tableData.filter((product) => product.stock === 0).length
    return { inStock, outOfStock }
  }

  // Card 3: Products by category
  const productsByCategory = () => {
    const categoryCounts = {}
    tableData.forEach((product) => {
      const categoryName = categories.find((category) => category.id == product.category_id)?.name || "Khác"
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
    })

    return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
      .reduce((acc, [category, count]) => {
        acc[category] = count
        return acc
      }, {})
  }

  // Card 4: Top products
  const topProducts = () => {
    return [...tableData].sort((a, b) => b.total_sales - a.total_sales).slice(0, 5)
  }

  // Card 5: Price range or average price
  const priceMetrics = () => {
    if (tableData.length === 0) return { avg: 0, min: 0, max: 0 }

    const prices = tableData.map((product) => product.price)
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    return { avg, min, max }
  }

  const showModal = (product = {}) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
    // Khởi tạo fileList cho ảnh hiện có
    setFileList(
      product.image_url
        ? product.image_url.map((url, index) => ({
            uid: index,
            name: `image-${index}.jpg`,
            status: "done",
            url,
          }))
        : []
    )
  }

  const showAddProductModal = () => {
    setSelectedProduct({})
    setIsAddModalOpen(true)
    setFileList([])
  }

  const handleOk = () => {
    form.submit()
  }

  const handleAddOk = () => {
    form.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsAddModalOpen(false)
    form.resetFields()
    setFileList([])
  }

  // Hàm chuyển object description thành chuỗi
  const formatDescription = (description) => {
    if (!description || typeof description !== "object") return ""
    return Object.entries(description)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
  }

  // Hàm chuyển chuỗi description thành object
  const parseDescription = (descriptionStr) => {
    if (!descriptionStr) return {}
    const descriptionObj = {}
    descriptionStr.split("\n").forEach((line) => {
      const [key, value] = line.split(":").map((item) => item.trim())
      if (key && value) descriptionObj[key] = value
    })
    return descriptionObj
  }

  // Xử lý upload ảnh lên Cloudinary
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "images") // Thay bằng upload preset của bạn
    formData.append("folder", "products")

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dnsallii0/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.secure_url) {
        onSuccess(null, { url: data.secure_url })
      } else {
        onError(new Error("Upload failed"))
      }
    } catch (error) {
      onError(error)
    }
  }

  // Xử lý thay đổi fileList
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
  }

  const onFinish = async (values) => {
    try {
      // Chuyển description từ chuỗi thành object
      const descriptionObj = parseDescription(values.description)

      // Lấy danh sách URL ảnh từ fileList
      const imageUrls = fileList
        .filter((file) => file.status === "done")
        .map((file) => file.url || file.response?.url)
        .filter(Boolean)

      const productData = {
        ...values,
        description: descriptionObj,
        image_url: imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"],
      }

      if (selectedProduct.id) {
        // Cập nhật sản phẩm
        console.log("Updating product:", { ...selectedProduct, ...productData })
        const updatedProducts = tableData.map((product) =>
          product.id === selectedProduct.id ? { ...product, ...productData } : product
        )
        setTableData(updatedProducts)
        setIsModalOpen(false)
      } else {
        // Thêm sản phẩm mới
        console.log("Adding new product:", productData)
        const newProduct = {
          id: String(tableData.length + 1),
          ...productData,
          created_at: new Date().toISOString(),
          total_sales: 0,
        }
        setTableData([newProduct, ...tableData])
        setIsAddModalOpen(false)
      }
      form.resetFields()
      setFileList([])
      message.success(selectedProduct.id ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công")
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
      name: "Sản phẩm",
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <img
            src={row.image_url && row.image_url[0] ? row.image_url[0] : "/placeholder.svg"}
            alt={row.title}
            className="w-10 h-10 object-cover rounded"
          />
          <span className="truncate w-full">{row.title}</span>
        </div>
      ),
    },
    {
      name: "Giá",
      width: columnWidth,
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold">{(row.price * (1 - row.discount)).toLocaleString("vi-VN")}đ</div>
          {row.discount > 0 && (
            <div className="text-sm text-gray-500 line-through">{row.price.toLocaleString("vi-VN")}đ</div>
          )}
        </div>
      ),
    },
    {
      name: "Danh mục",
      width: columnWidth,
      selector: (row) => categories.find((category) => category.id == row.category_id)?.name || "Khác",
      sortable: true,
    },
    {
      name: "Thương hiệu",
      width: columnWidth,
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Tồn kho",
      width: columnWidth,
      selector: (row) => row.stock,
      sortable: true,
      cell: (row) => (
        <Tag color={row.stock > 0 ? "green" : "red"}>{row.stock > 0 ? `${row.stock} sản phẩm` : "Hết hàng"}</Tag>
      ),
    },
    {
      name: "Đã bán",
      width: columnWidth,
      center: true,
      selector: (row) => row.total_sales || 0,
      sortable: true,
    },
    {
      name: "",
      width: columnWidth,
      center: true,
      cell: (row) => (
        <div className="flex justify-center">
          <PencilLine
            className="cursor-pointer"
            onClick={() => {
              setSelectedProduct(row)
              showModal(row)
            }}
          />
          <span style={{ display: "none" }}>{row.id}</span>
        </div>
      ),
    },
  ]

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (isModalOpen && selectedProduct.id) {
      form.setFieldsValue({
        ...selectedProduct,
        category_id: selectedProduct.category_id,
        description: formatDescription(selectedProduct.description),
      })
    }
  }, [selectedProduct, isModalOpen, form])

  return (
    <div className="p-6 bg-gray-100">
      <div className="space-y-6">
        {/* Modal for Editing */}
        <Modal
          title="Cập nhật thông tin sản phẩm"
          width={800}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="ProductInfo"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="grid grid-cols-2 gap-x-4"
          >
            <Form.Item
              label="Tên sản phẩm"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              className="col-span-2"
            >
              <Input />
            </Form.Item>

            <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá" }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item label="Giảm giá" name="discount" rules={[{ required: true, message: "Vui lòng nhập giảm giá" }]}>
              <Input type="number" step="0.01" min="0" max="1" />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="category_id"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select>
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Thương hiệu"
              name="brand"
              rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tồn kho"
              name="stock"
              rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
            >
              <Input type="number" min="0" />
            </Form.Item>

            <Form.Item
              label="Đã bán"
              name="total_sales"
              rules={[{ required: true, message: "Vui lòng nhập số lượng đã bán" }]}
            >
              <Input type="number" min="0" />
            </Form.Item>

            <Form.Item
              label="Ảnh sản phẩm"
              name="image_url"
              className="col-span-2"
            >
              <Upload
                multiple
                customRequest={handleUpload}
                fileList={fileList}
                onChange={handleFileChange}
                listType="picture"
                accept="image/*"
              >
                <Button icon={<CloudUpload  />}>Tải lên ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Mô tả" name="description" className="col-span-2">
              <Input.TextArea
                rows={6}
                placeholder="CPU: Intel Core i7\nRAM: 16GB\nSSD: 512GB"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Adding */}
        <Modal
          title="Thêm sản phẩm mới"
          width={800}
          open={isAddModalOpen}
          onOk={handleAddOk}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="AddProduct"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ discount: 0, stock: 0, total_sales: 0 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="grid grid-cols-2 gap-x-4"
          >
            <Form.Item
              label="Tên sản phẩm"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              className="col-span-2"
            >
              <Input />
            </Form.Item>

            <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá" }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item label="Giảm giá" name="discount" rules={[{ required: true, message: "Vui lòng nhập giảm giá" }]}>
              <Input type="number" step="0.01" min="0" max="1" />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="category_id"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select>
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Thương hiệu"
              name="brand"
              rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tồn kho"
              name="stock"
              rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
            >
              <Input type="number" min="0" />
            </Form.Item>

            <Form.Item label="Slug" name="slug" rules={[{ required: true, message: "Vui lòng nhập slug" }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Ảnh sản phẩm"
              name="image_url"
              className="col-span-2"
            >
              <Upload
                multiple
                customRequest={handleUpload}
                fileList={fileList}
                onChange={handleFileChange}
                listType="picture"
                accept="image/*"
              >
                <Button icon={<CloudUpload  />}>Tải lên ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Mô tả" name="description" className="col-span-2">
              <Input.TextArea
                rows={6}
                placeholder="CPU: Intel Core i7\nRAM: 16GB\nSSD: 512GB"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Overview Section */}
        <h2 className="font-bold text-xl flex items-center space-x-2 mb-2 pb-2 mt-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-gray-800 text-2xl">Overview</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Tổng sản phẩm</h3>
              <p className="text-3xl font-bold text-green-600">{totalProducts()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Tình trạng kho</h3>
              <div className="flex gap-4">
                <p className="text-xl font-bold text-blue-600">
                  {stockStatus().inStock} <span className="text-sm font-normal">còn hàng</span>
                </p>
                <p className="text-xl font-bold text-red-500">
                  {stockStatus().outOfStock} <span className="text-sm font-normal">hết hàng</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Khoảng giá</h3>
              <p className="text-xl font-bold text-red-600">
                {priceMetrics().avg.toLocaleString("vi-VN")}đ <span className="text-sm font-normal">trung bình</span>
              </p>
              <p className="text-sm text-gray-500">
                {priceMetrics().min.toLocaleString("vi-VN")}đ - {priceMetrics().max.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <TagIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Số lượng theo danh mục</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(productsByCategory()).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700">{category}</span>
                  <div className="flex items-center">
                    <div className="w-40 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-yellow-500 h-2.5 rounded-full"
                        style={{ width: `${(count / totalProducts()) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Top sản phẩm</h3>
            </div>
            <div className="space-y-4">
              {topProducts().map((product, index) => (
                <div key={product.id} className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold text-purple-600">{index + 1}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-medium text-gray-900">({product.total_sales}) đã bán</p>
                    <p className="text-xs text-gray-500">
                      {(product.price * (1 - product.discount)).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="font-bold text-xl flex items-center space-x-2 mt-8 mb-2 pb-2">
          <Plus className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-gray-800 text-2xl">Chi tiết sản phẩm</span>
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-end mb-4">
            <div className="space-x-2">
              <Button type="primary" onClick={showAddProductModal}>
                Thêm sản phẩm
              </Button>
              <Button type="default">Nhập file</Button>
              <Button type="primary" style={{ backgroundColor: "#2563eb", borderColor: "#2563eb", marginLeft: "8px" }}>
                Xuất file
              </Button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={tableData}
            pagination
            paginationPerPage={8}
            paginationRowsPerPageOptions={[8, 16, 24]}
            highlightOnHover
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