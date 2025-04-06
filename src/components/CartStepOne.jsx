import React, { useState } from "react";
import CartItem from "./CartItem";
import { ChevronUp, ChevronDown, TicketPercent } from "lucide-react";
import { Input } from "antd";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import EmptyCart from "./EmptyCart";

export default function CartStepOne() {
  const setCurrentStep = useOutletContext();
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart();

  const handlePlaceOrder = () => {
    setCurrentStep(1);
    navigate("/cart/step-two");
  };

  return (
    <div className="bg-white p-5">
      <div>
        {cart.length > 0 &&
          cart.map((item) => <CartItem key={item.id} item={item} />)}
        {cart.length == 0 && <EmptyCart />}
      </div>
      {cart.length > 0 && (
        <>
          <div className="discount py-5 border-t-1 border-b-1 border-body-bg">
            <button
              onClick={() => setShowInput(!showInput)}
              className="p-2 rounded-sm border border-body-bg flex items-center gap-3 "
            >
              <TicketPercent className="text-blue-500" />
              <span className="text-xl text-blue-500">Sử dụng mã giảm giá</span>
              {showInput ? (
                <ChevronUp className="text-blue-500 text-xl" />
              ) : (
                <ChevronDown className="text-blue-500 text-xl" />
              )}
            </button>

            {showInput && (
              <div className="p-2 bg-body-bg mt-5 rounded-sm">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá/Phiếu mua hàng"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="px-3 h-10 flex-1 text-2xl"
                  />
                  <button className="p-3 rounded-sm bg-blue-500 !text-white text-xl font-bold">
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="total-price pt-5 flex justify-between ">
            <div className="font-bold text-xl">Tổng tiền: </div>
            <div className="text-red-500 font-semibold text-3xl">
              {cart.length > 0 && totalPrice.toLocaleString()}₫
            </div>
          </div>
          <div className="w-full bg-white mt-5">
            <div className=" w-full">
              <button
                onClick={handlePlaceOrder}
                className="w-full p-3 rounded-sm bg-blue-500 !text-white text-xl font-bold cursor-pointer"
              >
                Đặt hàng ngay
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
