import React, { useState } from "react";
import { Button, Modal } from "antd";
import { AccountAddressModal } from "./AccountAddressModal";
import AccountAddressItem from "./AccountAddressItem";
import { useOutletContext } from "react-router-dom";
import { patch } from "../services/request";

export function AccountAddress() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [addressData, setAddressData] = useState(null);
  const { user } = useOutletContext();

  const showAddModal = () => {
    setIsAdd(true);
    setAddressData(null);
    setIsModalOpen(true);
  };

  const showEditModal = (address) => {
    setIsAdd(false);
    setAddressData(address);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteAddress = (address) => {
    const userClone = { ...user };
    userClone.address = userClone.address.filter(
      (a) => a.name !== address.name || a.phone !== address.phone
    );
    handleUpdateUser(userClone);
  };

  const handleAddAddress = (address) => {
    const userClone = { ...user };
    userClone.address = [...userClone.address, address];
    handleUpdateUser(userClone);
    setIsModalOpen(false);
  };

  const handleUpdateAddress = (updatedAddress) => {
    const userClone = { ...user };
    userClone.address = userClone.address.map((address) =>
      address.id === updatedAddress.id ? updatedAddress : address
    );
    handleUpdateUser(userClone);
    setIsModalOpen(false);
  };

  const handleSetDefault = (selectedAddress) => {
    const userClone = { ...user };
    userClone.address = userClone.address.map((addr) => ({
      ...addr,
      default: addr.id === selectedAddress.id ? 1 : 0,
    }));
    handleUpdateUser(userClone);
  };

  const handleUpdateUser = async (data) => {
    await patch(`users/${data.id}`, data);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white py-8 px-5 shadow-md rounded-lg h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg !font-semibold text-left pb-4">
          Thông tin tài khoản
        </h2>
        <Button
          className="!bg-blue-border !text-white !font-semibold border-blue-border"
          onClick={showAddModal}
        >
          + Thêm địa chỉ mới
        </Button>
      </div>

      <div>
        {[...user.address]
          .sort((a, b) => b.default - a.default)
          .map((item) => (
            <AccountAddressItem
              key={item.id}
              isDefault={item.default === 1 ? true : false}
              name={user.name}
              phone={user.phone}
              address={item}
              handleDeleteAddress={handleDeleteAddress}
              showEditModal={() => showEditModal(item)}
              handleSetDefault={handleSetDefault}
            />
          ))}
      </div>

      <Modal
        width={800}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <AccountAddressModal
          isAdd={isAdd}
          addressData={addressData}
          handleAddAddress={handleAddAddress}
          handleUpdateAddress={handleUpdateAddress}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
}
