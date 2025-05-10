"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { path } from "../constants/path";

const customButtonStyle = `
  .custom-register-btn:hover,
  .custom-register-btn:focus {
    border-color: var(--color-primary) !important;
    color: var(--color-primary) !important;
  }
  .custom-register-btn:active {
    border-color: var(--color-primary) !important;
    color: var(--color-primary) !important;
  }
`;

const LoginDropdown = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleButtonClick = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "static" }}
    >
      <style>{customButtonStyle}</style>

      <Link
        to="./Login"
        className="flex items-center hover:text-orange-500 font-medium text-lg transition-colors duration-200"
      >
        <UserOutlined className="mr-2 text-xl" />
        <span>Đăng nhập</span>
      </Link>

      {isVisible && (
        <div
          className="bg-white shadow-lg z-50 text-black"
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            width: "250px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "20px",
              width: "0",
              height: "0",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid white",
            }}
          ></div>
          <div className="pt-4">
            <p className="text-sm text-black-700 font-bold ">
              <span className="text-xl mr-2">👋</span>
              Xin chào! Vui lòng đăng nhập
            </p>
          </div>

          <div className="pb-4 px-4 flex gap-2">
            <Link
              to={path.login}
              onClick={handleButtonClick}
              className="flex-1"
            >
              <Button
                type="primary"
                block
                className="border-none"
                style={{
                  backgroundColor: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                }}
              >
                ĐĂNG NHẬP
              </Button>
            </Link>
            <Link
              to={path.register}
              onClick={handleButtonClick}
              className="flex-1"
            >
              <Button
                block
                className="custom-register-btn"
                style={{
                  borderColor: "#d9d9d9",
                }}
              >
                ĐĂNG KÝ
              </Button>
            </Link>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Link
              to="/help"
              className="flex items-center text-sm text-gray-600"
              onClick={handleButtonClick}
            >
              <QuestionCircleOutlined className="mr-2" />
              Trợ giúp
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginDropdown;
