import React from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

export default function AddressForm({
  provinces,
  districts,
  wards,
  handleChangeProvince,
  handleChangeDistrict,
  form,
}) {
  const provinceValue = Form.useWatch("province", form);
  const districtValue = Form.useWatch("district", form);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        name="province"
        label="Tỉnh/Thành"
        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành" }]}
      >
        <Select
          placeholder="Chọn tỉnh/thành phố"
          onChange={handleChangeProvince}
          allowClear
        >
          {provinces.map((item) => (
            <Option key={item.id} value={item.id}>
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
        <Select
          placeholder="Chọn quận/huyện"
          onChange={handleChangeDistrict}
          disabled={!provinceValue}
          allowClear
        >
          {districts.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.full_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="ward"
        label="Phường/Xã"
        rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
        allowClear
      >
        <Select placeholder="Chọn phường/xã" disabled={!districtValue}>
          {wards.map((item) => (
            <Option key={item.id} value={item.id}>
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
  );
}
