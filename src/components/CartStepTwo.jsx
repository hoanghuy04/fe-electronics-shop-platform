import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, Select } from "antd";
import { useOutletContext } from "react-router-dom";
import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";
import { getAllProvinces, getDistricts, getWards } from "../services/address";
import AddressForm from "./AddressForm";
import BoxPrice from "./BoxPrice";

const { Option } = Select;

export default function CartStepTwo() {
  const { handlePlaceOrder } = useOutletContext();
  const { cart, totalPrice } = useCart();
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const provinceData = await getAllProvinces();
      setProvinces(provinceData.data);
    };
    fetchData();
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
      handleChangeDistrict(newForm.district);
    }
  }, []);

  const handleChangeProvince = async (provinceId) => {
    const districtsData = await getDistricts(provinceId);
    setDistricts(districtsData.data);

    if (user === undefined) {
      form.setFieldsValue({
        district: undefined,
        ward: undefined,
      });
    }

    setWards([]);
  };

  const handleChangeDistrict = async (districtId) => {
    const wardsData = await getWards(districtId);
    setWards(wardsData.data);

    if (user === undefined) {
      form.setFieldsValue({
        ward: undefined,
      });
    }
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
          shipping: "free",
          delivery: "home",
        }}
        className="[&_.ant-form-item]:!mb-2"
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

        <AddressForm
          provinces={provinces}
          districts={districts}
          wards={wards}
          handleChangeProvince={handleChangeProvince}
          handleChangeDistrict={handleChangeDistrict}
        />

        <Form.Item name="note" label="Lưu ý, yêu cầu khác (Không bắt buộc)">
          <Input.TextArea rows={2} />
        </Form.Item>

        <h2 className="font-semibold text-base mt-4">Dịch vụ giao hàng</h2>
        <Form.Item name="shipping">
          <Radio.Group>
            <Radio value="free">
              Miễn phí vận chuyển (Giao hàng tiêu chuẩn)
            </Radio>
          </Radio.Group>
        </Form.Item>

        <BoxPrice cart={cart} totalPrice={totalPrice} />

        <Form.Item className="!mt-6">
          <Button
            type="primary"
            block
            htmlType="submit"
            style={{ padding: "18px" }}
            className="w-full !p-4.5 rounded-sm !bg-primary !text-white !text-lg  !font-bold cursor-pointer"
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
