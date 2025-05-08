import { Button, Tag, Modal, Form, Input, Select, Upload, message, Checkbox } from "antd";
import {
  PencilLine,
  BarChart3,
  Package,
  ShoppingBag,
  DollarSign,
  TagIcon,
  LayoutDashboard,
  Plus,
  CloudUpload,
  Search,
  PackagePlus,
  PackageMinus,
  PackageX,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ProductContext } from "../../hooks/ProductContext";
import { productService } from "../../services/product.service";

const columnWidth = "calc(100% / 9)";

export default function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" hoặc "edit"
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const { categories, products, brands, loading } = useContext(ProductContext);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Search filters
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    brand: "",
    stock: "",
  });

  // Card 1: Total products
  const totalProducts = () => tableData.length;

  // Card 2: In stock / out of stock products
  const stockStatus = () => {
    const inStock = tableData.filter((product) => product.stock > 0).length;
    const outOfStock = tableData.filter((product) => product.stock === 0).length;
    return { inStock, outOfStock };
  };

  // Card 3: Products by category
  const productsByCategory = () => {
    const categoryCounts = {};
    tableData.forEach((product) => {
      const categoryName = categories.find((category) => category.id == product.category_id)?.name || "Khác";
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [category, count]) => {
        acc[category] = count;
        return acc;
      }, {});
  };

  // Card 4: Top products
  const topProducts = () => {
    return [...tableData].sort((a, b) => b.total_sales - a.total_sales).slice(0, 5);
  };

  // Card 5: Price range or average price
  const priceMetrics = () => {
    if (tableData.length === 0) return { avg: 0, min: 0, max: 0 };

    const prices = tableData.map((product) => product.price);
    const avg = prices.reduce((sum, price) => sum + price / prices.length, 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { avg, min, max };
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const inactiveProducts = async () => {
    if (selectedRows.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để ngừng bán!");
      return;
    }

    try {
      const updatePromises = selectedRows.map((product) =>
        productService.updateProduct(product.id, { ...product, status: "inactive" })
      );
      const updatedProducts = await Promise.all(updatePromises);

      // Cập nhật tableData với các sản phẩm đã được cập nhật
      setTableData((prevData) =>
        prevData.map((product) => {
          const updatedProduct = updatedProducts.find((up) => up.id === product.id);
          return updatedProduct || product;
        })
      );

      // Reset selectedRows
      setSelectedRows([]);
      message.success(`Đã ngừng bán ${updatedProducts.length} sản phẩm thành công`);
    } catch (error) {
      console.error("Failed to update products:", error);
      message.error("Đã xảy ra lỗi khi ngừng bán sản phẩm, vui lòng thử lại");
    }
  };

  useEffect(() => {
    if (!loading) {
      setTableData(products);
      setFilteredData(products);
    }
  }, [loading, products]);

  // Apply filters to data
  useEffect(() => {
    let result = [...tableData];

    if (filters.name) {
      result = result.filter((item) => item.title.toLowerCase().includes(filters.name.toLowerCase()));
    }

    if (filters.category) {
      result = result.filter((item) => {
        const categoryName = categories.find((cat) => cat.id == item.category_id)?.name || "";
        return categoryName.toLowerCase().includes(filters.category.toLowerCase());
      });
    }

    if (filters.brand) {
      result = result.filter((item) => {
        const brandName = brands.find((brand) => brand.name == item.brand)?.name || "";
        return brandName.toLowerCase().includes(filters.brand.toLowerCase());
      });
    }

    if (filters.stock === "inStock") {
      result = result.filter((item) => item.stock > 0);
    } else if (filters.stock === "outOfStock") {
      result = result.filter((item) => item.stock === 0);
    }

    setFilteredData(result);
  }, [filters, tableData, categories]);

  const showModal = (product = {}) => {
    setSelectedProduct(product);
    setModalMode(product.id ? "edit" : "add");
    setIsModalOpen(true);
    setFileList(
      product.image_url
        ? product.image_url.map((url, index) => ({
            uid: index,
            name: `image-${index}.jpg`,
            status: "done",
            url,
          }))
        : []
    );
    if (!product.id) {
      form.resetFields();
    }
  };

  const showAddProductModal = () => {
    showModal();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalMode("add");
    form.resetFields();
    setFileList([]);
  };

  // Hàm chuyển object description thành chuỗi
  const formatDescription = (description) => {
    if (!description || typeof description !== "object") return "";
    return Object.entries(description)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  };

  // Hàm chuyển chuỗi description thành object
  const parseDescription = (descriptionStr) => {
    if (!descriptionStr) return {};
    const descriptionObj = {};
    descriptionStr.split("\n").forEach((line) => {
      const [key, value] = line.split(":").map((item) => item.trim());
      if (key && value) descriptionObj[key] = value;
    });
    return descriptionObj;
  };

  // Xử lý upload ảnh lên Cloudinary
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images");
    formData.append("folder", "products");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dnsallii0/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        onSuccess({ url: data.secure_url }, file);
      } else {
        onError(new Error("Upload failed"));
      }
    } catch (error) {
      onError(error);
      message.error(`Upload ảnh thất bại: ${error.message}`);
    }
  };

  // Xử lý thay đổi fileList
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    console.log(values);
    
    try {
      // Chuyển description từ chuỗi thành object
      const descriptionObj = parseDescription(values.description);

      // Lấy danh sách URL ảnh từ fileList
      const imageUrls = fileList
        .filter((file) => file.status === "done")
        .map((file) => file.response?.url || file.url)
        .filter(Boolean);

      const productData = {
        ...values,
        status: values.status ? "active" : "inactive",
        description: descriptionObj,
        image_url: imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"],
      };

      if (modalMode === "edit" && selectedProduct.id) {
        // Cập nhật sản phẩm
        const updatedProduct = await productService.updateProduct(selectedProduct.id, productData);
        console.log("Updated product:", updatedProduct);
        const updatedProducts = tableData.map((product) =>
          product.id === selectedProduct.id ? updatedProduct : product
        );
        setTableData(updatedProducts);
        setIsModalOpen(false);
      } else {
        // Thêm sản phẩm mới
        const newProduct = await productService.addProduct(productData);
        console.log("Added new product:", newProduct);
        setTableData([newProduct, ...tableData]);
        setIsModalOpen(false);
      }
      form.resetFields();
      setFileList([]);
      message.success(modalMode === "edit" ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công");
    } catch (error) {
      console.log("Operation failed:", error);
      message.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại thông tin");
  };

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
      width: "100px",
      // center: true,
      selector: (row) => row.total_sales || 0,
      sortable: true,
    },
    {
      name: "Trạng thái",
      width: columnWidth,
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Tag color={row.status === "active" ? "orange" : "red"}>
          {row.status === "active" ? "Đang bán" : "Ngừng bán"}
        </Tag>
      ),
    },
    {
      name: "",
      width: columnWidth,
      // center: true,
      cell: (row) => (
        <div className="flex justify-center">
          <PencilLine
            className="cursor-pointer"
            onClick={() => {
              setSelectedProduct(row);
              showModal(row);
            }}
          />
          <span style={{ display: "none" }}>{row.id}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    if (isModalOpen && modalMode === "edit" && selectedProduct.id) {
      form.setFieldsValue({
        ...selectedProduct,
        category_id: selectedProduct.category_id,
        brand: selectedProduct.brand,
        status: selectedProduct.status === "active",
        description: formatDescription(selectedProduct.description),
      });
    }
  }, [selectedProduct, isModalOpen, modalMode, form]);

  return (
    <div className="p-6 bg-gray-100">
      <div className="space-y-6">
        {/* Modal for Adding/Editing */}
        <Modal
          title={modalMode === "edit" ? "Cập nhật thông tin sản phẩm" : "Thêm sản phẩm mới"}
          width={800}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="ProductForm"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValues={modalMode === "add" ? { discount: 0, stock: 0, total_sales: 0, status: true } : {}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="horizontal"
          >
            <Form.Item
              label="Tên sản phẩm"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            >
              <Input />
            </Form.Item>

            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label="Giá"
                name="price"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <Input type="number" min="0" />
              </Form.Item>

              <Form.Item
                label="Giảm giá"
                name="discount"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: "Vui lòng nhập giảm giá" }]}
              >
                <Input type="number" step="0.01" min="0" max="1" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label="Danh mục"
                name="category_id"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
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
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
              >
                <Select>
                  {brands.map((brand) => (
                    <Select.Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label="Tồn kho"
                name="stock"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
              >
                <Input type="number" min="0" />
              </Form.Item>

              <Form.Item
                label={modalMode === "edit" ? "Đã bán" : "Slug"}
                name={modalMode === "edit" ? "total_sales" : "slug"}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: `Vui lòng nhập ${modalMode === "edit" ? "số lượng đã bán" : "slug"}` }]}
              >
                <Input type={modalMode === "edit" ? "number" : "text"} min={modalMode === "edit" ? "0" : undefined} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label="Trạng thái"
                name="status"
                valuePropName="checked"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Checkbox>Đang hoạt động</Checkbox>
              </Form.Item>
            </div>

            <Form.Item label="Ảnh sản phẩm" name="image_url">
              <Upload
                multiple
                customRequest={handleUpload}
                fileList={fileList}
                onChange={handleFileChange}
                listType="picture-card"
                accept="image/*"
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                  showDownloadIcon: false,
                }}
              >
                <div>
                  <CloudUpload className="mx-auto h-5 w-5" />
                  <div className="mt-2">Tải lên</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea
                rows={6}
                placeholder="CPU: Intel Core i7
