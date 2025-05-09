import { Select, Avatar } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";

const { Option } = Select;

const OrderDetail = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Column */}
      <div className="w-full md:w-2/3 space-y-6">
        {/* Order Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Order Information</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-medium">29 Jun 2024</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Items</p>
              <p className="font-medium">1 Items</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <Select
                defaultValue="pending"
                className="status-select w-full"
                bordered={false}
                suffixIcon={<span className="text-blue-500">▼</span>}
              >
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="font-medium">$104</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Items</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <span className="text-blue-500 text-xl">👕</span>
                      </div>
                      <span>Blue T-shirt for all ages</span>
                    </div>
                  </td>
                  <td className="text-right py-4">$30.0</td>
                  <td className="text-right py-4">3</td>
                  <td className="text-right py-4 font-medium">$90.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">$90</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">$5.00</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">$9.00</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">$104</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Transactions</h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <CreditCardOutlined className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="font-medium">Payment via Paypal</p>
                <p className="text-gray-500 text-sm">Paypal fee $25</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-medium">April 21, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="font-medium">$104</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/3 space-y-6">
        {/* Customer */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Customer</h2>

          <div className="flex items-center">
            <Avatar
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=50&width=50"
              size={50}
              className="mr-4"
            />
            <div>
              <p className="font-medium">Taimoor Sikander</p>
              <p className="text-gray-500 text-sm">
                mrtaimoorsikander@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact Person */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Contact Person</h2>

          <div className="space-y-2">
            <p className="font-medium">Taimoor Sikander</p>
            <p className="text-gray-500">mrtaimoorsikander@gmail.com</p>
            <p className="text-gray-500">(+1) *** ***</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Shipping Address</h2>

          <div className="text-gray-500">
            <p>. . .</p>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Billing Address</h2>

          <div className="text-gray-500">
            <p>. . .</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
