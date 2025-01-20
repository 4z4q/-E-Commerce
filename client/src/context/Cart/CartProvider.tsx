import { BASE_URL } from "../../constants/baseUrl";
import CartItem from "../../types/Cart";
import { useAuth } from "../Auth/AuthContext";
import { CartContext } from "./CartContext";
import { FC, PropsWithChildren, useEffect, useState } from "react";

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [errorS, setError] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user cart. Please try again.");
        }

        const cart = await response.json();

        const cartItemsMapped = cart.items.map(
          ({ product, quantity, unitPrice }: CartItem) => ({
            productId: product._id,
            title: product.title,
            image: product.image,
            unitPrice: unitPrice,
            quantity,
          })
        );

        setCartItems(cartItemsMapped);
        setTotalAmount(cart.totalAmount);
        setError("");
      } catch (error: unknown) {
        setError((error as Error).message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const addItemToCart = async (productId: string) => {
    try {
      // Get Data From Backend
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Product not found");
      } else {
        setError("");
      }

      const cart = await response.json();

      if (!cart) {
        setError("Product not found");
      }

      const cartItemsMapped = cart.items.map(
        ({ product, quantity, unitPrice }: CartItem) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          unitPrice,
          quantity,
        })
      );

      setCartItems([...cartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
      console.log(errorS);
    }
  };

  const updateItemInCart = async (productId: string, quantity: number) => {
    try {
      // Get Data From Backend
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        body: JSON.stringify({
          productId,
          quantity,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Product not found");
      } else {
        setError("");
      }

      const cart = await response.json();

      if (!cart) {
        setError("Product not found");
      }

      const cartItemsMapped = cart.items.map(
        ({ product, quantity, unitPrice }: CartItem) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          unitPrice,
          quantity,
        })
      );

      setCartItems([...cartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
      console.log(errorS);
    }
  };

  const removeItemInCart = async (productId: string) => {
    try {
      // Get Data From Backend
      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        body: JSON.stringify({
          productId,
        }),

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Product not found");
      } else {
        setError("");
      }

      const cart = await response.json();

      if (!cart) {
        setError("Product not found");
      }

      const cartItemsMapped = cart.items.map(
        ({ product, quantity, unitPrice }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          unitPrice,
          quantity,
        })
      );

      setCartItems([...cartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
      console.log(errorS);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Product not found");
      } else {
        setError("");
      }

      const cart = await response.json();

      if (!cart) {
        setError("Product not found");
      }

      setCartItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        loading,
        errorS,
        addItemToCart,
        updateItemInCart,
        removeItemInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
