import { Steps } from "antd";
import dayjs from "dayjs";

export default function StepOrderStatus({ currentStatus, history }) {
  if (!history) return null;

  const ORDER_FLOW = [
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "PROCESSING", label: "Đang xử lý" },
    { key: "SHIPPED", label: "Đã gửi hàng" },
    { key: "DELIVERED", label: "Đã giao hàng" },
  ];

  const CANCEL_STEP = { key: "CANCELLED", label: "Đã huỷ" };

  const historyMap = {};
  (history || []).forEach((item) => {
    historyMap[item.status] = item;
  });

  const stepsToRender = [...ORDER_FLOW];

  if (currentStatus === "CANCELLED") {
    const lastStatusBeforeCancel = [...history]
      .reverse()
      .find((h) => h.status !== "CANCELLED")?.status;

    const insertIndex =
      ORDER_FLOW.findIndex((s) => s.key === lastStatusBeforeCancel) + 1;
    stepsToRender.splice(insertIndex, 0, CANCEL_STEP);
  }

  return (
    <Steps
      size="small"
      current={stepsToRender.findIndex((s) => s.key === currentStatus)}
    >
      {stepsToRender.map((step) => {
        const historyItem = historyMap[step.key];
        const isCancelled = step.key === "CANCELLED";

        return (
          <Steps.Step
            key={step.key}
            status={isCancelled ? "error" : historyItem ? "finish" : "wait"}
            title={step.label}
            description={
              historyItem
                ? `${dayjs(historyItem.updated_at).format(
                    "HH:mm:ss D/M/YYYY"
                  )}: ${historyItem.note}`
                : "Chưa có dữ liệu"
            }
          />
        );
      })}
    </Steps>
  );
}
