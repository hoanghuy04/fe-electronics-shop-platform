import React from "react";
import { Spin } from "antd";

const SpinLoading = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[9999]">
      <div className="text-center p-4 rounded-lg">
        <div className="[&_.ant-spin-dot_item]:!bg-red-500">
          <Spin size="large" />
        </div>
      </div>
    </div>
  );
};

export default SpinLoading;
