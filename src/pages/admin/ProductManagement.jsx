import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, message } from "antd";
import axios from "axios";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";

const ProductManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const { products, loading } = useContext(AdminContext);
  // Cấu hình cột cho Table
  const columns = [
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Laptop", value: "Laptop" },
        { text: "Điện thoại", value: "Phone" },
        { text: "Phụ kiện", value: "Accessory" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      filters: [
        { text: "ASUS", value: "ASUS" },
        { text: "Apple", value: "Apple" },
        { text: "Sony", value: "Sony" },
      ],
      onFilter: (value, record) => record.brand === value,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  // Xử lý thêm sản phẩm
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Xử lý sửa sản phẩm
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      message.error("Lỗi khi xóa sản phẩm");
    }
  };

  // Xử lý submit form
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        const response = await axios.put(
          `http://localhost:3000/products/${editingProduct.id}`,
          values
        );
        setProducts(
          products.map((product) =>
            product.id === editingProduct.id ? response.data : product
          )
        );
        message.success("Cập nhật sản phẩm thành công");
      } else {
        const response = await axios.post("http://localhost:3000/products", {
          ...values,
          id: products.length + 1, // Tạm thời tạo ID giả
        });
        setProducts([...products, response.data]);
        message.success("Thêm sản phẩm thành công");
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error("Lỗi khi lưu sản phẩm");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Button type="primary" onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select>
              <Select.Option value="Laptop">Laptop</Select.Option>
              <Select.Option value="Phone">Điện thoại</Select.Option>
              <Select.Option value="Accessory">Phụ kiện</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="brand"
            label="Thương hiệu"
            rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
          >
            <Select>
              <Select.Option value="ASUS">ASUS</Select.Option>
              <Select.Option value="Apple">Apple</Select.Option>
              <Select.Option value="Sony">Sony</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;