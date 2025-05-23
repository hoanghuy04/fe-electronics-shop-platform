import React, { createContext, useState, useEffect } from "react";
import { productService } from "../services/product.service";
import { localStorageService } from "../services/localstorage.service";
import { categoryService } from "../services/category.service";
import { brandService } from "../services/brand.service";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true)
    const [viewedProducts, setViewedProducts] = useState([]);

    // Lấy danh sách categories khi component mount
    useEffect(() => {

        const fetchData = async () => {
            setLoading(true)
            const products = localStorageService.getViewedProducts();

            if (products.length > 0) {
                const uniqueProducts = products.filter((item, index) => {
                    return products.findIndex((i) => i.id === item.id) === index;
                });
                setViewedProducts(uniqueProducts);
                // localStorageService.saveViewedProduct(uniqueProducts);
            }

            try {
                const categoriesData = await categoryService.getListOfCategories();
                setCategories(categoriesData);

                const productsData = await productService.getProducts();
                setProducts(productsData);

                const brandsData = await brandService.getAllBrands();
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
        <ProductContext.Provider value={{ brands, setBrands, products, setProducts, categories, setCategories, loading, setLoading, viewedProducts, setViewedProducts }}>
            {children}
        </ProductContext.Provider>
    );
};