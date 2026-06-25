import { useEffect, useMemo, useState } from "react";

import { CartContext } from "./cart-context";
import { useToast } from "./toast-context";

const CartProvider = ({ children }) => {
  const { success, error } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);

        // Auto-heal any items missing selectedVariant
        return parsed.map((item) => {
          if (item && !item.selectedVariant) {
            const defaultVariant = item.variants?.[0] || {
              weight: "1kg",
              price: item.price || 0,
            };

            return {
              ...item,
              selectedVariant: defaultVariant,
            };
          }

          return item;
        });
      } catch (error) {
        console.log(error);

        return [];
      }
    }

    return [];
  });

  // SAVE CART

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ADD TO CART

  const addToCart = (product) => {
    const { showToast = true, ...productData } = product;
    const selectedVariant = productData.selectedVariant ||
      productData.variants?.[0] || {
        weight: "1kg",
        price: productData.price || 0,
      };

    const selectedWeight = selectedVariant.weight || "1kg";

    const existingProduct = cartItems.find(
      (item) => item.id === productData.id && (item.selectedVariant?.weight || "1kg") === selectedWeight
    );

    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item.id === productData.id && (item.selectedVariant?.weight || "1kg") === selectedWeight
            ? {
                ...item,
                quantity: item.quantity + (productData.quantity || 1),
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,

        {
          ...productData,
          selectedVariant,
          quantity: productData.quantity || 1,
        },
      ]);
    }

    if (showToast) {
      success("Added to cart");
    }
  };

  // REMOVE

  const removeFromCart = (id, weight) => {
    setCartItems(
      cartItems.filter(
        (item) => !(item.id === id && (item.selectedVariant?.weight || "1kg") === (weight || "1kg"))
      )
    );
    error("Removed from cart");
  };

  // INCREASE

  const increaseQuantity = (id, weight) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && (item.selectedVariant?.weight || "1kg") === (weight || "1kg")
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // DECREASE

  const decreaseQuantity = (id, weight) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && (item.selectedVariant?.weight || "1kg") === (weight || "1kg")
          ? {
              ...item,

              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item
      )
    );
  };

  // TOTAL ITEMS

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,

      0
    );
  }, [cartItems]);

  // TOTAL PRICE

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (
        !item ||
        !item.selectedVariant ||
        typeof item.selectedVariant.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return total;
      }

      return total + item.selectedVariant.price * item.quantity;
    }, 0);
  }, [cartItems]);
  // CLEAR CART

  const clearCart = () => {
    setCartItems([]);
    error("Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        totalItems,

        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
