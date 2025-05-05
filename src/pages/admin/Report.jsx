import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Line } from "@ant-design/plots";
import axios from "axios";

const Report = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:3000/revenue")
            .then((response) => {
                setRevenueData(response.data);
            })
            .catch(() => {
                setRevenueData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Cấu hình biểu đồ Line
    const config = {
        data: revenueData,
        xField: "date",
        yField: "amount",
        point: {
            size: 5,
            shape: "diamond",
        },
        label: {
            style: {
                fill: "#aaa",
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            date: { alias: "Ngày" },
            amount: { alias: "Doanh thu (VNĐ)" },
        },
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Báo cáo doanh thu</h1>
            <Card>
                <h2 className="text-lg font-semibold mb-4">Doanh thu theo ngày</h2>
                {loading ? <div>Đang tải...</div> : <Line {...config} />}
            </Card>
        </div>
    );
};

export default Report;