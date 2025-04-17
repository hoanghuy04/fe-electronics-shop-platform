import "./index.css";
import App from "./App.jsx";
// import { Provider } from "react-redux";
// import allReducers from "./store/store.js";
import { createRoot } from "react-dom/client";
import CartProvider from "./hooks/useCart.jsx";
import "antd/dist/reset.css";
import AuthProvider from "./hooks/AuthContext.jsx";
// import { ConfigProvider } from "antd";
createRoot(document.getElementById("root")).render(
  // <Provider store={allReducers}>
  //   <App />
  // </Provider>

  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>



);





