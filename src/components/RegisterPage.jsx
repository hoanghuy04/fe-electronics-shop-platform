import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Form, Input, Button, message } from "antd";
import { post } from "../services/request";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const nagative = useNavigate();
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await post("users", {
        email: values.email,
        name: values.firstName + ' ' + values.lastName,
        gender: 0,
        phone: '',
        dob: '',
        address: [],
        password: values.password,
      });

      if (response) {
        message.success("Tạo tài khoản thành công!");
        nagative("/login");
      } else {
        message.error("Tạo tài khoản thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f5]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-6" style={{ color: "var(--color-primary)" }}>
          ĐĂNG KÝ TÀI KHOẢN E-SHOP
        </h2>

        <Form layout="vertical" 
        onFinish={handleSubmit}
        className="[&_.ant-form-item]:!mb-2"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]}
          >
            <Input allowClear placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
          >
            <Input allowClear placeholder="Họ" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input allowClear placeholder="Tên" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              style={{ backgroundColor: "var(--color-primary)", borderColor: "var(--color-primary)" }}
            >
              TẠO TÀI KHOẢN
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm">
          Bạn đã có tài khoản?
          <Link
            to={{ pathname: "/login", search: "?from=register", hash: "#form" }}
            className="font-medium ml-1 hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Đăng nhập!
          </Link>
        </div>
      </div>
    </div>
  );
}
