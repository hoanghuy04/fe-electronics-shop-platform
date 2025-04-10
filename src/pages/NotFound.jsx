import { Button } from "antd";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white">
      <div className="max-w-[70%]">
        <img
          src={`public/404.webp`}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center font-semibold mb-5">
        <p className="mb-5"> Rất tiếc trang bạn tìm kiếm đang không tồn tại</p>
        <p>
          {" "}
          Nếu bạn cần hỗ trợ, vui lòng liên hệ tổng đài{" "}
          <a href="tel:0964424149" className="text-primary">
            {" "}
            0123 456 789
          </a>
        </p>
      </div>
      <Link to="/">
        <Button
          variant="outlined"
          className="!border !border-sub !text-sub !py-5 !px-10 rounded-sm"
        >
          QUAY LẠI TRANG CHỦ
        </Button>
      </Link>
    </div>
  );
}
