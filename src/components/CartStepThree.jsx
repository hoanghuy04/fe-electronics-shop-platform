import { useNavigate, useOutletContext } from "react-router-dom";

export default function CartStepThree() {
  const setCurrentStep = useOutletContext();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    setCurrentStep(2);
    navigate("/cart/step-four");
  };
  return (
    <div>
      CartStepThree
      <div className="w-full bg-white mt-5">
        <div className=" w-full">
          <button
            onClick={handlePlaceOrder}
            className="w-full p-3 rounded-sm bg-blue-500 !text-white text-xl font-bold cursor-pointer"
          >
            Đặt hàng ngay
          </button>
        </div>
      </div>
    </div>
  );
}
