import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { CartContext } from "./cart-context";

const CartProvider = ({
  children,
}) => {

  const [cartItems, setCartItems] =
    useState(() => {

      const storedCart =
        localStorage.getItem("cart");

      if (storedCart) {

        try {

          const parsed =
            JSON.parse(storedCart);

          // Auto-heal any items missing selectedVariant
          return parsed.map((item) => {

            if (
              item &&
              !item.selectedVariant
            ) {

              const defaultVariant =
                item.variants?.[0] || {
                  weight: "1kg",
                  price: item.price || 0,
                };

              return {
                ...item,
                selectedVariant:
                  defaultVariant,
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

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);

  // FLASH / TOAST MESSAGE
  const [flash, setFlash] = useState({ visible: false, message: "", type: "success" });

  const showFlash = (message, type = "success", timeout = 1400) => {
    setFlash({ visible: true, message, type });
    setTimeout(() => setFlash((s) => ({ ...s, visible: false })), timeout);
  };

  const hideFlash = () => {
    setFlash((s) => ({ ...s, visible: false }));
  };

  // ADD TO CART

  const addToCart = (product) => {

    const selectedVariant =
      product.selectedVariant ||
      product.variants?.[0] || {
        weight: "1kg",
        price: product.price || 0,
      };

    const selectedWeight =
      selectedVariant.weight || "1kg";

    const existingProduct =
      cartItems.find(
        (item) =>
          item.id === product.id &&
          (
            item.selectedVariant?.weight ||
            "1kg"
          ) === selectedWeight
      );

    if (existingProduct) {

      setCartItems(
        cartItems.map((item) =>

          item.id === product.id &&
          (
            item.selectedVariant?.weight ||
            "1kg"
          ) === selectedWeight

            ? {
                ...item,
                quantity:
                  item.quantity +
                  (product.quantity || 1),
              }

            : item
        )
      );

    } else {

      setCartItems([
        ...cartItems,

        {
          ...product,
          selectedVariant,
          quantity:
            product.quantity || 1,
        },
      ]);
    }
    // show flash
    try { showFlash("Added to cart", "success"); } catch (e) {}
  };

  // REMOVE

  const removeFromCart = (
    id,
    weight
  ) => {

    setCartItems(

      cartItems.filter(

        (item) =>

          !(

            item.id === id &&

            (
              item.selectedVariant?.weight ||
              "1kg"
            ) === (weight || "1kg")
          )
      )
    );
     try { showFlash("Removed from cart", "error"); } catch (e) {}
  };

  // INCREASE

  const increaseQuantity = (
    id,
    weight
  ) => {

    setCartItems(

      cartItems.map((item) =>

        item.id === id &&

        (
          item.selectedVariant?.weight ||
          "1kg"
        ) === (weight || "1kg")

          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }

          : item
      )
    );
  };

  // DECREASE

  const decreaseQuantity = (
    id,
    weight
  ) => {

    setCartItems(

      cartItems.map((item) =>

        item.id === id &&

        (
          item.selectedVariant?.weight ||
          "1kg"
        ) === (weight || "1kg")

          ? {
              ...item,

              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }

          : item
      )
    );
  };

  // TOTAL ITEMS

  const totalItems = useMemo(() => {

    return cartItems.reduce(

      (total, item) =>

        total + item.quantity,

      0
    );

  }, [cartItems]);

  // TOTAL PRICE

  const totalPrice = useMemo(() => {

    return cartItems.reduce(
      (total, item) => {

        if (
          !item ||
          !item.selectedVariant ||
          typeof item.selectedVariant.price !== "number" ||
          typeof item.quantity !== "number"
        ) {
          return total;
        }

        return (
          total +
          item.selectedVariant.price *
            item.quantity
        );

      },
      0
    );

  }, [cartItems]);
  // CLEAR CART

  const clearCart = () => {
    setCartItems([]);
    try { showFlash("Cart cleared", "error"); } catch (e) {}
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
        // flash helper & state
        flash,
        showFlash,
        hideFlash,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};

export default CartProvider;