import { useContext } from "react"

import CartContext from "../context/cart-context"

const useCart = () => {

  return useContext(CartContext)
}

export default useCart