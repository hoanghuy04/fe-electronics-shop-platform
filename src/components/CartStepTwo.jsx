import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Select, Checkbox, Button } from "antd";
import { useOutletContext } from "react-router-dom";
import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";
import { getAllProvinces, getDistricts, getWards } from "../services/address";

const { Option } = Select;

export default function CartStepTwo() {
  const { handlePlaceOrder } = useOutletContext();
  const { cart, totalPrice } = useCart();
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [user, setUser] = useState(null);

  const fetchProvinces = async () => {
    const provinceData = await getAllProvinces();
    setProvinces(provinceData.data);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      const newForm = {
        gender: savedUser.gender === "Anh" ? "Anh" : "Chị",
        name: savedUser.name || "",
        phone: savedUser.phone || "",
        street: savedUser.street || "",
        province: savedUser.province || "",
        district: savedUser.district || "",
        ward: savedUser.ward || "",
        note: savedUser.note || "",
        delivery: savedUser.delivery || "",
        shipping: savedUser.shipping || "",
      };
      form.setFieldsValue(newForm);
      handleChangeProvince(newForm.province);
      handleChangeWard(newForm.district);
    }
  }, []);

  const handleChangeProvince = async (e) => {
    const districtData = await getDistricts(e.split("-")[0]);
    setDistricts(districtData.data);
  };

  const handleChangeWard = async (e) => {
    const wardData = await getWards(e.split("-")[0]);
    setWards(wardData.data);
  };

  const onFinish = (values) => {
    form
      .validateFields()
      .then(() => {
        setUser(values);
        localStorage.setItem("user", JSON.stringify(values));
        handlePlaceOrder(path.cartStepThree);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
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
          delivery: "home",
        }}
      >
        <h2 className="font-semibold text-base mb-2">
          Thông tin khách mua hàng
        </h2>
        <Form.Item
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
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
        <Form.Item
          name="delivery"
          className="mt-2"
          rules={[{ required: true, message: "Vui lòng chọn cách nhận hàng" }]}
        >
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
            <Select
              placeholder="Chọn tỉnh/thành phố"
              onChange={handleChangeProvince}
            >
              <Option value="default">Chọn tỉnh/thành phố</Option>
              {provinces.map((item) => (
                <Option key={item.id} value={`${item.id}-${item.full_name}`}>
                  {item.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
          >
            <Select placeholder="Chọn quận/huyện" onChange={handleChangeWard}>
              <Option value="default">Chọn quận/huyện</Option>
              {districts.map((item) => (
                <Option key={item.id} value={`${item.id}-${item.full_name}`}>
                  {item.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ward"
            label="Phường/Xã"
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select placeholder="Chọn phường/xã">
              <Option value="default">Chọn phường/xã</Option>
              {wards.map((item) => (
                <Option key={item.id} value={`${item.id}-${item.full_name}`}>
                  {item.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="street"
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
          <div className="text-red-500 font-semibold text-3xl">
            {cart.length > 0 && totalPrice.toLocaleString()}₫
          </div>
        </div>

        <Form.Item className="!mt-6">
          <Button
            type="primary"
            block
            htmlType="submit"
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
