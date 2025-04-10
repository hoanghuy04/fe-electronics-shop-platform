import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLatestOrder } from "../services/orderService";
import { CircleCheckBig } from "lucide-react";
import { Button } from "antd";
import useAddress from "../hooks/useAddress";

export default function CartStepFour() {
  const [order, setOrder] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  const address = {
    province: order?.shipping_address.address?.province,
    ward: order?.shipping_address.address?.ward,
    district: order?.shipping_address.address?.district,
    street: order?.shipping_address.address?.street,
  };

  const { province, district, ward } = useAddress(address);

  useEffect(() => {
    const fetchOrder = async () => {
      if (state?.order) {
        setOrder(state.order);
      } else {
        const lastOrder = await getLatestOrder();
        if (lastOrder) {
          setOrder(lastOrder);
        } else {
          throw new Error("No order found");
        }
      }
    };

    fetchOrder();
    return () => {
      sessionStorage.setItem("currentStep", "1");
    };
  }, [state, navigate]);

  return (
    <div className="p-5 bg-white">
      <div className="text-state-success bg-green-100 text-center p-4 mb-6 rounded-md flex items-center justify-center">
        <CircleCheckBig className="mr-2" />
        <div className="font-bold">Đặt hàng thành công</div>
      </div>

      <div className="my-5 text-center">
        Cảm ơn quý khách đã cho{" "}
        <span className="text-primary font-semibold">LinGanGuLi</span> có cơ hội
        được phụ vụ <br /> Nhân viên{" "}
        <span className="text-primary font-semibold">LinGanGuLi</span> sẽ liên
        hệ với quý khách trong thời gian sớm nhất
      </div>

      <div className="bg-body-bg p-5  ">
        <div className="flex justify-between items-center border-b border-secondary">
          <h2 className=" text-title py-3 ">
            ĐƠN HÀNG <strong className="ml-1">#{order?.id}</strong>
          </h2>
          <Link to="/" className="text-sub font-semibold">
            Quản lý đơn hàng
          </Link>
        </div>

        <div className="space-y-4 mt-5">
          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Khách hàng:</div>
            <div className="col-span-2 ">
              {order?.shipping_address.full_name}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Số điện thoại:</div>
            <div className="col-span-2">{order?.shipping_address.phone}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Địa chỉ nhận hàng:</div>
            <div className="col-span-2">
              {`${address.street}, ${ward?.full_name}, ${district?.full_name}, ${province?.full_name}`}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="font-semibold ">&#8226; Phí vận chuyển:</div>
            <div className="text-primary col-span-2 font-semibold">
              Miễn phí
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7 font-semibold">
            <div className="">&#8226; Tổng tiền:</div>
            <div className="text-primary col-span-2">
              {order?.total_price.toLocaleString()}₫
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7 ">
            <div className="font-semibold">&#8226; Ghi chú:</div>
            <div className=" col-span-2">{order?.note}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7 ">
            <div className="font-semibold">&#8226; Hình thức thanh toán:</div>
            <div className="col-span-2 ">Thanh toán khi giao hàng</div>
          </div>

          <div className="text-primary italic mb-7 font-semibold">
            * Tuyệt đối không chuyển khoản cho Shipper trước khi nhận hàng.
          </div>
        </div>

        <Button
          variant="dashed"
          color="orange"
          block
          className="w-full !p-5 rounded-sm text-xl !font-bold cursor-pointer !bg-orange-50"
        >
          Đơn hàng chưa được thanh toán
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        <Link to="/">
          <Button
            block
            type="text"
            variant="outlined"
            className="cursor-pointer !p-5 rounded-sm text-xl !font-bold !text-sub !border-sub"
          >
            Tiếp tục mua hàng
          </Button>
        </Link>
      </div>
    </div>
  );
}
