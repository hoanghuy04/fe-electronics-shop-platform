import { useOutletContext } from "react-router-dom";
import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";
import { Radio } from "antd";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { post } from "../services/request";
import { generateId } from "../utils/helpers";
import useAddress from "../hooks/useAddress";
import BoxPrice from "./BoxPrice";

export default function CartStepThree() {
  const { handlePlaceOrder } = useOutletContext();
  const { cart, totalPrice } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
    console.log(savedUser);
  }, []);

  const address = {
    province: user?.province,
    ward: user?.ward,
    district: user?.district,
    street: user?.street,
  };

  const { province, district, ward } = useAddress(address);

  const handleClick = async () => {
    const products = cart.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
    }));

    const shipping_address = {
      full_name: user.name || "",
      phone: user.phone || "",
      address: {
        street: user.street || "",
        ward: user.ward,
        district: user.district,
        province: user.province,
      },
    };

    const order = {
      id: generateId("HD"),
      customer_id: 1,
      products: products,
      total_price: totalPrice,
      status: "Đang xử lý",
      order_date: new Date().toISOString(),
      payment_method: "Thanh toán khi nhận hàng",
      shipping_address: shipping_address,
      note: user.note,
    };

    if (order) {
      const response = await post("orders", order);
      if (response) {
        handlePlaceOrder(path.cartStepFour);
        localStorage.clear();
      }
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
            <div className="col-span-2 ">{user?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Số điện thoại:</div>
            <div className="col-span-2">{user?.phone}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Địa chỉ nhận hàng:</div>
            <div className="col-span-2">
              {`${address.street}, ${ward?.full_name}, ${district?.full_name}, ${province?.full_name}`}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Ghi chú:</div>
            <div className="col-span-2 ">{user.note}</div>
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
          className="w-full p-2.5 rounded-sm bg-primary !text-white text-lg font-bold cursor-pointer"
        >
          THANH TOÁN NGAY
        </button>
      </div>
    </div>
  );
}
