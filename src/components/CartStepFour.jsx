import { Button, Card, Row, Col, Tag, Radio } from "antd";
import { useCart } from "../hooks/useCart";
import { useEffect, useState } from "react";
import { Package, CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";
export default function CartStepFour() {
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
    <div className="p-5 bg-white">
      <div className="text-state-success bg-green-100 text-center p-4 mb-6 rounded-md flex items-center justify-center">
        <CircleCheckBig className="mr-2" />
        <div className="font-bold">Đặt hàng thành công</div>
      </div>

      <div className="my-5 text-center">
        Cảm ơn quý khách đã cho{" "}
        <span className="text-primary font-semibold">LinGanGuLi</span> có cơ hội
        được phụ vụ <br /> Nhân viên{" "}
        <span className="text-primary font-semibold">LinGanGuLi</span> sẽ liên
        hệ với quý khách trong thời gian sớm nhất
      </div>

      <div className="bg-body-bg p-5  ">
        <div className="flex justify-between items-center border-b border-secondary">
          <h2 className=" text-title py-3 ">
            ĐƠN HÀNG <strong>#46465</strong>
          </h2>
          <Link to="/" className="text-sub font-semibold">
            Quản lý đơn hàng
          </Link>
        </div>

        <div className="space-y-4 mt-5">
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

          <div className="grid grid-cols-3 gap-4 mb-7 ">
            <div className="font-semibold">Hình thức thanh toán:</div>
            <div className="col-span-2 ">Thanh toán khi giao hàng</div>
          </div>
        </div>

        <Button
          variant="dashed"
          color="orange"
          block
          className="w-full !p-5 rounded-sm text-xl !font-bold cursor-pointer !bg-orange-50"
        >
          Đơn hàng chưa được thanh toán
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        <Link to="/">
          <Button
            block
            type="text"
            variant="outlined"
            className="cursor-pointer !p-5 rounded-sm text-xl !font-bold !text-sub !border-sub"
          >
            Tiếp tục mua hàng
          </Button>
        </Link>
      </div>
    </div>
  );
}
