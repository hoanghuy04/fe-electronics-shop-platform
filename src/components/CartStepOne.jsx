// import { useState } from "react";
import CartItem from "./CartItem";
// import { ChevronUp, ChevronDown, TicketPercent } from "lucide-react";
// import { Input } from "antd";
import { useOutletContext } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import EmptyCart from "./EmptyCart";
import { path } from "../constants/path";
import BoxPrice from "./BoxPrice";

export default function CartStepOne() {
  // const [showInput, setShowInput] = useState(false);
  // const [code, setCode] = useState("");
  const { cart, totalPrice } = useCart();
  const { handlePlaceOrder } = useOutletContext();

  const handleNext = () => {
    if (cart.length > 0) {
      handlePlaceOrder(path.cartStepTwo);
    }
  };

  return (
    <div className="bg-white p-5">
      <div className="max-h-80 overflow-y-auto">
        {cart.length > 0 &&
          cart.map((item) => <CartItem key={item.id} item={item} />)}
        {cart.length == 0 && <EmptyCart />}
      </div>
      {cart.length > 0 && (
        <>
          {/*<div className="discount py-5 border-t-1 border-b-1 border-body-bg">
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
          </div>*/}
          <BoxPrice cart={cart} totalPrice={totalPrice} />
          <div className="w-full mt-5">
            <div className=" w-full">
              <button
                onClick={handleNext}
                className="w-full p-2.5 rounded-sm bg-primary !text-white text-lg font-bold cursor-pointer"
              >
                ĐẶT HÀNG NGAY
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
