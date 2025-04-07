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
      { path: "", element: <Home /> },
      { path: path.productDetail, element: <ProductDetail /> },
      {
        path: path.cart,
        element: <Cart />,
        children: [
          { path: "", element: <CartStepOne /> },
          {
            path: "step-two",
            element: <ProtectedStep step={2} element={<CartStepTwo />} />,
          },
          {
            path: "step-three",
            element: <ProtectedStep step={3} element={<CartStepThree />} />,
          },
          {
            path: "step-four",
            element: <ProtectedStep step={4} element={<CartStepFour />} />,
          },
        ],
      },
      { path: "*", element: <Navigate to={path.notFound} /> },
    ],
  },
  { path: path.notFound, element: <NotFound /> },
];

export default routes;
