import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../hooks/useCart";

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  return (
    <div className="grid grid-cols-12 grid-flow-row gap-8 mb-4 px-4 pb-8 border-b border-line-border ">
      <div className="col-span-8 grid grid-cols-12 grid-flow-row gap-5">
        <div className="col-span-3 text-center">
          <div className="item-img ">
            <Link
              to={`/products/${item.slug}`}
              className="block mx-0 my-auto border border-body-bg text-center"
            >
              <img
                className="  block object-contain"
                src={item.image_url[0]}
                alt={item.title}
              />
            </Link>
          </div>
          <div className="remove mt-2 flex justify-center items-center">
            <button
              onClick={() => {
                removeFromCart(item.id);
              }}
              className="cursor-pointer flex justify-center items-center "
            >
              <Trash2 className="text-secondary w-4 h-5 " />
              <span className="text-secondary ml-2 hover:text-primary">
                Xoá
              </span>
            </button>
          </div>
        </div>
        <Link
          to={`/products/${item.slug}`}
          className="col-span-9 text-title text-lg font-semibold"
        >
          {item.title}
        </Link>
      </div>
      <div className="col-span-4 ">
        <div className="flex flex-col items-end gap-1">
          {item.discount > 0 ? (
            <>
              <div className="text-primary font-bold text-xl text-right">
                {(item.price * (1 - item.discount)).toLocaleString()}₫
              </div>
              <div className="text-secondary text-lg text-right line-through">
                {item.price.toLocaleString()}₫
              </div>
            </>
          ) : (
            <div className="text-primary font-bold text-xl text-right">
              {item.price.toLocaleString()}₫
            </div>
          )}
        </div>

        <div className="quantity flex justify-end mt-5">
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
              increaseQuantity(item.id);
            }}
          >
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
