import { useEffect, useState } from "react";
import { get } from "../services/request";

const HistoryDetail = ({ product }) => {
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
    <div className="flex items-start py-3">
      <div className="w-16 h-16 mr-4">
        <img
          src={item?.image_url[0]}
          alt={item?.title}
          className=" object-contain block"
        />
      </div>
      <div className="flex-1 flex  flex-col gap-1">
        <div className="font-medium text-sm mb-1">{product.title}</div>
        <div className="text-xs text-[#535353] font-semibold">
          {product.title}
        </div>
        <div className="text-xs text-[#535353] font-semibold">
          Số lượng: {product.quantity}
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-primary">
          {(product.price * (1 - product.discount)).toLocaleString()}₫
        </p>
      </div>
    </div>
  );
};

export default HistoryDetail;
