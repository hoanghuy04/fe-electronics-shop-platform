import React, { useEffect, useState } from "react";
import { get } from "../services/request";

export default function HistoryCartItem({ product }) {
  const [item, setItem] = useState();

  useEffect(() => {
    const fetchItem = async () => {
      const existingItem = await get(`products/${product.id}`);
      if (existingItem) {
        setItem(existingItem);
      } else {
        throw new Error("No order found");
      }
    };
    fetchItem();
  }, [product.id]);

  return (
    <div className="grid grid-cols-12 gap-3 mb-4 items-center ">
      <div className="col-span-2 border border-line-border relative">
        <img
          src={item?.image_url[0]}
          alt={item?.title}
          className=" object-contain block"
        />
        <p className="bg-body-bg text-secondary p-1 w-5 h-5 text-xs font-bold flex justify-center items-center absolute bottom-0 right-0 !mb-0 rounded-tl-sm">
          x{product.quantity}
        </p>
      </div>
      <div className="col-span-6 ml-4">
        <p className="font-semibold">{item?.title}</p>
      </div>
      {product.discount > 0 ? (
        <div className="col-span-4 w-full">
          <div className=" font-semibold text-lg text-right">
            {(product.price * (1 - product.discount)).toLocaleString()}₫
          </div>
          <div className="text-secondary text-md text-right line-through">
            {product.price.toLocaleString()}₫
          </div>
        </div>
      ) : (
        <div className="text-primary font-bold text-xl text-right">
          {product.price.toLocaleString()}₫
        </div>
      )}
    </div>
  );
}