RAM: 16GB
SSD: 512GB"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Overview Section */}
        <h2 className="font-bold text-xl flex items-center space-x-2 mb-2 pb-2 mt-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-gray-800 text-2xl">Tổng quan</span>
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
                {priceMetrics().avg.toLocaleString("vi-VN").split(",")[0]} ₫{" "}
                <span className="text-sm font-normal">trung bình</span>
              </p>
              <p className="text-sm text-gray-500">
                {priceMetrics().min.toLocaleString("vi-VN").split(",")[0]} ₫ -{" "}
                {priceMetrics().max.toLocaleString("vi-VN").split(",")[0]} ₫
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
          {/* Search and Filter Section */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="relative col-span-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm"
                className="pl-10"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>

            <Select
              placeholder="Lọc theo danh mục"
              allowClear
              className="w-full col-span-2"
              onChange={(value) => setFilters({ ...filters, category: value || "" })}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.name}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Lọc theo thương hiệu"
              allowClear
              className="w-full col-span-2"
              onChange={(value) => setFilters({ ...filters, brand: value || "" })}
            >
              {brands.map((brand) => (
                <Select.Option key={brand.id} value={brand.name}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Lọc theo tồn kho"
              allowClear
              className="w-full col-span-2"
              onChange={(value) => setFilters({ ...filters, stock: value || "" })}
            >
              <Select.Option value="inStock">Còn hàng</Select.Option>
              <Select.Option value="outOfStock">Hết hàng</Select.Option>
            </Select>

            <div className="text-end mb-4">
              <div className="space-x-2 flex items-center justify-end gap-2">
                <Button onClick={showAddProductModal} className="">
                  <PackagePlus />
                </Button>

                <Button
                  onClick={inactiveProducts}
                  className=""
                  disabled={selectedRows.length === 0}
                  danger
                >
                  <PackageX />
                </Button>
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
            noDataComponent="Không tìm thấy sản phẩm nào"
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
  );
}