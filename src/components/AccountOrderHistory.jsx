import { ConfigProvider, Tabs, Spin, Pagination } from "antd";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import BoxOrder from "./BoxOrder";
import EmptyView from "./EmptyView";
import { orderService } from "../services/order.service";
import { useAuth } from "../hooks/AuthContext";

export function AccountOrderHistory() {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [tabLabels, setTabLabels] = useState([
    { key: "1", label: "TẤT CẢ", count: 0 },
    { key: "2", label: "ĐANG XỬ LÝ", count: 0 },
    { key: "3", label: "HOÀN THÀNH", count: 0 },
    { key: "4", label: "HỦY", count: 0 },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  const getStatusByKey = (key) => {
    switch (key) {
      case "2":
        return "PENDING";
      case "3":
        return "SUCCESS";
      case "4":
        return "CANCEL";
      default:
        return "ALL";
    }
  };

  const fetchOrders = async (statusKey, page) => {
    setLoading(true);
    try {
      const status = getStatusByKey(statusKey);
      const { data, total } = await orderService.getOrdersByStatus(
        user.id,
        status,
        page,
        itemsPerPage
      );
      setOrders(data);
      setTotalOrders(total);
      setTabLabels((prev) =>
        prev.map((tab) =>
          tab.key === statusKey ? { ...tab, count: total } : tab
        )
      );
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  const onTabClick = (key) => {
    setActiveTab(key);
    setText("");
    setOrder(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchOrders(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const findOrder = async () => {
    if (!text) {
      setOrder(null);
      return;
    }
    setIsSearching(true);
    try {
      const found = await orderService.getOrderById(text);
      setOrder(found || null);
    } catch (error) {
      console.error("Lỗi khi tìm đơn hàng:", error);
      setOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white pt-8 px-5 mb-4 rounded-t-sm">
        <h2 className="text-lg !font-bold text-left">Quản lý đơn hàng</h2>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "rgba(0, 0, 0, 0.88)",
                itemHoverColor: "var(--color-text)",
                itemSelectedColor: "var(--color-text)",
                inkBarColor: "var(--color-primary)",
                titleFontSize: 14,
              },
            },
          }}
        >
          <Tabs
            items={tabLabels.map((tab) => ({
              key: tab.key,
              label:
                tab.key === activeTab
                  ? `${tab.label} (${tab.count})`
                  : tab.label,
            }))}
            onTabClick={onTabClick}
          />
        </ConfigProvider>
      </div>

      <div className="flex items-center mb-4 w-full bg-white border border-line-border rounded-sm justify-between">
        <div className="flex items-center flex-1 p-3 px-5">
          <Search className="text-secondary w-4 h-5 mr-2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng"
            className="placeholder:text-secondary outline-0"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </div>
        <div className="flex items-center">
          <div className="px-2 text-secondary">|</div>
          <button className="!text-sub pr-5 cursor-pointer" onClick={findOrder}>
            Tìm đơn hàng
          </button>
        </div>
      </div>

      {isSearching || loading ? (
        <Spin
          size="large"
          className="w-full h-full flex justify-center items-center"
        />
      ) : (
        <div>
          {text && order && <BoxOrder order={order} />}
          {text && !order && (
            <EmptyView title={"Quý khách chưa có đơn hàng nào."} />
          )}
          {!text && orders.length > 0
            ? orders.map((order) => <BoxOrder key={order.id} order={order} />)
            : !text && <EmptyView title={"Quý khách chưa có đơn hàng nào."} />}
        </div>
      )}

      {!text && totalOrders > 0 && (
        <Pagination
          current={currentPage}
          total={totalOrders}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          className="mt-4"
        />
      )}
    </div>
  );
}
