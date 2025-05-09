// Hàm chuyển đổi dữ liệu từ định dạng ban đầu sang định dạng cho biểu đồ
export function transformCategoryData(categories, products) {
  return categories
    .map((category) => {
      const activeSales = products
        .filter((product) => product.category_id === category.id && product.active === 1)
        .reduce((sum, product) => sum + (product.total_sales || 0), 0)

      const inactiveSales = products
        .filter((product) => product.category_id === category.id && product.active === 0)
        .reduce((sum, product) => sum + (product.total_sales || 0), 0)

      // Chỉ trả về các danh mục có doanh số > 0
      if (activeSales > 0 || inactiveSales > 0) {
        return {
          category_name: category.name,
          active: activeSales,
          inactive: inactiveSales,
        }
      }
      return null
    })
    .filter(Boolean) // Loại bỏ các giá trị null
}
