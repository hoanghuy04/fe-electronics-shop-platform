import { useOutletContext } from "react-router-dom";
import { path } from "../constants/path";

export default function CartStepThree() {
  const { handlePlaceOrder } = useOutletContext();

  return (
    <div>
      CartStepThree
      <div className="w-full bg-white mt-5">
        <div className=" w-full">
          <button
            onClick={() => {
              handlePlaceOrder(path.cartStepFour);
            }}
            className="w-full p-3 rounded-sm bg-blue-500 !text-white text-xl font-bold cursor-pointer"
          >
            Đặt hàng ngay
          </button>
        </div>
      </div>
    </div>
  );
}
