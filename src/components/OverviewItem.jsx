import { Skeleton } from "antd";
import React from "react";

export default function OverviewItem({
  title,
  value,
  icon,
  iconBgClass,
  valueColorClass,
  loading = false,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className={`${iconBgClass} p-3 rounded-full mr-4`}>{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {loading ? (
          <Skeleton.Input active size="default" style={{ width: 80 }} />
        ) : (
          <p className={`text-3xl font-bold ${valueColorClass}`}>{value}</p>
        )}
      </div>
    </div>
  );
}
