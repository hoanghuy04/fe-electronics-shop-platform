import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { useOutletContext, useParams } from "react-router-dom";
import { get } from "../services/request";
import HistoryCartItem from "./HistoryCartItem";

const AccountOrderHistoryDetail = () => {
  const params = useParams();
  const [order, setOrder] = useState();
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const findByOrder = async () => {
      const existingOrder = await get(`orders/${params.id}`);
      if (existingOrder) {
        setOrder(existingOrder);
        setLoading(true);
      } else {
        console.error("Không tìm thấy order với id này");
        setLoading(false);
      }
    };
    findByOrder();
  }, [params]);

  return (
    <Card title={`Chi tiết đơn hàng #${order?.orderId}`} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Thông tin khách hàng</h3>
          <p>
            <strong>Người nhận:</strong> {user.name}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order?.shipping_address.address.street},{" "}
            {order?.shipping_address.address.ward},{" "}
            {order?.shipping_address.address.district},{" "}
            {order?.shipping_address.address.province}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order?.shipping_address.phone}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h3>
          <p>
            <strong>Ngày đặt hàng:</strong> {order?.order_date}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {/* <Tag color={order.status === "Đã giao" ? "success" : "processing"}>
              {order.status}
            </Tag> */}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {order?.total_price.toLocaleString()}{" "}
            VNĐ
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2">Danh sách sản phẩm</h3>
      {order?.products.map((item) => (
        <HistoryCartItem product={item} key={item.id} />
      ))}
    </Card>
  );
};

export default AccountOrderHistoryDetail;
