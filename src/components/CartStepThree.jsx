import { useOutletContext } from "react-router-dom";
import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";
import { Radio } from "antd";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

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

  return (
    <div className="p-5 bg-white ">
      <div>
        <h2 className=" text-xl text-title !mb-7 !font-bold">
          Thông tin đặt hàng
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">Khách hàng:</div>
            <div className="col-span-2 ">{user?.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">Số điện thoại:</div>
            <div className="col-span-2">{user?.phone}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">Địa chỉ nhận hàng:</div>
            <div className="col-span-2">
              {user?.street}, {user?.ward.split("-")[1]},{" "}
              {user?.district.split("-")[1]}, {user?.province.split("-")[1]}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">Tạm tính:</div>
            <div className="text-primary font-semibold col-span-2">
              {cart.length > 0 && totalPrice.toLocaleString()}₫
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">Phí vận chuyển:</div>
            <div className="text-primary col-span-2 font-semibold">
              Miễn phí
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7 font-semibold">
            <div className="">Tổng tiền:</div>
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
          onClick={() => {
            handlePlaceOrder(path.cartStepFour);
          }}
          className="w-full p-3 rounded-sm bg-primary !text-white text-xl font-bold cursor-pointer"
        >
          THANH TOÁN NGAY
        </button>
      </div>
    </div>
  );
}
