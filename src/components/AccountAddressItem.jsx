import { Button, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import useAddress from "../hooks/useAddress";

const AccountAddressItem = (props) => {
  const {
    isDefault,
    address,
    handleDeleteAddress,
    showEditModal,
    handleSetDefault,
  } = props;
  const { province, district, ward } = useAddress(address);

  const handleDelete = () => {
    handleDeleteAddress(address);
  };

  return (
    <div className="border-t border-line-border flex gap-2 py-4 flex-col">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          {isDefault && (
            <div className="rounded-sm text-sm text-primary border border-primary py-1 px-2">
              Mặc định
            </div>
          )}
          <div className="text-sm font-semibold">{address.name}</div>
          <div className="text-sm text-gray-600">| {address.phone}</div>
        </div>
        <div className="flex gap-5 text-sm">
          <button
            type="link"
            className="!text-sub !font-semibold cursor-pointer"
            onClick={showEditModal}
          >
            Cập nhật
          </button>

          {!isDefault && (
            <Popconfirm
              title="Xoá địa chỉ"
              description="Bạn có chắc chắn muốn xoá địa chỉ này?"
              onConfirm={handleDelete}
              okText="Có"
              cancelText="Không"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              okButtonProps={{
                style: {
                  backgroundColor: "var(--color-primary)",
                  borderColor: "#ff0000",
                },
              }}
              cancelButtonProps={{
                type: "text",
                style: {
                  backgroundColor: "var(--color-body-bg)",
                },
              }}
            >
              <button
                type="link"
                className="!text-sub !font-semibold !text-right cursor-pointer"
              >
                Xóa
              </button>
            </Popconfirm>
          )}
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div className="text-sm text-gray-600">{`${address.street}, ${ward?.full_name}, ${district?.full_name}, ${province?.full_name}`}</div>
        {!isDefault && (
          <Button
            className="!font-semibold !border !border-line-border cursor-pointer"
            onClick={() => {
              handleSetDefault(address);
            }}
          >
            Thiết lập mặc định
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccountAddressItem;
