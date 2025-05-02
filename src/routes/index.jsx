import { lazy } from "react";
import { Navigate } from "react-router-dom";
import DefaultLayout from "./../layout/DefaultLayout";
import CartStepOne from "../components/CartStepOne";
import CartStepTwo from "../components/CartStepTwo";
import CartStepThree from "../components/CartStepThree";
import CartStepFour from "../components/CartStepFour";
import { path } from "../constants/path";
import Account from "../pages/Account";
import { AccountProfile } from "../components/AccountProfile";
import { AccountAddress } from "../components/AccountAddress";
import { AccountOrderHistory } from "../components/AccountOrderHistory";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import ContactPage from "../components/ContactPage";
import PaymentInstructions from "../components/PaymentInstructions";

import "antd/dist/reset.css";

import AccountViewedProduct from "../components/AccountViewedProduct";
import AccountOrderHistoryDetail from "../components/AccountOrderHistoryDetail";


// Lazy loading để tối ưu hiệu suất
const Home = lazy(() => import("../pages/Home"));
// const HP = lazy(() => import("../pages/HP"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ListProduct = lazy(() => import("../pages/ListProduct"));

const getCurrentStep = () => {
  return parseInt(sessionStorage.getItem("currentStep")) || 1;
};

const ProtectedStep = ({ step, element }) => {
  const currentStep = getCurrentStep();
  return currentStep >= step ? (
    element
  ) : (
    <Navigate
      to={`${path.cart}${currentStep > 1 ? `/step-${currentStep}` : ""}`}
    />
  );
};

const routes = [
  {
    path: path.home,
    element: <DefaultLayout />,
    children: [
      // { path: "", element: <Home /> },
      { path: path.notFound, element: <NotFound /> },
      { path: "", element: <Home /> },
      { path: path.productDetail, element: <ProductDetail /> },
      { path: path.productCategory, element: <ListProduct /> },
      {
        path: path.cart,
        element: <Cart />,
        children: [
          { path: "", element: <CartStepOne /> },
          {
            path: path.cartStepTwo,
            element: <ProtectedStep step={2} element={<CartStepTwo />} />,
          },
          {
            path: path.cartStepThree,
            element: <ProtectedStep step={3} element={<CartStepThree />} />,
          },
          {
            path: path.cartStepFour,
            element: <ProtectedStep step={4} element={<CartStepFour />} />,
          },

        ],
      },
      {
        path: path.account,
        element: <Account />,
        children: [
          {
            path: "",
            element: <AccountProfile />,
          },
          {
            path: path.address,
            element: <AccountAddress />,
          },
          {
            path: path.orderHistory,
            element: <AccountOrderHistory />,
          },
          {
            path: path.orderHistoryDetail,
            element: <AccountOrderHistoryDetail />,
          },
          {
            path: path.viewed,
            element: <AccountViewedProduct />,
          },
        ],
      },
      { path: "*", 
        element: <Navigate to={path.notFound} /> 
      },
      {
        path: "/login",
        element: <LoginPage/>,
      },
      {
        path: "/register",
        element: <RegisterPage/>,
      },
      {
        path: "/contact",
        element: <ContactPage/>,
      },
      {
        path: "/paymentinstructions",
        element: <PaymentInstructions/>,
      },
    ],
  },
];

export default routes;
