import {
  useEffect,
  useMemo,
  useState,
} from "react"

import CartContext from "./cart-context"

const CartProvider = ({
  children,
}) => {

  const [cartItems, setCartItems] =
    useState(() => {

      const storedCart =
        localStorage.getItem(
          "cart"
        )

      return storedCart
        ? JSON.parse(storedCart)
        : []
    })

  // SAVE CART

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    )

  }, [cartItems])

  // ADD TO CART

  const addToCart = (product) => {

    const selectedWeight =

      product.selectedVariant
        ?.weight ||

      "1kg"

    const existingProduct =
      cartItems.find(

        (item) =>

          item.id ===
            product.id &&

          item.selectedVariant
            ?.weight ===
            selectedWeight
      )

    if (existingProduct) {

      setCartItems(

        cartItems.map((item) =>

          item.id ===
            product.id &&

          item.selectedVariant
            ?.weight ===
            selectedWeight

            ? {

                ...item,

                quantity:
                  item.quantity + 1,
              }

            : item
        )
      )

    } else {

      setCartItems([

        ...cartItems,

        {
          ...product,

          quantity: 1,
        },
      ])
    }
  }

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

            item.selectedVariant
              ?.weight ===
              weight
          )
      )
    )
  }

  // INCREASE

  const increaseQuantity = (
    id,
    weight
  ) => {

    setCartItems(

      cartItems.map((item) =>

        item.id === id &&

        item.selectedVariant
          ?.weight ===
          weight

          ? {

              ...item,

              quantity:
                item.quantity + 1,
            }

          : item
      )
    )
  }

  // DECREASE

  const decreaseQuantity = (
    id,
    weight
  ) => {

    setCartItems(

      cartItems.map((item) =>

        item.id === id &&

        item.selectedVariant
          ?.weight ===
          weight

          ? {

              ...item,

              quantity:

                item.quantity > 1

                  ? item.quantity - 1

                  : 1,
            }

          : item
      )
    )
  }

  // TOTAL ITEMS

  const totalItems = useMemo(() => {

    return cartItems.reduce(

      (total, item) =>

        total + item.quantity,

      0
    )

  }, [cartItems])

  // TOTAL PRICE

  const totalPrice = useMemo(() => {

    return cartItems.reduce(

      (total, item) =>

        total +

        item.selectedVariant
          .price *

          item.quantity,

      0
    )

  }, [cartItems])

  return (

    <CartContext.Provider

      value={{

        cartItems,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        totalItems,

        totalPrice,
      }}
    >

      {children}

    </CartContext.Provider>
  )
}

export default CartProvider