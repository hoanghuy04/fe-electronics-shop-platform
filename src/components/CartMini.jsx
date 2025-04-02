import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

export default function CartMini() {
    const cart = useSelector(state => state.cartReducer) || []
    console.log(cart);

    const total = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0)

    return (
        <div>
            <Link to={'/cart'}>Giỏ hàng ({total})</Link>
        </div>
    )
}
