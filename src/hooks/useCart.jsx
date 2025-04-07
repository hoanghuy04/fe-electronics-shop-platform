import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find((it) => it.id == product.id);
    let tmp;
    if (existingItem) {
      tmp = cart.map((item) =>
        item.id == product.id ? { ...item, quantity: item.quantity + 1 } : item
      );

      setJustAdded({ ...existingItem, quantity: existingItem.quantity + 1 });
    } else {
      tmp = [...cart, { ...product, quantity: 1 }];
      setJustAdded({ ...product, quantity: 1 });
    }
    setCart(tmp);
  };

  const removeFromCart = (id) => {
    let cartClone = [...cart];
    cartClone = cartClone.filter((it) => it.id != id);
    setCart([...cartClone]);
  };

  const totalItem = useMemo(() => {
    return cart.reduce((sum, product) => sum + product.quantity, 0);
  }, [cart]);

  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const item = prev.find((item) => item.id === id);
      if (item && item.quantity > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter((item) => item.id !== id);
      }
    });
  };

  const totalPrice = cart.reduce(
    (sum, product) =>
      sum + product.quantity * product.price * (1 - product.discount),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        totalItem,
        decreaseQuantity,
        totalPrice,
        justAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
