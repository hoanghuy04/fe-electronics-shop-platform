import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function CartNotification({ product }) {
  return (
    <div className="w-72 absolute left-0 bg-white p-3 rounded-sm">
      <p className="text-green-600 font-semibold text-sm text-center mb-2">
        Thêm vào giỏ hàng thành công
      </p>
      <div className="grid grid-cols-3 gap-3 w-full h-full">
        <img
          className="w-full h-full"
          src="https://product.hstatic.net/200000722513/product/lg_27gs65f-b_gearvn_2650af629116476588bb61972092b90f.jpg"
          alt={product.title}
        />
        <div className="col-span-2">
          <p className="text-sm font-medium text-black">{product.title}</p>
        </div>
      </div>
      <Link to="/cart">
        <Button
          type="primary"
          className="w-full mt-3 !bg-orange-500 !hover:bg-orange-600"
        >
          XEM GIỎ HÀNG
        </Button>
      </Link>
    </div>
  );
}
