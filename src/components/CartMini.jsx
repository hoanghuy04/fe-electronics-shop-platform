import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../store/actions/cartAction";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../hooks/useCart";

export default function CartMini() {
  // const cart = useSelector((state) => state.cartReducer) || [];

  // // Tính tổng số lượng trong giỏ hàng
  // const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { totalItem } = useCart();

  return (
    <Link
      to="/cart"
      className="flex items-center font-medium text-lg transition-colors duration-200"
    >
      <button className="flex items-center cursor-pointer">
        <div className="relative">
          <span className="absolute top-[-8px] right-0 bg-yellow-400 w-5 h-5 flex justify-center items-center rounded-full p-0.5 text-xs border">
            {totalItem}
          </span>
          <ShoppingCartOutlined className="mr-2 text-xl" />
        </div>
        <span>Giỏ hàng </span>
      </button>
    </Link>
  );
}
