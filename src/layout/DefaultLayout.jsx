import React from "react";
import { Link, Outlet } from "react-router-dom";
import CartMini from "../components/CartMini";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DefaultLayout() {
  return (
    <div className="layout-default bg-body-bg min-h-screen flex flex-col justify-between">
      <Header />

      <main className="layout-default__main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
