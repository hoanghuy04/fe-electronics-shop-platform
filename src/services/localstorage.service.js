export const localStorageService = {
    saveViewedProduct: (product) => {
      const viewedProducts =
        JSON.parse(localStorage.getItem("viewedProducts")) || [];
      if (!viewedProducts.some((p) => p.id === product.id)) {
        viewedProducts.push(product);
        localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
      }
    },
  
    getViewedProducts: () => {
      return JSON.parse(localStorage.getItem("viewedProducts")) || [];
    },
    
    clearViewedProducts: () => {
      localStorage.removeItem("viewedProducts");
    },
  };