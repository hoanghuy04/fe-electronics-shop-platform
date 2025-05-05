import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Radio, ConfigProvider, Spin } from "antd";
import { generateId } from "../utils/helpers";
import {
  getAllProvinces,
  getDistricts,
  getWards,
} from "../services/address.service";
import AddressForm from "./AddressForm";

const { Option } = Select;

const customTheme = {
  components: {
    Radio: {
      buttonBg: "transparent",
      buttonColor: "#000",
      buttonCheckedColor: "#fff",
      buttonPaddingInline: "16px",
      buttonSolidCheckedActiveBg: "var(--color-primary)",
      buttonSolidCheckedHoverBg: "var(--color-primary)",
      borderRadiusSM: 4,
    },
  },
};

export function AccountAddressModal(props) {
  const { isAdd, addressData, handleAddAddress, handleUpdateAddress } = props;
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const provinceData = await getAllProvinces();
        setProvinces(provinceData.data);

        if (!isAdd && addressData) {
          const districtsData = await getDistricts(addressData.province);
          setDistricts(districtsData.data);

          const wardsData = await getWards(addressData.district);
          setWards(wardsData.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdd, addressData]);

  const handleChangeProvince = async (provinceId) => {
    const districtsData = await getDistricts(provinceId);
    setDistricts(districtsData.data);

    form.setFieldsValue({
      district: undefined,
      ward: undefined,
    });

    setWards([]);
  };

  const handleChangeDistrict = async (districtId) => {
    const wardsData = await getWards(districtId);
    setWards(wardsData.data);

    form.setFieldsValue({
      ward: undefined,
    });
  };

  useEffect(() => {
    if (!isAdd && addressData && provinces.length > 0) {
      form.setFieldsValue(addressData);
    } else if (isAdd) {
      form.resetFields();
    }
  }, [isAdd, addressData, form, provinces]);

  const onFinish = (values) => {
    const newAddress = { ...values };
    newAddress.default = 0;
    if (isAdd) {
      newAddress.id = generateId("DC");
      handleAddAddress(newAddress);
    } else {
      handleUpdateAddress(newAddress);
    }
  };

  return (
    <Spin spinning={loading}>
      {" "}
      <div>
        <div className="py-2">
          <div className="text-lg font-semibold">
            {isAdd ? "ĐỊA CHỈ MỚI" : "CẬP NHẬT ĐỊA CHỈ"}
          </div>
        </div>
        <div className="border-b border-line-border my-2"></div>
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
              <Form.Item name="id" hidden>
                <Input placeholder="Họ tên" />
              </Form.Item>

              <Form.Item
                name="name"
                label="Nhập Họ Tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Họ tên" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="phone"
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

          <AddressForm
            provinces={provinces}
            districts={districts}
            wards={wards}
            handleChangeProvince={handleChangeProvince}
            handleChangeDistrict={handleChangeDistrict}
          />

          <h3 className="font-semibold mb-4">Loại địa chỉ</h3>
          <ConfigProvider theme={customTheme}>
            <Form.Item
              name="type"
              label="Loại địa chỉ"
              rules={[
                { required: true, message: "Vui lòng chọn loại địa chỉ" },
              ]}
            >
              <Radio.Group className="!flex !gap-4">
                <Radio.Button
                  value="office"
                  className="w-32 h-12 flex items-center justify-center !rounded-none"
                >
                  Văn phòng
                </Radio.Button>
                <Radio.Button
                  value="home"
                  className="w-32 h-12 flex items-center justify-center !rounded-none"
                >
                  Nhà riêng
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </ConfigProvider>

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
    </Spin>
  );
}
