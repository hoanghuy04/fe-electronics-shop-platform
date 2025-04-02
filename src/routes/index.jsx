import { lazy } from "react";
import { Navigate } from "react-router-dom";
import DefaultLayout from './../layout/DefaultLayout';

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
      { path: "products/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "*", element: <Navigate to="/not-found" /> },
    ],
  },
  { path: "/not-found", element: <NotFound /> },
];

export default routes;
