import { useOutletContext } from "react-router-dom";
import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";
import { Radio } from "antd";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { generateOrderId, post } from "../services/request";

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
        ward: user.ward.split("-")[1] || "",
        district: user.district.split("-")[1] || "",
        province: user.province.split("-")[1] || "",
      },
    };

    const order = {
      id: generateOrderId(),
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
      } else {
        alert("haha");
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
              {user?.street}, {user?.ward.split("-")[1]},{" "}
              {user?.district.split("-")[1]}, {user?.province.split("-")[1]}
            </div>
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
                  <span className="inline-flex items-center ">
                    <Package className="mx-2" />
                    Thanh toán khi giao hàng (COD)
                  </span>
                </Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className=" mt-5">
          <div className="flex justify-between mt-4">
            <span className="font-semibold">Phí vận chuyển:</span>
            <span className="font-semibold">Miễn phí</span>
          </div>

          <div className="total-price pt-5 flex justify-between ">
            <div className="font-bold text-xl">Tổng tiền: </div>
            <div className="text-red-500 font-semibold text-3xl">
              {cart.length > 0 && totalPrice.toLocaleString()}₫
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full mt-8">
        <button
          onClick={handleClick}
          className="w-full !p-4.5 rounded-sm bg-primary !text-white text-xl font-bold cursor-pointer"
        >
          THANH TOÁN NGAY
        </button>
      </div>
    </div>
  );
}
