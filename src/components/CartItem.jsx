import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem() {
  return (
    <div className="grid grid-cols-12 grid-flow-row gap-8 mb-7">
      <div className="col-span-8 grid grid-cols-12 grid-flow-row gap-5">
        <div className="col-span-3 text-center">
          <div className="item-img ">
            <Link
              to="/"
              className="block mx-0 my-auto border border-body-bg text-center"
            >
              <img
                className="  block object-contain"
                src="https://product.hstatic.net/200000722513/product/lg_27gs65f-b_gearvn_2650af629116476588bb61972092b90f.jpg"
                alt=""
              />
            </Link>
          </div>
          <div className="remove mt-2 flex justify-center items-center">
            <Trash2 />
            <span className="text-gray-500 ml-2">Xoá</span>
          </div>
        </div>
        <div className="col-span-9 text-title text-xl font-semibold">
          Màn hình LG 27GS65F-B 27" IPS 180Hz HDR10 Gsync chuyên game
        </div>
      </div>
      <div className="col-span-4 ">
        <div className="text-red-500 font-bold text-2xl  text-right">
          4.290.000₫
        </div>
        <div className="text-gray-500 text-lg line-through mt-3 text-right pr-5">
          4.290.000₫
        </div>
        <div className="quantity flex justify-end mt-7">
          <button className="p-2 border-t-1 border-l-1 border-b-1 border-body-bg rounded-tl-sm rounded-bl-sm">
            <Minus />
          </button>
          <input
            className="p-2 border-1 border-body-bg w-12 disabled text-center"
            value="1"
            onChange={() => {}}
          />
          <button className="p-2 border-t-1 border-r-1 border-b-1 border-body-bg rounded-tr-sm rounded-br-sm">
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
