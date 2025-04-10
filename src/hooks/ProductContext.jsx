import React, { createContext, useState, useEffect } from "react";
import { getListOfBrands, getListOfCategories, getProducts } from "../services/productService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true)

    // Lấy danh sách categories khi component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const categoriesData = await getListOfCategories();
                setCategories(categoriesData);

                const productsData = await getProducts();
                setProducts(productsData);

                const brandsData = await getListOfBrands();
                setBrands(brandsData);

            } catch (error) {
                console.error("Error fetching:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    return (
        <ProductContext.Provider value={{ brands, setBrands, products, setProducts, categories, setCategories, loading, setLoading }}>
            {children}
        </ProductContext.Provider>
    );
};