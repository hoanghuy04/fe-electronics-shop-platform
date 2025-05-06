import { Button, Tag, Modal, Form, Input, Checkbox } from 'antd';
import { PencilLine } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { userApi } from '../../services/user.service';
import { authApi } from '../../services/auth.service';
import { DashboardOutlined, PlusOutlined, CaretUpOutlined } from '@ant-design/icons';

export default function UserManagement() {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [form] = Form.useForm();

  const totalUsers = () => tableData.length;

  const newUsers = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return tableData.filter((user) => {
      const createdDate = new Date(user.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;
  };

  const showModal = (user = {}) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const showAddCustomerModal = () => {
    setSelectedUser({});
    setIsAddModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleAddOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      if (selectedUser.id) {
        // Update existing user
        const response = await userApi.updateProfile(selectedUser.id, {
          ...values,
          status: values.status ? "active" : "inactive",
          address: [{ street: values.address, default: 1 }],
        });
        if (response) {
          setIsModalOpen(false);
          form.resetFields();
          const users = await userApi.getAllUsers();
          setTableData(users.slice().reverse());
        }
      } else {
        // Add new user
        const [firstName, ...lastNameParts] = values.name.split(" ");
        const lastName = lastNameParts.join(" ");
        const response = await authApi.register({
          firstName,
          lastName,
          email: values.email,
          password: "defaultPassword123", // Replace with a secure default or prompt
          phone: values.phone || "",
          address: [{ street: values.address, default: 1 }],
          status: values.status ? "active" : "inactive",
        });
        if (response) {
          setIsAddModalOpen(false);
          form.resetFields();
          const users = await userApi.getAllUsers();
          setTableData(users.slice().reverse());
        }
      }
    } catch (error) {
      console.log("Thao tác thất bại");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const columns = [
    {
      name: "Tên người dùng",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <img
            src={`https://picsum.photos/30?random=${row.id}`}
            alt={row.name}
            className="rounded-full"
          />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      name: "EMAIL",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "SĐT",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Giới tính",
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: "Ngày sinh",
      selector: (row) => row.dob,
      sortable: true,
    },
    {
      name: "Vai trò",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <Tag color={row.role === "USER" ? "orange" : "green"}>
          {row.role}
        </Tag>
      ),
    },
    {
      name: "",
      cell: (row) => (
        <div className="">
          <PencilLine
            className="cursor-pointer"
            onClick={() => {
              setSelectedUser({
                ...row,
                status: row.status === "active" ? true : false,
              });
              showModal(row);
            }}
          />
          <span style={{ display: "none" }}>{row.id}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchTableData = async () => {
      const response = await userApi.getAllUsers();
      if (Array.isArray(response)) {
        setTableData(response.slice().reverse());
      }
    };

    fetchTableData();
  }, []);

  useEffect(() => {
    if (isModalOpen && selectedUser.id) {
      const defaultAddress = userApi.getDefaultAddress(selectedUser);
      form.setFieldsValue({
        ...selectedUser,
        address: defaultAddress ? defaultAddress.street : "",
        status: selectedUser.status === "active",
      });
    }
  }, [selectedUser, isModalOpen, form]);

  return (
    <div className="p-6 bg-gray-100">
      <div className="space-y-6">
        {/* Modal for Editing */}
        <Modal
          title="Cập nhật thông tin người dùng"
          width={800}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="UserInfo"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ status: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="grid grid-cols-2"
          >
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Created Date"
              name="createdAt"
              rules={[{ required: true, message: "Vui lòng nhập ngày tạo" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="status" valuePropName="checked" label="Active">
              <Checkbox />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Adding */}
        <Modal
          title="Thêm người dùng"
          width={800}
          open={isAddModalOpen}
          onOk={handleAddOk}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="AddUser"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ status: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="grid grid-cols-2"
          >
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="status" valuePropName="checked" label="Active">
              <Checkbox />
            </Form.Item>
          </Form>
        </Modal>

        {/* Overview Section */}
        <h2 className="font-bold text-xl flex items-center space-x-2 mb-2 pb-2 mt-2">
          <DashboardOutlined size={32} style={{ color: "var(--color-blue-600)" }} />
          <span className="text-gray-800 text-2xl">Overview</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-10 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{totalUsers()}</p>
            <p className="text-green-500 text-sm">
              <CaretUpOutlined className="mr-2" />
              5.39% period of change
            </p>
          </div>
          <div className="bg-white p-10 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">New Users</h3>
            <p className="text-3xl font-bold text-blue-600">{newUsers()}</p>
            <p className="text-green-500 text-sm">
              <CaretUpOutlined className="mr-2" />
              6.8% period of change
            </p>
          </div>
        </div>

        {/* Detailed Report Section */}
        <h2 className="font-bold text-xl flex items-center space-x-2 mt-8 mb-2 pb-2">
          <PlusOutlined size={32} className="text-blue-600" />
          <span className="text-gray-800 text-2xl">Detail Report</span>
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-end">
            <div className="space-x-2">
              <Button type="primary" onClick={showAddCustomerModal}>
                Add User
              </Button>
              <Button type="default">Import</Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#2563eb", borderColor: "#2563eb", marginLeft: "8px" }}
              >
                Export
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
  );
}