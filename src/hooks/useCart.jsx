import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../constants/path";
import { toast } from "sonner";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [justAdded, setJustAdded] = useState(null);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

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
      if (existingItem.quantity + 1 > product.stock) {
        toast.error("Không đủ hàng trong kho để thêm sản phẩm!");
        return;
      }

      tmp = cart.map((item) =>
        item.id == product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setJustAdded({ ...existingItem, quantity: existingItem.quantity + 1 });
    } else {
      if (product.stock < 1) {
        toast.error("Sản phẩm đã hết hàng.");
        return;
      }

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

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        if (item.quantity + 1 > item.stock) {
          toast.error("Không đủ hàng trong kho để thêm sản phẩm!");
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    setCart(updatedCart);
  };

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, product) =>
        sum + product.quantity * product.price * (1 - product.discount),
      0
    );
  }, [cart]);

  const handlePlaceOrder = useCallback(
    (to) => {
      const stepMap = {
        [path.cart]: 1,
        [path.cartStepTwo]: 2,
        [path.cartStepThree]: 3,
        [path.cartStepFour]: 4,
      };

      const nextStep = stepMap[to];
      if (nextStep) {
        if (nextStep > 1 && cart.length === 0 && nextStep !== 4) {
          return;
        }
        sessionStorage.setItem("currentStep", nextStep.toString());
        navigate(to);
      }
    },
    [navigate, cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        totalItem,
        decreaseQuantity,
        increaseQuantity,
        totalPrice,
        justAdded,
        order,
        setOrder,
        handlePlaceOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
