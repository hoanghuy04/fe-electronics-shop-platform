import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import CartMini from '../components/CartMini'

export default function DefaultLayout() {
  return (
    <div>
      <div className="layout-default">
        <header className="layout-default__header">
            <div className="layout-default__logo">
                <Link to={'/'}>Logo</Link>
            </div>
            <div className="layout-default__cart">
                <CartMini/>
            </div>
        </header>

        <main className="layout-default__main">
            <Outlet/>
        </main>

        <footer className="layout-default__footer">
            Duong Hoang Huy
        </footer>
      </div>
    </div>
  )
}
