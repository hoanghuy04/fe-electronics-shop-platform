import React from "react";
import { Form, Input, Radio, Select, Checkbox, Button } from "antd";
import { useNavigate, useOutletContext } from "react-router-dom";
import CartMini from "./CartMini";

const { Option } = Select;

export default function CartStepTwo() {
  const setCurrentStep = useOutletContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handlePlaceOrder = () => {
    setCurrentStep(2);
    navigate("/cart/step-three");
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div className="p-5 bg-white">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          gender: "Anh",
          shipping: true,
        }}
      >
        <h2 className="font-semibold text-base mb-2">
          Thông tin khách mua hàng
        </h2>
        <Form.Item name="gender">
          <Radio.Group>
            <Radio value="Anh">Anh</Radio>
            <Radio value="Chị">Chị</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            className="w-1/2"
            label="Họ tên"
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            className="w-1/2"
            label="Số điện thoại"
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>

        <h2 className="font-semibold text-base mt-4">Chọn cách nhận hàng</h2>
        <Form.Item name="delivery" className="mt-2">
          <Radio.Group>
            <Radio value="home">Giao hàng tận nơi</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="province"
            label="Tỉnh/Thành"
            rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành" }]}
          >
            <Select placeholder="Cà Mau">
              <Option value="camau">Cà Mau</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
          >
            <Select placeholder="Huyện Phú Tân">
              <Option value="phutan">Huyện Phú Tân</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ward"
            label="Phường/Xã"
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select placeholder="Chọn phường/xã">
              <Option value="phuong1">Phường 1</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Số nhà, tên đường"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input placeholder="Số nhà, tên đường" />
          </Form.Item>
        </div>

        <Form.Item name="note" label="Lưu ý, yêu cầu khác (Không bắt buộc)">
          <Input.TextArea rows={2} />
        </Form.Item>

        <h2 className="font-semibold text-base mt-4">Dịch vụ giao hàng</h2>
        <Form.Item name="shipping" valuePropName="checked">
          <Checkbox>Miễn phí vận chuyển (Giao hàng tiêu chuẩn)</Checkbox>
        </Form.Item>

        <div className="flex justify-between mt-4">
          <span>Phí vận chuyển:</span>
          <span className="font-medium text-gray-600">Miễn phí</span>
        </div>

        <div className="total-price pt-5 flex justify-between ">
          <div className="font-bold text-xl">Tổng tiền: </div>
          <div className="text-red-500 font-semibold text-3xl">25.150.000₫</div>
        </div>

        <Form.Item className="!mt-6">
          <Button
            onClick={handlePlaceOrder}
            type="primary"
            htmlType="submit"
            block
            className="w-full !p-5 rounded-sm bg-blue-500 !text-white text-xl !font-bold cursor-pointer"
          >
            ĐẶT HÀNG NGAY
          </Button>
        </Form.Item>

        <p className="text-center text-sm text-gray-500">
          Bạn có thể chọn hình thức thanh toán sau khi đặt hàng
        </p>
      </Form>
    </div>
  );
}
