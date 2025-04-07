import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import StepCart from "../components/StepCart";

export default function Cart() {
  const [currentStep, setCurrentStep] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handlePlaceOrder = (link) => {
    navigate(link);
  };

  useEffect(() => {
    if (pathname === "/cart") {
      setCurrentStep(0);
    } else if (pathname === "/cart/step-two") {
      setCurrentStep(1);
    } else if (pathname === "/cart/step-three") {
      setCurrentStep(2);
    } else if (pathname === "/cart/step-four") {
      setCurrentStep(3);
    }
  }, [pathname]);

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb current={currentStep} />
      <StepCart current={currentStep} />
      <Outlet context={{ handlePlaceOrder }} />
    </div>
  );
}
