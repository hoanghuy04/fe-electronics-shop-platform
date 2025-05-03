import { Form, Input, Button } from "antd";
import { Link } from "react-router";
import { useAuth } from "../../hooks/AuthContext";

export default function Login() {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const handleLogin = async (values) => {
    await login(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-4 text-[var(--color-primary)]">
          ĐĂNG NHẬP
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          className="[&_.ant-form-item]:!mb-2"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                backgroundColor: "var(--color-primary)",
                borderColor: "var(--color-primary)",
              }}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm">
          Bạn chưa có tài khoản?
          <Link
            to="/register"
            className="font-medium ml-1 hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Đăng ký ngay!
          </Link>
        </div>
      </div>
    </div>
  );
}
