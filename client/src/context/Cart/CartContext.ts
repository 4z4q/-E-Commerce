import { createContext, useContext } from "react";
import CartItem from "../../types/Cart";

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  loading: boolean;
  errorS: string;
  addItemToCart: (productId: string) => void;
  updateItemInCart: (productId: string, quantity: number) => void;
  removeItemInCart: (productId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  loading: false,
  errorS: "",
  addItemToCart: () => {},
  updateItemInCart: () => {},
  removeItemInCart: () => {},
  clearCart: () => {},
});

// Access the CartContext using the useAuth hook in your components
export const useCart = () => useContext(CartContext);
