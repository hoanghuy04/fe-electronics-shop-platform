import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function DefaultLayout() {
  return (
      <div className="layout-default bg-gray-200 min-h-screen flex flex-col justify-between">
        <Header />

        <main className="layout-default__main">
          <Outlet />
        </main>

        <Footer />
    </div>
  )
}
