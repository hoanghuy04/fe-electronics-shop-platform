import { Card } from "antd";
import { useState } from "react";
import HistoryCartItem from "./HistoryCartItem";
import { Link } from "react-router-dom";
import TagStatus from "./TagStatus";

export default function BoxOrder({ order }) {
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleToggleProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  return (
    <Card className="!mb-5">
      <div className="flex items-start mb-4">
        <div className="flex !justify-between w-full border-b border-line-border pb-5">
          <TagStatus status={order.status.current} />
          <div className="font-semibold">#{order.id}</div>
        </div>
      </div>

      <div>
        {order?.products
          .slice(0, showAllProducts ? order.products.length : 2)
          .map((product) => (
            <HistoryCartItem product={product} key={product.id} />
          ))}

        <div className="flex !justify-between w-full border-b border-line-border mb-3"></div>

        {order?.products.length > 2 && (
          <button
            className="border border-line-border px-3 py-1 text-sm rounded-sm cursor-pointer"
            onClick={handleToggleProducts}
          >
            {showAllProducts
              ? "Ẩn bớt sản phẩm"
              : `Xem thêm ${order.products.length - 2} sản phẩm`}
          </button>
        )}
      </div>

      <div className="flex justify-end mt-4 items-center">
        <p className="font-semibold text-xl">
          Tổng tiền:{" "}
          <span className="text-primary">
            {order?.total_price.toLocaleString()}₫
          </span>
        </p>
      </div>

      <div className="flex justify-end">
        <Link to={`/account/order-history/${order.id}`}>
          <button className="border border-sub px-3 py-1 text-sm rounded-sm cursor-pointer">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </Card>
  );
}
