import { ConfigProvider, Button, Tabs, Spin, Pagination } from "antd";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { get } from "../services/request";
import BoxOrder from "./BoxOrder";
import NotFoundOrder from "./NotFoundOrder";
import { getOrdersByStatus } from "../services/orderService";

export function AccountOrderHistory() {
  const [order, setOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [tabLabels, setTabLabels] = useState([
    { key: "1", label: "TẤT CẢ", count: 0 },
    { key: "2", label: "ĐANG XỬ LÝ", count: 0 },
    { key: "3", label: "HOÀN THÀNH", count: 0 },
    { key: "4", label: "HUỶ", count: 0 },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const findOrder = () => {
    const fetchOrder = async () => {
      if (!text) {
        setOrder(null);
        return;
      }

      setIsSearching(true);
      try {
        const existingOrder = await get(`orders/${text}`);
        if (existingOrder) {
          setOrder(existingOrder);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Lỗi khi tìm đơn hàng:", error);
        setOrder(null);
      } finally {
        setIsSearching(false);
      }
    };

    fetchOrder();
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const orders = await getOrdersByStatus();
        setFilteredOrders(orders);
        setTabLabels((prev) => [
          { ...prev[0], count: orders.length },
          ...prev.slice(1),
        ]);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const onTabClick = async (key) => {
    setActiveTab(key);
    setText("");
    setOrder(null);
    setLoading(true);

    try {
      let status;
      switch (key) {
        case "1":
          status = undefined;
          break;
        case "2":
          status = "PENDING";
          break;
        case "3":
          status = "SUCCESS";
          break;
        case "4":
          status = "CANCEL";
          break;
        default:
          status = undefined;
      }

      const orders = await getOrdersByStatus(status);

      setTabLabels((prev) =>
        prev.map((tab) =>
          tab.key === key ? { ...tab, count: orders.length } : tab
        )
      );

      setFilteredOrders(orders);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng theo trạng thái:", error);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
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
            onChange={(e) => {
              setText(e.target.value);
            }}
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
          {text && !order && <NotFoundOrder />}

          {!text && filteredOrders.length > 0
            ? getPaginatedOrders().map((order) => (
                <BoxOrder order={order} key={order.id} />
              ))
            : !text && <NotFoundOrder />}
        </div>
      )}

      {!text && filteredOrders.length > 0 && (
        <Pagination
          current={currentPage}
          total={filteredOrders.length}
          align="center"
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          className="mt-4"
        />
      )}
    </div>
  );
}
