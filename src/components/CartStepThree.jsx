import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";
import { Radio } from "antd";
import { Package } from "lucide-react";
import { generateId } from "../utils/helpers";
import useAddress from "../hooks/useAddress";
import BoxPrice from "./BoxPrice";
import { useAuth } from "../hooks/AuthContext";
import { orderService } from "../services/order.service";
import { addressService } from "../services/address.service";

export default function CartStepThree() {
  const { cart, totalPrice, handlePlaceOrder, order, setOrder } = useCart();
  const { user } = useAuth();

  const { province, district, ward } = useAddress(
    order?.shipping_address.address
  );

  const handleClick = async () => {
    const province = await addressService.getProvinceById(
      order.shipping_address.address.province
    );
    const district = await addressService.getDistrictById(
      order.shipping_address.address.district,
      order.shipping_address.address.province
    );
    const ward = await addressService.getWardById(
      order.shipping_address.address.ward,
      order.shipping_address.address.district
    );

    const products = cart.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
    }));

    const completedOrder = {
      ...order,
      id: generateId("HD"),
      customer_id: user?.id || 1,
      products,
      total_price: totalPrice,
      status: {
        current: "PENDING",
        history: [
          {
            status: "PENDING",
            updated_at: new Date().toISOString(),
            note: "Đơn hàng được tạo",
          },
        ],
      },
      order_date: new Date().toISOString(),
      delivered_date: "",
      payment_method: "Thanh toán khi nhận hàng",
      payment_status: "UNPAID",
      shipping_address: {
        ...order.shipping_address,
        address: {
          ...order.shipping_address.address,
          province: province?.full_name || "",
          district: district?.full_name || "",
          ward: ward?.full_name || "",
        },
      },
    };

    const response = await orderService.createOrder(completedOrder);
    if (response) {
      setOrder(completedOrder);
      handlePlaceOrder(path.cartStepFour);
      localStorage.removeItem("cart");
    }
  };

  return (
    <div className="p-5 bg-white ">
      <div>
        <h2 className=" text-xl text-title !mb-7 !font-bold">
          Thông tin đặt hàng
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Khách hàng:</div>
            <div className="col-span-2 ">
              {order?.shipping_address.full_name}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Số điện thoại:</div>
            <div className="col-span-2">{order?.shipping_address.phone}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Địa chỉ nhận hàng:</div>
            <div className="col-span-2">
              {`${order?.shipping_address.address?.street}, ${ward?.full_name}, ${district?.full_name}, ${province?.full_name}`}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Ghi chú:</div>
            <div className="col-span-2 ">{order?.note}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Tạm tính:</div>
            <div className="text-primary font-semibold col-span-2">
              {cart.length > 0 && totalPrice.toLocaleString()}₫
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Phí vận chuyển:</div>
            <div className="text-primary col-span-2 font-semibold">
              Miễn phí
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7 font-semibold">
            <div className="">&#8226; Tổng tiền:</div>
            <div className="text-primary col-span-2">
              {cart.length > 0 && totalPrice.toLocaleString()}₫
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl text-title !font-bold !mt-8">
            Chọn hình thức thanh toán
          </h2>

          <div className="space-y-4 py-8 border-t border-b border-gray-200">
            <div className="flex items-center">
              <Radio.Group defaultValue="COD" className="w-full">
                <Radio value="COD">
                  <span className="inline-flex items-center text-lg font-semibold ">
                    <Package className="mx-2" />
                    Thanh toán khi giao hàng (COD)
                  </span>
                </Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className=" mt-5">
          <BoxPrice cart={cart} totalPrice={totalPrice} />
        </div>
      </div>

      <div className=" w-full mt-8">
        <button
          onClick={handleClick}
          className="w-full p-2.5 py-5 rounded-sm bg-primary !text-white !text-xl font-bold cursor-pointer"
        >
          THANH TOÁN NGAY
        </button>
      </div>
    </div>
  );
}
