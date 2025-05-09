import React, { useEffect, useState } from "react";
// import AccountViewedProductCard from "./AccountViewedProductCard";
import EmptyView from "./EmptyView";
import ProductCard from "./ProductCard";

export default function AccountViewedProduct() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const viewedProducts = localStorage.getItem("viewedProducts");
    if (viewedProducts) {
      const data = JSON.parse(viewedProducts);
      if (data) {
        setData(data);
      }
    }
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto bg-white py-8 px-5 shadow-md rounded-lg">
      <h2 className="text-lg !font-bold text-left pb-6">SẢN PHẨM ĐÃ XEM</h2>
      <div>
        <div className="grid grid-cols-3 gap-3">
          {data.length > 0 &&
            data
              .reverse()
              .map((item) => (
                // <AccountViewedProductCard product={item} key={item.id} />
                <ProductCard product={item} key={item.id} />
              ))}
        </div>
        {data.length <= 0 && (
          <div className="flex items-center justify-center">
            <EmptyView title={"Quý khách chưa xem sản phẩm nào."} />
          </div>
        )}
      </div>
    </div>
  );
}
