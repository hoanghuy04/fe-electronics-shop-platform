import { Input, Button, DatePicker, Radio, Form, Row, Col } from "antd";
import dayjs from "dayjs";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export function AccountProfile() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values: ", values);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-xl !font-semibold text-left mb-6">
        Thông tin tài khoản
      </h2>

      <Form
        {...layout}
        form={form}
        name="account-info"
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
        className="[&_.ant-form-item]:!mb-4"
        initialValues={{
          name: "Huyền Trần Ngọc",
          gender: "Nữ",
          email: "tranngochuyen1909@gmail.com",
          day: dayjs("04", "DD"),
          month: dayjs("10", "MM"),
          year: dayjs("2022", "YYYY"),
        }}
      >
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
                <DatePicker
                  picker="date"
                  format="DD"
                  placeholder="Ngày"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="month">
                <DatePicker
                  picker="month"
                  format="MM"
                  placeholder="Tháng"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="year">
                <DatePicker
                  picker="year"
                  format="YYYY"
                  placeholder="Năm"
                  style={{ width: "100%" }}
                />
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
