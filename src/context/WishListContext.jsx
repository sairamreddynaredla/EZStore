import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

export const WishlistContext =
  createContext()

export const WishlistProvider = ({
  children,
}) => {

  // WISHLIST STATE
  const [wishlistItems, setWishlistItems] =
    useState(() => {

      const storedWishlist =
        localStorage.getItem(
          'wishlist'
        )

      return storedWishlist
        ? JSON.parse(storedWishlist)
        : []
    })

  // SAVE TO LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      'wishlist',
      JSON.stringify(
        wishlistItems
      )
    )

  }, [wishlistItems])

  // ADD TO WISHLIST
  const addToWishlist = (
    product
  ) => {

    const exists =
      wishlistItems.find(

        (item) =>
          item.id === product.id
      )

    if (!exists) {

      setWishlistItems([
        ...wishlistItems,
        product,
      ])
    }
  }

  // REMOVE FROM WISHLIST
  const removeFromWishlist = (
    id
  ) => {

    setWishlistItems(

      wishlistItems.filter(
        (item) =>
          item.id !== id
      )
    )
  }

  // TOGGLE WISHLIST
  const toggleWishlist = (
    product
  ) => {

    const exists =
      wishlistItems.find(

        (item) =>
          item.id === product.id
      )

    if (exists) {

      removeFromWishlist(
        product.id
      )

    } else {

      addToWishlist(product)
    }
  }

  // CHECK IN WISHLIST
  const isInWishlist = (
    id
  ) => {

    return wishlistItems.some(

      (item) =>
        item.id === id
    )
  }

  return (

    <WishlistContext.Provider
      value={{

        wishlistItems,

        addToWishlist,

        removeFromWishlist,

        toggleWishlist,

        isInWishlist,

      }}
    >

      {children}

    </WishlistContext.Provider>

  )
}

// CUSTOM HOOK
export const useWishlist = () =>
  useContext(WishlistContext)