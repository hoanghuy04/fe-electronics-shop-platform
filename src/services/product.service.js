import { toast } from "sonner";
import { get, post, put } from "./request";

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
          brands?.length > 0 ? brands.includes(product.brand) : true;

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

  getListOfCategories: async () => {
    try {
      const categories = await get("categories");
      if (!Array.isArray(categories)) {
        throw new Error("Dữ liệu danh mục không hợp lệ");
      }
      return categories;
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách danh mục:", error);
      return [];
    }
  },

  getListOfBrands: async () => {
    try {
      const brands = await get("brands");
      if (!Array.isArray(brands)) {
        throw new Error("Dữ liệu hãng không hợp lệ");
      }
      return brands;
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách hãng:", error);
      return [];
    }
  },

  addProduct: async (productData) => {
    try {
      const response = await post(`products`, {
        ...productData,
        created_at: new Date().toISOString(),
        total_sales: productData.total_sales || 0, 
      });
      return response.data; 
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Không thể thêm sản phẩm');
    }
  },
  
 updateProduct: async (id, productData) => {
    try {
      const response = await put(`products/${id}`, productData);
      return response.data; 
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật sản phẩm');
    }
  },
};