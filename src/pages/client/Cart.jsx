import React, { useEffect, useState, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StepCart from "../../components/StepCart";
import { path } from "../../constants/path";
import Breadcrumbs from "../../components/Breadcrumb";
import { useAuth } from "../../hooks/AuthContext";
import { useCart } from "../../hooks/useCart";

export default function Cart() {
  const [currentStep, setCurrentStep] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { cart, order, setOrder } = useCart();
  const hasNavigated = useRef(false);

  // Ánh xạ pathname với currentStep
  const stepMap = {
    [path.cart]: 0,
    [path.cartStepTwo]: 1,
    [path.cartStepThree]: 2,
    [path.cartStepFour]: 3,
  };

  useEffect(() => {
    if (loading || !user) return;

    if (!order?.shipping_address || !order.shipping_address.full_name) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        shipping_address: {
          ...prevOrder?.shipping_address,
          full_name: user.name || "",
          phone: user.phone || "",
          gender: user.gender || "Anh",
        },
      }));
    }
  }, [user, loading, setOrder, order]);

  useEffect(() => {
    if (hasNavigated.current) {
      hasNavigated.current = false;
      return;
    }

    const newStep = stepMap[pathname] ?? 0;
    setCurrentStep(newStep);

    const storedStep = parseInt(sessionStorage.getItem("currentStep") || "1");
    const allowedStep = storedStep - 1;

    if (cart.length === 0 && storedStep > 1 && pathname !== path.cartStepFour) {
      sessionStorage.setItem("currentStep", "1");
      hasNavigated.current = true;
      navigate(path.cart);
    } else if (newStep > allowedStep && pathname !== path.cartStepFour) {
      const validPath = [
        path.cart,
        path.cartStepTwo,
        path.cartStepThree,
        path.cartStepFour,
      ][allowedStep];
      hasNavigated.current = true;
      navigate(validPath);
    } else if (pathname === path.cartStepFour && !order) {
      sessionStorage.setItem("currentStep", "1");
      hasNavigated.current = true;
    }
  }, [pathname, cart, navigate, order]);

  if (loading) return <div>Đang tải...</div>;
  if (!user) {
    navigate(path.login);
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <Breadcrumbs current={currentStep} />
      <StepCart current={currentStep} className="" />
      <Outlet />
    </div>
  );
}
