import { Button } from "antd";
import { Link } from "react-router-dom";

export default function CartNotification({ product }) {
  return (
    <>
      {product && (
        <div className="w-72 absolute left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-sm shadow-lg">
          <p className="text-green-600 font-semibold text-sm text-center mb-2">
            Thêm vào giỏ hàng thành công
          </p>
          <div className="grid grid-cols-3 gap-3 w-full h-full">
            <img
              className="w-full h-full"
              src={
                product.image_url &&
                product.image_url.length > 0 &&
                product?.image_url[0]
              }
              alt={product.title}
            />
            <div className="col-span-2">
              <p className="text-sm font-semibold text-title">
                {product.title}
              </p>
            </div>
          </div>
          <Link to="/cart">
            <Button
              type="primary"
              className="w-full !mt-3 !bg-orange-500 !hover:bg-orange-600"
            >
              XEM GIỎ HÀNG
            </Button>
          </Link>
          <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-b-white border-transparent"></div>
        </div>
      )}
    </>
  );
}
