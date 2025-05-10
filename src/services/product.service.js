import { toast } from "sonner";
import { get, patch, post, put } from "./request";

export const productService = {
  getProducts: async () => {
    try {
      const products = await get("products");
      if (!Array.isArray(products)) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ");
      }
      return products;
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách sản phẩm:", error);
      return [];
    }
  },

  searchProductsByTitle: async (keyword) => {
    try {
      const products = await productService.getProducts();
      if (!keyword?.trim()) return products;
      return products.filter((p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
      );
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm sản phẩm theo tiêu đề:", error);
      return [];
    }
  },

  searchProductsBySlug: async (slug) => {
    try {
      const products = await get(`products?slug=${slug}`);
      if (!Array.isArray(products)) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ");
      }
      return products;
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm sản phẩm theo slug:", error);
      return [];
    }
  },

  searchProductsByFilters: async (filters) => {
    try {
      const { categorySlug, priceRange, brands, descriptionFilters } = filters;
      const products = await productService.getProducts();

      // Lấy ID của danh mục theo categorySlug
      const categories = await productService.getListOfCategories();
      const category = categories.find((cat) => cat.slug === categorySlug);
      const categoryId = category ? category.id : null;

      //Lấy ra id của các hãng theo brands
      const brandsList = await productService.getListOfBrands();
      const brandIds = brandsList
        .filter((brand) => brands.includes(brand.name))
        .map((brand) => brand.id);

      return products.filter((product) => {
        // Lọc theo danh mục
        const matchCategory =
          !categorySlug || categorySlug === "all"
            ? true
            : product.category_id == categoryId;

        // Lọc theo giá
        const matchPrice =
          priceRange?.length === 2
            ? product.price >= priceRange[0] && product.price <= priceRange[1]
            : true;

        // Lọc theo hãng
        const matchBrand =
          !brands?.length || brands.includes("all")
            ? true
            : brandIds.includes(product.brand_id);

        // Lọc theo thuộc tính động trong descriptionFilters
        const matchDescription = Object.keys(descriptionFilters || {}).every(
          (key) => {
            const selectedValues = descriptionFilters[key];
            if (!selectedValues?.length) return true; // Không có giá trị được chọn, bỏ qua

            const productValue = product.description?.[key];
            if (!productValue) return false; // Sản phẩm không có thuộc tính này

            // So sánh trực tiếp giá trị gốc với các giá trị được chọn
            return selectedValues.some((value) => productValue === value);
          }
        );

        return matchCategory && matchPrice && matchBrand && matchDescription;
      });
    } catch (error) {
      toast.error("Lỗi khi lọc sản phẩm:", error);
      return [];
    }
  },

  addProduct: async (productData) => {
    console.log("Adding product with data:", productData); // Debug log
    try {
      const response = await post(`products`, {
        ...productData,
        created_at: new Date().toISOString(),
        total_sales: productData.total_sales || 0,
      });
      console.log("Add product response:", response); // Debug log
      return response;
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.message || error.message
      );
      throw new Error(
        error.response?.message || "Không thể thêm sản phẩm"
      );
    }
  },

  updateProduct: async (id, productData) => {
  try {
    const response = await patch(`products/${id}`, productData);
    console.log("Update product response:", response); // Debug log
    if (!response) {
      throw new Error("No data returned from update operation");
    }
    return response;
  } catch (error) {
    console.error("Error updating product:", error.response?.data || error.message);
  }
},

  getProductById: async (id) => {
    try {
      return await get(`products/${id}`);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      return null;
    }
  },

  getProductsByBrandId: async (brandId) => {
    try {
      return await get(`products?brand_id=${brandId}`);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo brand:", error);
      return [];
    }
  },

  getOutOfStockProducts: async () => {
    try {
      return await get("products?stock_lte=0");
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách sản phẩm hết hàng:", error);
      return [];
    }
  },
};
