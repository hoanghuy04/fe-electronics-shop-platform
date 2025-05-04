import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import DefaultLayout from "./../layout/DefaultLayout";
import CartStepOne from "../components/CartStepOne";
import CartStepTwo from "../components/CartStepTwo";
import CartStepThree from "../components/CartStepThree";
import CartStepFour from "../components/CartStepFour";
import { path } from "../constants/path";
import Account from "../pages/client/Account";
import { AccountProfile } from "../components/AccountProfile";
import { AccountAddress } from "../components/AccountAddress";
import { AccountOrderHistory } from "../components/AccountOrderHistory";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import PaymentInstructions from "../pages/client/PaymentInstructions";
import "antd/dist/reset.css";
import AccountViewedProduct from "../components/AccountViewedProduct";
import AccountOrderHistoryDetail from "../components/AccountOrderHistoryDetail";
import Contact from "../pages/client/Contact";
import { useAuth } from "../hooks/AuthContext";

// Lazy loading
const Home = lazy(() => import("../pages/client/Home"));
const ProductDetail = lazy(() => import("../pages/client/ProductDetail"));
const Cart = lazy(() => import("../pages/client/Cart"));
const NotFound = lazy(() => import("../pages/client/NotFound"));
const ListProduct = lazy(() => import("../pages/client/ListProduct"));

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

function RejectedRoute() {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

const routes = [
  {
    path: path.home,
    element: <DefaultLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: path.notFound, element: <NotFound /> },
      { path: path.productDetail, element: <ProductDetail /> },
      { path: path.productCategory, element: <ListProduct /> },

      {
        path: path.cart,
        element: <Cart />,
        children: [
          { path: "", element: <CartStepOne /> },
          {
            path: "",
            element: <ProtectedRoute />,
            children: [
              { path: path.cartStepTwo, element: <CartStepTwo /> },
              { path: path.cartStepThree, element: <CartStepThree /> },
              { path: path.cartStepFour, element: <CartStepFour /> },
            ],
          },
        ],
      },

      {
        path: "",
        element: <ProtectedRoute />,
        children: [
          {
            path: path.account,
            element: <Account />,
            children: [
              { path: "", element: <AccountProfile /> },
              { path: path.address, element: <AccountAddress /> },
              { path: path.orderHistory, element: <AccountOrderHistory /> },
              {
                path: path.orderHistoryDetail,
                element: <AccountOrderHistoryDetail />,
              },
              { path: path.viewed, element: <AccountViewedProduct /> },
            ],
          },
        ],
      },

      { path: path.contact, element: <Contact /> },
      { path: path.paymentInstruction, element: <PaymentInstructions /> },

      {
        path: "",
        element: <RejectedRoute />,
        children: [
          { path: path.login, element: <LoginPage /> },
          { path: path.register, element: <RegisterPage /> },
        ],
      },

      { path: "*", element: <Navigate to={path.notFound} /> },
    ],
  },
];

export default routes;
