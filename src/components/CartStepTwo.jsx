import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, Checkbox } from "antd";
import { useOutletContext } from "react-router-dom";
import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";
import AddressForm from "./AddressForm";
import BoxPrice from "./BoxPrice";
import { useAuth } from "../hooks/AuthContext";
import { userApi } from "../services/user.service";
import { addressService } from "../services/address.service";

export default function CartStepTwo() {
  const { handlePlaceOrder, setOrder } = useOutletContext();
  const { cart, totalPrice } = useCart();
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { user } = useAuth();
  const [dfAddress, setDfAddress] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const provinceData = await addressService.getAllProvinces();
      setProvinces(provinceData.data);
    };
    fetchData();
    const defaultAddress = userApi.getDefaultAddress(user);
    if (defaultAddress) {
      setDfAddress(defaultAddress);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const newForm = {
        gender: user.gender === "Anh" ? "Anh" : "Chị",
        name: user.name || "",
        phone: user.phone || "",
        street: user.street || "",
        province: user.province || "",
        district: user.district || "",
        ward: user.ward || "",
        note: user.note || "",
      };
      form.setFieldsValue(newForm);
      handleChangeProvince(newForm.province);
      handleChangeDistrict(newForm.district);
    }
  }, []);

  const handleChangeProvince = async (provinceId) => {
    const districtsData = await addressService.getDistricts(provinceId);
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
    const wardsData = await addressService.getWards(districtId);
    setWards(wardsData.data);

    if (user === undefined) {
      form.setFieldsValue({
        ward: undefined,
      });
    }
  };

  const onFinish = async (values) => {
    try {
      const { name, phone, street, province, district, ward, note } = values;

      const order = {
        shipping_address: {
          full_name: name,
          phone: phone,
          address: {
            street,
            province,
            district,
            ward,
          },
        },
        note: note || "",
      };

      setOrder(order);
      handlePlaceOrder(path.cartStepThree);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  const handleChangeDefaultAddress = async (e) => {
    const checked = e.target.checked;

    if (checked && dfAddress) {
      const { province, district, ward, street } = dfAddress;

      form.setFieldsValue({
        province,
        district,
        ward,
        street: typeof street === "string" ? street : "",
      });

      await handleChangeProvince(province);
      await handleChangeDistrict(district);
    } else {
      form.setFieldsValue({
        street: undefined,
        province: undefined,
        district: undefined,
        ward: undefined,
      });
      setDistricts([]);
      setWards([]);
    }
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
          name="dfAddress"
          valuePropName="checked"
          label={null}
          className="!mb-0"
        >
          <Checkbox onChange={handleChangeDefaultAddress}>
            Sử dụng địa chỉ mặc định
          </Checkbox>
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
            className="!w-full !px-4.5 !py-8 rounded-sm !bg-primary !text-white !text-xl  !font-bold cursor-pointer"
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
