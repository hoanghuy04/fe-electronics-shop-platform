import { Input, Button, DatePicker, Radio, Form, Row, Col, Select } from "antd";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";
import { patch } from "../services/request";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const { Option } = Select;

export function AccountProfile() {
  const [form] = Form.useForm();
  const { user } = useOutletContext();

  const onFinish = (values) => {
    const dob = values.day + "/" + values.month + "/" + values.year.$y;

    const newForm = {
      ...values,
      dob,
    };

    delete newForm.day;
    delete newForm.month;
    delete newForm.year;

    form.setFieldsValue(newForm);

    if (newForm) {
      handleUpdateUser(newForm);
    }
  };

  const handleUpdateUser = async (data) => {
    await patch(`users/${data.id}`, data);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white py-8 px-5 shadow-md rounded-lg">
      <h2 className="text-lg !font-bold text-left pb-6">Thông tin tài khoản</h2>

      <Form
        {...layout}
        form={form}
        name="account-info"
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
        className="[&_.ant-form-item]:!mb-4"
        initialValues={{
          id: user.id || "",
          name: user.name || "",
          gender: (user.gender === 1 ? "Nam" : "Nữ") || "Nam",
          email: user.email || "",
          phone: user.phone || "",
          day: user.dob ? user.dob.split("/")[0] : "",
          month: user.dob ? user.dob.split("/")[1] : "",
          year: user.dob ? dayjs(user.dob.split("/")[2], "YYYY") : "",
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Họ Tên"
          rules={[{ required: true, message: "Họ tên không được để trống" }]}
        >
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Form.Item name="gender" label="Giới tính">
          <Radio.Group>
            <Radio value="Nam">Nam</Radio>
            <Radio value="Nữ">Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Số điện thoại không được để trống" },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Email không được để trống" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Ngày sinh">
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item name="day">
                <Select placeholder="Ngày">
                  <Option value="default">Ngày</Option>
                  {Array.from({ length: 31 }, (_, index) => (
                    <Option
                      key={index + 1}
                      value={String(index + 1).padStart(2, "0")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="month">
                <Select placeholder="Tháng">
                  <Option value="default">Tháng</Option>
                  {Array.from({ length: 12 }, (_, index) => (
                    <Option
                      key={index + 1}
                      value={String(index + 1).padStart(2, "0")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="year">
                <DatePicker picker="year" format="YYYY" placeholder="Năm" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-primary text-white !font-semibold !px-8"
          >
            LƯU THAY ĐỔI
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
