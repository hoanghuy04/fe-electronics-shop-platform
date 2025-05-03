import "./index.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import CartProvider from "./hooks/useCart.jsx";
import "antd/dist/reset.css";
import { ProductProvider } from "./hooks/ProductContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </BrowserRouter>
);
