import React, { createContext, useState, useEffect } from "react";
import { productService } from "../services/product.service";
import { localStorageService } from "../services/localstorage.service";
import { orderService } from "../services/order.service";
import { userApi } from "../services/user.service";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true)

    // Lấy danh sách categories khi component mount
    useEffect(() => {

        const fetchData = async () => {

            try {
                const categoriesData = await productService.getListOfCategories();
                setCategories(categoriesData);

                const productsData = await productService.getProducts();
                setProducts(productsData);

                const brandsData = await productService.getListOfBrands();
                setBrands(brandsData);

                const ordersData = await orderService.getListOrders()
                setOrders(ordersData)

                const usersData = await userApi.getAllUsers()
                setUsers(usersData)

            } catch (error) {
                console.error("Error fetching:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    return (
        <AdminContext.Provider value={{ brands, setBrands, products, setProducts, categories, setCategories, loading, setLoading, orders, users}}>
            {children}
        </AdminContext.Provider>
    );
};