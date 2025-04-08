import React, { useState } from "react";
import { Button, Modal } from "antd";
import { AccountAddressModal } from "./AccountAddressModal";

export function AccountAddress() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg h-full">
      <div className="flex items-center justify-between border-b border-line-border pb-5">
        <h2 className="text-xl !font-semibold text-left mb-6">
          Thông tin địa chỉ
        </h2>
        <Button
          className="!bg-blue-border !text-white !font-semibold border-blue-border"
          onClick={showModal}
        >
          + Thêm địa chỉ mới
        </Button>
      </div>

      <div className="flex  gap-2 items-center justify-between my-4">
        <div className="flex gap-2 items-center">
          <div className=" rounded-sm text-sm text-primary border border-primary py-1 px-2 ">
            Mặc định
          </div>
          <div className="text-sm font-semibold">Huyền Trần Ngọc</div>
          <div className="text-sm text-gray-600">| 0964424149</div>
        </div>
        <Button
          type="link"
          className="!text-blue-500 !font-semibold"
          onClick={showModal}
        >
          Cập nhật
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, Hồ Chí Minh
      </div>
      <div className="flex justify-between mt-6"></div>

      <Modal
        title="Địa chỉ mới"
        width={500}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <AccountAddressModal />
      </Modal>
    </div>
  );
}
