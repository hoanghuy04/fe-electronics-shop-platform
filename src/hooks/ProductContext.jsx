import React, { createContext, useState, useEffect } from "react";
import { productService } from "../services/product.service";
import { localStorageService } from "../services/localstorage.service";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true)
    const [viewedProducts, setViewedProducts] = useState([]);

    // Lấy danh sách categories khi component mount
    useEffect(() => {
        const products = localStorageService.getViewedProducts();
        localStorageService.saveViewedProduct(products);
        
        const fetchData = async () => {
            setLoading(true)
            try {
                const categoriesData = await productService.getListOfCategories();
                setCategories(categoriesData);

                const productsData = await productService.getProducts();
                setProducts(productsData);

                const brandsData = await productService.getListOfBrands();
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
        <ProductContext.Provider value={{ brands, setBrands, products, setProducts, categories, setCategories, loading, setLoading, viewedProducts }}>
            {children}
        </ProductContext.Provider>
    );
};