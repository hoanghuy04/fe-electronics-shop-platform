import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import StepCart from "../components/StepCart";
import { path } from "../constants/path";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const [currentStep, setCurrentStep] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  const getCurrentStepFromSession = () => {
    return parseInt(sessionStorage.getItem("currentStep")) || 1;
  };

  const handlePlaceOrder = (to) => {
    const stepMap = {
      [path.cart]: 1,
      [path.cartStepTwo]: 2,
      [path.cartStepThree]: 3,
      [path.cartStepFour]: 4,
    };

    const nextStep = stepMap[to];
    if (nextStep) {
      if (nextStep > 1 && cart.length === 0) {
        return;
      }
      const user = localStorage.getItem("user");
      if (nextStep > 2 && !user) {
        navigate(path.cartStepTwo);
        return;
      }
      sessionStorage.setItem("currentStep", nextStep.toString());
      navigate(to);
    }
  };

  useEffect(() => {
    const storedStep = getCurrentStepFromSession();
    const user = localStorage.getItem("user");

    if (pathname === path.cart) {
      setCurrentStep(0);
    } else if (pathname === path.cartStepTwo) {
      setCurrentStep(1);
    } else if (pathname === path.cartStepThree) {
      setCurrentStep(2);
    } else if (pathname === path.cartStepFour) {
      setCurrentStep(3);
    }

    const allowedStep = storedStep - 1;
    if (cart.length === 0 && storedStep > 1) {
      sessionStorage.setItem("currentStep", "1");
      navigate(path.cart);
    } else if (!user && storedStep > 2) {
      sessionStorage.setItem("currentStep", "2");
      navigate(path.cartStepTwo);
    } else if (currentStep > allowedStep) {
      const validPath = [
        path.cart,
        path.cartStepTwo,
        path.cartStepThree,
        path.cartStepFour,
      ][allowedStep];
      navigate(validPath);
    }
  }, [pathname, navigate, cart]);

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb current={currentStep} />
      <StepCart current={currentStep} />
      <Outlet context={{ handlePlaceOrder }} />
    </div>
  );
}
