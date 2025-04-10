import React from "react";

export default function BoxPrice({ cart, totalPrice }) {
  return (
    <div>
      <div className="flex justify-between mt-4">
        <span className="font-bold">Phí vận chuyển:</span>
        <span className="font-medium ">Miễn phí</span>
      </div>

      <div className="total-price pt-4 flex justify-between ">
        <div className="font-bold text-xl">Tổng tiền: </div>
        <div className="text-red-500 font-semibold text-3xl">
          {cart.length > 0 && totalPrice.toLocaleString()}₫
        </div>
      </div>
    </div>
  );
}
