import {
  createContext,
  useEffect,
  useReducer,
} from "react";
import { WISHLIST_ACTIONS } from "./wishlistconstants";

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_TO_WISHLIST: {
      const exists = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (exists) return state;

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter(
          (item) => item.id !== action.payload
        ),
      };

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

const initialState = {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    wishlistReducer,
    initialState
  );

  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(state.items)
    );
  }, [state.items]);

  const addToWishlist = (product) => {
    dispatch({
      type: WISHLIST_ACTIONS.ADD_TO_WISHLIST,
      payload: product,
    });
  };

  const removeFromWishlist = (id) => {
    dispatch({
      type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST,
      payload: id,
    });
  };

  const clearWishlist = () => {
    dispatch({
      type: WISHLIST_ACTIONS.CLEAR_WISHLIST,
    });
  };

  const isInWishlist = (id) => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: state.items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;