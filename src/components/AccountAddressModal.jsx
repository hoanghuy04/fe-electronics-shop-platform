import React from "react";
import { Form, Input, Select, Button } from "antd";
import { PhoneOutlined } from "@ant-design/icons";

const { Option } = Select;

export function AccountAddressModal() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  return (
    <div>
      <Form
        form={form}
        name="address-form"
        onFinish={onFinish}
        layout="vertical"
        className="[&_.ant-form-item]:!mb-2"
      >
        <h3 className="font-semibold mb-4">Thông tin khách hàng</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Form.Item
              name="fullName"
              label="Nhập Họ Tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Họ tên" />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="phoneNumber"
              label="Nhập Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </div>
        </div>

        <h3 className="font-semibold mb-4">Địa chỉ</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div>
            <Form.Item
              name="province"
              label="Chọn Tỉnh/Thành phố"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn Tỉnh/Thành phố">
                <Option value="HCM">Hồ Chí Minh</Option>
                <Option value="HN">Hà Nội</Option>
                <Option value="DN">Đà Nẵng</Option>
              </Select>
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="district"
              label="Chọn Quận/Huyện"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn Quận/Huyện">
                <Option value="BinhTan">Bình Tân</Option>
                <Option value="TanBinh">Tân Bình</Option>
                <Option value="GoVap">Gò Vấp</Option>
              </Select>
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="ward"
              label="Chọn Phường/Xã"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn Phường/Xã">
                <Option value="PhuThoHoa">Phú Thọ Hòa</Option>
                <Option value="TanQuy">Tân Quý</Option>
              </Select>
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="addressDetail"
              label="Số nhà, địa chỉ"
              rules={[
                { required: true, message: "Vui lòng nhập số nhà, địa chỉ" },
              ]}
            >
              <Input placeholder="Số nhà, địa chỉ" />
            </Form.Item>
          </div>
        </div>

        <h3 className="font-semibold mb-4">Loại địa chỉ</h3>
        <Form.Item
          name="addressType"
          label="Loại địa chỉ"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn Loại địa chỉ">
            <Option value="home">Nhà riêng</Option>
            <Option value="office">Văn phòng</Option>
          </Select>
        </Form.Item>

        <div className="flex justify-between mt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-primary w-full hover:!bg-red-600 !font-semibold text-white !py-2"
          >
            HOÀN THÀNH
          </Button>
        </div>
      </Form>
    </div>
  );
}
