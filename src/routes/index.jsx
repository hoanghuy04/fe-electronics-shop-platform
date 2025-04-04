import { lazy } from "react";
import { Navigate } from "react-router-dom";
import DefaultLayout from "./../layout/DefaultLayout";
import CartStepOne from "../components/CartStepOne";
import CartStepTwo from "../components/CartStepTwo";
import CartStepThree from "../components/CartStepThree";
import CartStepFour from "../components/CartStepFour";

// Lazy loading để tối ưu hiệu suất
const Home = lazy(() => import("../pages/Home"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const NotFound = lazy(() => import("../pages/NotFound"));

const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "products/:slug", element: <ProductDetail /> },
      {
        path: "cart",
        element: <Cart />,
        children: [
          { path: "", element: <CartStepOne /> },
          { path: "step-two", element: <CartStepTwo /> },
          { path: "step-three", element: <CartStepThree /> },
          { path: "step-four", element: <CartStepFour /> },
        ],
      },
      { path: "*", element: <Navigate to="/not-found" /> },
    ],
  },
  { path: "/not-found", element: <NotFound /> },
];

export default routes;
