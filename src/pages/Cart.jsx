import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import StepCart from "../components/StepCart";

export default function Cart() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb current={currentStep} setCurrent={setCurrentStep} />
      <StepCart current={currentStep} setCurrent={setCurrentStep} />
      <Outlet context={setCurrentStep} />
    </div>
  );
}
