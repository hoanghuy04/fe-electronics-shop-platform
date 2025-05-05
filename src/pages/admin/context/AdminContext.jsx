// src/context/AdminContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, ordersRes, revenueRes] = await Promise.all([
                axios.get("http://localhost:3000/products"),
                axios.get("http://localhost:3000/orders"),
                axios.get("http://localhost:3000/revenue"),
            ]);
            setProducts(productsRes.data);
            setOrders(ordersRes.data);
            setRevenue(revenueRes.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AdminContext.Provider value={{ products, orders, revenue, loading, fetchData }}>
            {children}
        </AdminContext.Provider>
    );
};