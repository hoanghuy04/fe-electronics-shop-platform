import { lazy } from "react";
import { Navigate } from "react-router-dom";
import DefaultLayout from "./../layout/DefaultLayout";
import CartStepOne from "../components/CartStepOne";
import CartStepTwo from "../components/CartStepTwo";
import CartStepThree from "../components/CartStepThree";
import CartStepFour from "../components/CartStepFour";
import { path } from "../constants/path";

// Lazy loading để tối ưu hiệu suất
const Home = lazy(() => import("../pages/Home"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ListProduct = lazy(() => import("../pages/ListProduct"));

const routes = [
  {
    path: path.home,
    element: <DefaultLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: path.productDetail, element: <ProductDetail /> },
      { path: path.productCategory, element: <ListProduct /> },
      {
        path: path.cart,
        element: <Cart />,
        children: [
          { path: "", element: <CartStepOne /> },
          { path: "step-two", element: <CartStepTwo /> },
          { path: "step-three", element: <CartStepThree /> },
          { path: "step-four", element: <CartStepFour /> },
        ],
      },
      { path: "*", element: <Navigate to={path.notFound} /> },
    ],
  },
  { path: path.notFound, element: <NotFound /> },
];

export default routes;
