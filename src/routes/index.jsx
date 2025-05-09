import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import DefaultLayout from "./../layout/DefaultLayout";
import DefaultLayoutAdmin from "./../layout/DefaultLayoutAdmin";
import CartStepOne from "../components/CartStepOne";
import CartStepTwo from "../components/CartStepTwo";
import CartStepThree from "../components/CartStepThree";
import CartStepFour from "../components/CartStepFour";
import { path } from "../constants/path";
import Account from "../pages/client/Account";
import { AccountProfile } from "../components/AccountProfile";
import { AccountAddress } from "../components/AccountAddress";
import { AccountOrderHistory } from "../components/AccountOrderHistory";
import PaymentInstructions from "../pages/client/PaymentInstructions";
import AccountViewedProduct from "../components/AccountViewedProduct";
import AccountOrderHistoryDetail from "../components/AccountOrderHistoryDetail";
import Contact from "../pages/client/Contact";
import {
  AdminProtectedRoute,
  RejectedRoute,
  UserProtectedRoute,
} from "./RouteGuard";
import BrandManagement from "../pages/admin/BrandManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Lazy loading client pages
const Home = lazy(() => import("../pages/client/Home"));
const ProductDetail = lazy(() => import("../pages/client/ProductDetail"));
const Cart = lazy(() => import("../pages/client/Cart"));
const NotFound = lazy(() => import("../pages/client/NotFound"));
const ListProduct = lazy(() => import("../pages/client/ListProduct"));

// Lazy loading admin pages
const Overview = lazy(() => import("../pages/admin/Overview"));
const ProductManagement = lazy(() =>
  import("../pages/admin/ProductManagement")
);
const OrderManagement = lazy(() => import("../pages/admin/OrderManagement"));
const Reports = lazy(() => import("../pages/admin/Reports"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));

const routes = [
  {
    path: path.home,
    element: <DefaultLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: path.notFound, element: <NotFound /> },
      { path: path.productDetail, element: <ProductDetail /> },
      { path: path.productCategoryBrand, element: <ListProduct /> },
      {
        path: path.cart,
        element: <Cart />,
        children: [
          { path: "", element: <CartStepOne /> },
          {
            path: "",
            element: <UserProtectedRoute />,
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
        element: <UserProtectedRoute />,
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
      { path: "*", element: <Navigate to={path.notFound} /> },
    ],
  },
  {
    path: "",
    element: <RejectedRoute />,
    children: [
      { path: path.login, element: <LoginPage /> },
      { path: path.register, element: <RegisterPage /> },
    ],
  },
  {
    path: "",
    element: <AdminProtectedRoute />,
    children: [
      {
        path: path.homeAdmin,
        element: <DefaultLayoutAdmin />,
        children: [
          { path: "", element: <Overview /> },
          { path: path.productManagement, element: <ProductManagement /> },
          { path: path.orderManagement, element: <OrderManagement /> },
          { path: path.report, element: <Reports /> },
          { path: path.userManagement, element: <UserManagement /> },
          { path: path.brandManagement, element: <BrandManagement /> },
          { path: path.categoryManagement, element: <CategoryManagement /> },
        ],
      },
      { path: "*", element: <Navigate to={path.notFound} /> },
    ],
  },
];

export default routes;
