import { Button } from "antd";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center py-5">
      <div>Giỏ hàng của bạn đang trống</div>
      <Link to="/">
        <Button
          variant="outlined"
          color="blue"
          size="large"
          className="!font-semibold"
        >
          TIẾP TỤC MUA HÀNG
        </Button>
      </Link>
    </div>
  );
}
