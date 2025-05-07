import { Button, Form, Input, Modal, message, Skeleton, Tag } from "antd";
import { Plus, LayoutDashboard, PencilLine, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { generateSlug } from "../../utils/slugUtils";
import { brandService } from "../../services/brand.service";

export default function BrandManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);

    const [brands, countMap, salesMap] = await Promise.all([
      brandService.getAllBrands(),
      brandService.countProductsPerBrand(),
      brandService.sumTotalSalesPerBrand(),
    ]);

    const updated = await Promise.all(
      brands.map(async (b) => {
        const avgPrice = await brandService.getAveragePriceByBrand(b.name);
        const totalRevenue = await brandService.getRevenueByBrand(b.name);
        return {
          ...b,
          totalProducts: countMap[b.name.toUpperCase()] || 0,
          totalSales: salesMap[b.name.toUpperCase()] || 0,
          avgPrice,
          totalRevenue,
        };
      })
    );
    setBrands(updated);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm)
  );

  const showModal = (brand = null) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
    form.setFieldsValue(brand || { name: "", slug: "" });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    if (selectedBrand) {
      console.log(selectedBrand.id);
      values.created_date = selectedBrand.created_date;
      const result = await brandService.updateBrand(selectedBrand.id, values);
      if (result) message.success("Cập nhật thương hiệu thành công");
    } else {
      try {
        await brandService.createBrand(values);
        message.success("Thêm thương hiệu thành công");
      } catch (err) {
        message.error(err.message || "Đã xảy ra lỗi");
        return;
      }
    }
    fetchBrands();
    handleCancel();
  };

  const columns = [
    {
      name: "Tên thương hiệu",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: "Ngày tạo",
      selector: (row) => {
        const [year, month, day] = row.created_date.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
      },
      sortable: true,
    },
    {
      name: "Giá trung bình",
      selector: (row) => row.avgPrice?.toLocaleString("vi-VN") ?? "0",
      sortable: true,
    },
    {
      name: "Tổng sản phẩm",
      selector: (row) => row.totalProducts ?? 0,
      sortable: true,
    },
    {
      name: "Tổng đã bán",
      selector: (row) => row.totalSales ?? 0,
      sortable: true,
    },
    {
      name: "Doanh thu",
      selector: (row) => row.totalRevenue?.toLocaleString("vi-VN") ?? "0",
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) =>
        row.active ? (
          <Tag color="orange">Đang bán</Tag>
        ) : (
          <Tag color="red">Ngừng bán</Tag>
        ),
      sortable: true,
    },
    {
      name: "Hành động",
      center: "true",
      cell: (row) => (
        <div className="flex items-center">
          <Button type="link" onClick={() => showModal(row)}>
            <PencilLine className="text-title w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="font-bold text-xl flex items-center space-x-2 mb-4">
        <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
        <span className="text-gray-800 text-2xl">Tổng quan</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* <OverviewItem
          title="Top thương hiệu bán chạy"
          value={topBrand ? `${topBrand.name} - ${topBrand.total}` : "—"}
          icon={<ShoppingCart className="h-6 w-6 text-orange-600" />}
          iconBgClass="bg-orange-100"
          valueColorClass="text-orange-600"
          loading={loading}
        /> */}
      </div>

      <h2 className="font-bold text-xl flex items-center space-x-2 mt-8 mb-2 pb-2">
        <Plus className="h-6 w-6 text-blue-600 mr-2" />
        <span className="text-gray-800 text-2xl">Chi tiết hãng</span>
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md ">
        <div className="grid grid-cols-12 gap-3">
          <Input
            placeholder="Tìm kiếm theo tên..."
            allowClear
            onChange={handleSearch}
            className="col-span-2 h-8"
          />

          <div className="col-span-8"></div>

          <div className="col-span-2 text-end mb-4">
            <Button onClick={() => showModal()}>
              <PackagePlus className="mr-2" />
            </Button>
          </div>
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredBrands}
            pagination
            paginationPerPage={4}
            paginationRowsPerPageOptions={[4, 8, 16]}
            paginationComponentOptions={{
              rowsPerPageText: "Số hãng mỗi trang:",
              rangeSeparatorText: "/",
              selectAllRowsItem: false,
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

      <Modal
        title={selectedBrand ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={(changed) => {
            if ("name" in changed && !selectedBrand) {
              const nameValue = changed.name || "";
              form.setFieldsValue({
                slug: nameValue ? generateSlug(nameValue) : "",
              });
            }
          }}
        >
          <Form.Item
            label="Tên thương hiệu"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Vui lòng nhập slug" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
