import { useNavigate } from "react-router-dom";

const Breadcrumbs = ({ current }) => {
  const navigate = useNavigate();

  const forwardTab = () => {
    navigate(-1);
  };

  return (
    <div className="bg-body-bg p-5">
      <span>
        <button
          className="px-2 text-lg !text-blue-500 font-semibold cursor-pointer flex gap-4"
          onClick={forwardTab}
        >
          <span>&#60;</span> {current === 0 ? "Mua sản phẩm khác" : "Trở về"}
        </button>
      </span>
    </div>
  );
};

export default Breadcrumbs;
