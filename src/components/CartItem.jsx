import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../hooks/useCart";

export default function CartItem({ item }) {
  const { addToCart, decreaseQuantity, removeFromCart } = useCart();
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
                src={
                  item.image_url && item.image_url[0] ? item.image_url[0] : ""
                }
                alt={item.title}
              />
            </Link>
          </div>
          <div className="remove mt-2 flex justify-center items-center">
            <button
              onClick={() => {
                removeFromCart(item.id);
              }}
              className="cursor-pointer flex justify-center items-center"
            >
              <Trash2 />
              <span className="text-gray-500 ml-2">Xoá</span>
            </button>
          </div>
        </div>
        <div className="col-span-9 text-title text-xl font-semibold">
          {item.title}
        </div>
      </div>
      <div className="col-span-4 ">
        <div className="text-red-500 font-bold text-2xl  text-right">
          {(item.price * (1 - item.discount)).toLocaleString()}
        </div>
        <div className="text-gray-500 text-lg line-through mt-3 text-right pr-5">
          {item.price.toLocaleString()}
        </div>
        <div className="quantity flex justify-end mt-7">
          <button
            className="p-2 border-t-1 border-l-1 border-b-1 border-body-bg rounded-tl-sm rounded-bl-sm cursor-pointer"
            onClick={() => {
              decreaseQuantity(item.id);
            }}
          >
            <Minus />
          </button>
          <input
            className="p-2 border-1 border-body-bg w-12 disabled text-center"
            value={item.quantity}
            onChange={() => {}}
          />
          <button
            className="p-2 border-t-1 border-r-1 border-b-1 border-body-bg rounded-tr-sm rounded-br-sm cursor-pointer"
            onClick={() => {
              addToCart(item);
            }}
          >
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
