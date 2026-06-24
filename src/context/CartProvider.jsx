import { useEffect, useMemo, useState } from "react";

import { CartContext } from "./cart-context";

const CartProvider = ({ children }) => {
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

    // Broadcast changes to other tabs/windows for real-time sync
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("ezstore_cart");
        bc.postMessage({ type: "cart:update", cart: cartItems });
        bc.close();
      }
    } catch (e) {
      // ignore if BroadcastChannel unsupported
    }
  }, [cartItems]);

  // Listen for storage events (fallback / other tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "cart") {
        try {
          const newCart = JSON.parse(e.newValue || "[]");
          setCartItems(newCart);
        } catch (err) {
          // ignore parse errors
        }
      }
    };

    window.addEventListener("storage", onStorage);

    // Also listen for BroadcastChannel messages
    let bc;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("ezstore_cart");
        bc.onmessage = (msg) => {
          try {
            if (msg?.data?.type === "cart:update") {
              setCartItems(msg.data.cart || []);
            }
          } catch (err) {}
        };
      }
    } catch (err) {
      // ignore
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      try {
        if (bc) bc.close();
      } catch (err) {}
    };
  }, []);

  // ADD TO CART

  const addToCart = (product) => {
    const selectedVariant =
      product.selectedVariant ||
      product.variants?.[0] || {
        weight: "1kg",
        price: product.price || 0,
      };

    const selectedWeight = selectedVariant.weight || "1kg";

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && (item.selectedVariant?.weight || "1kg") === selectedWeight
      );

      if (existingIndex !== -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          selectedVariant,
          quantity: product.quantity || 1,
        },
      ];
    });

  };

  // REMOVE

  const removeFromCart = (id, weight) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && (item.selectedVariant?.weight || "1kg") === (weight || "1kg"))
      )
    );
  };

  // INCREASE

  const increaseQuantity = (id, weight) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && (item.selectedVariant?.weight || "1kg") === (weight || "1kg")
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // DECREASE

  const decreaseQuantity = (id, weight) => {
    setCartItems((prev) => {
      return prev
        .map((item) =>
          item.id === id && (item.selectedVariant?.weight || "1kg") === (weight || "1kg")
            ? { ...item, quantity: Math.max(0, (item.quantity || 0) - 1) }
            : item
        )
        .filter((item) => (item.quantity || 0) > 0);
    });
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
  };

  // REPLACE CART WITH A SINGLE ITEM (atomic, avoids race conditions)
  const replaceCartWithItem = (product) => {
    const selectedVariant =
      product.selectedVariant ||
      product.variants?.[0] ||
      {
        weight: "1kg",
        price: product.price || 0,
      };

    const item = {
      ...product,
      selectedVariant,
      quantity: product.quantity || 1,
    };

    setCartItems([item]);
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

        replaceCartWithItem,

        totalItems,

        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
