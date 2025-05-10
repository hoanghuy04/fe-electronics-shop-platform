import { Card, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export const OverviewItem = ({
  title,
  value,
  icon,
  change,
  className,
  iconClassName,
}) => {
  const isPositive = change?.value >= 0;
  const isNegative = change?.value < 0;

  return (
    <Card className={("rounded-lg border shadow-sm h-full", className)}>
      <div className="flex justify-between items-start">
        <div>
          <Typography.Text className=" text-gray-500 font-medium !text-xl">
            {title}
          </Typography.Text>
          <Typography.Title
            level={3}
            className="!my-5 !text-3xl !p-0 !font-bold"
          >
            {value}
          </Typography.Title>

          <div className="!flex !items-center mt-2">
            {isPositive && <ArrowUpOutlined className="!text-green-600 mr-1" />}
            {isNegative && <ArrowDownOutlined className="!text-red-600 mr-1" />}
            <Typography.Text
              className={
                ("text-xs font-medium !flex !items-center",
                isPositive ? "text-green-500" : "",
                isNegative ? "text-red-500" : "")
              }
            >
              <div className="flex items-center">
                {isPositive && (
                  <div className="text-green-600 font-bold">
                    {change.value}%
                  </div>
                )}
                {isNegative && (
                  <div className="text-red-600 font-bold">{change.value}%</div>
                )}
              </div>
            </Typography.Text>
            {change.text && (
              <Typography.Text className="text-xs text-gray-500 ml-1">
                {change.text}
              </Typography.Text>
            )}
          </div>
        </div>

        <div
          className={`flex items-center justify-center text-2xl ${iconClassName}
          `}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
