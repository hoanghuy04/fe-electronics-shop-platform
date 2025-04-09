import { ConfigProvider, Button, Tabs, Spin } from "antd";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { get } from "../services/request";
import BoxOrder from "./BoxOrder";
import NotFoundOrder from "./NotFoundOrder";
import { getOrdersByStatus } from "../services/orderService";

const { TabPane } = Tabs;

export function AccountOrderHistory() {
  const [order, setOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [tabLabels, setTabLabels] = useState({
    1: "TẤT CẢ",
    2: "ĐANG XỬ LÝ",
    3: "HOÀN THÀNH",
    4: "HUỶ",
  });

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
        setTabLabels({
          1: `TẤT CẢ (${orders.length})`,
          2: "ĐANG XỬ LÝ",
          3: "HOÀN THÀNH",
          4: "HUỶ",
        });
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
      let orders;
      switch (key) {
        case "1":
          orders = await getOrdersByStatus();
          setTabLabels((prev) => ({ ...prev, 1: `TẤT CẢ (${orders.length})` }));
          break;
        case "2":
          orders = await getOrdersByStatus("Đang xử lý");
          setTabLabels((prev) => ({
            ...prev,
            2: `ĐANG XỬ LÝ (${orders.length})`,
          }));
          break;
        case "3":
          orders = await getOrdersByStatus("Hoàn thành");
          setTabLabels((prev) => ({
            ...prev,
            3: `HOÀN THÀNH (${orders.length})`,
          }));
          break;
        case "4":
          orders = await getOrdersByStatus("Huỷ");
          setTabLabels((prev) => ({ ...prev, 4: `HUỶ (${orders.length})` }));
          break;
        default:
          orders = [];
      }
      setFilteredOrders(orders);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng theo trạng thái:", error);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
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
          <Tabs activeKey={activeTab} onTabClick={onTabClick}>
            {Object.entries(tabLabels).map(([key, label]) => (
              <TabPane tab={label} key={key}></TabPane>
            ))}
          </Tabs>
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
        <div className="overflow-y-auto max-h-96">
          {text && order && <BoxOrder order={order} />}
          {text && !order && <NotFoundOrder />}

          {!text && filteredOrders.length > 0
            ? filteredOrders.map((order) => (
                <BoxOrder order={order} key={order.id} />
              ))
            : !text && <NotFoundOrder />}
        </div>
      )}
    </div>
  );
}
