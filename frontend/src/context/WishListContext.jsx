/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { WISHLIST_ACTIONS } from "./wishlistconstants";
import { trackAddToWishlist, trackRemoveFromWishlist } from "../utils/analytics";
import customerCommerceApi from "../services/customerCommerceApi";
import { useAuth } from "../hooks/useAuth";
import { mergeWishlistItems } from "./wishlistSync";

const WishlistContext = createContext();

const toProductSlug = (product) => {
  const value = product?.slug || product?.name || product?.title || "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const readStoredWishlist = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Failed to read wishlist", error);
    return [];
  }
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_TO_WISHLIST: {
      const exists = state.items.find((item) => String(item.id) === String(action.payload.id));

      if (exists) return state;

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter((item) => String(item.id) !== String(action.payload)),
      };

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: [],
      };

    case "HYDRATE":
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
};

const initialState = {
  items: readStoredWishlist(),
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem("wishlist", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: "HYDRATE", payload: readStoredWishlist() });
      return;
    }

    const loadWishlist = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await customerCommerceApi.getWishlist();
        const remoteItems = Array.isArray(response?.data?.items) ? response.data.items : [];
        const guestItems = readStoredWishlist();
        const merged = mergeWishlistItems(guestItems, remoteItems);
        dispatch({ type: "HYDRATE", payload: merged });
        if (guestItems.length > 0) {
          window.localStorage.setItem("wishlist", JSON.stringify(merged));
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [isAuthenticated, user?.id]);

  const addToWishlist = async (product, { ensurePresent = false } = {}) => {
    try {
      trackAddToWishlist(product);
    } catch (err) {
      console.warn("Wishlist analytics failed", err);
    }

    if (isAuthenticated) {
      try {
        const normalizedProductId = Number.isInteger(Number(product?.id)) && Number(product?.id) > 0 ? Number(product?.id) : null;
        const payload = {
          productId: normalizedProductId ?? undefined,
          // Storefront IDs are local catalogue IDs. The backend resolves this
          // slug to the matching database product before writing the wishlist.
          productSlug: toProductSlug(product) || undefined,
          productName: product?.name || "Product",
          productImage: product?.image || product?.imageUrl || null,
          price: Number(product?.price ?? product?.selectedVariant?.price ?? 0),
          unitPrice: Number(product?.price ?? product?.selectedVariant?.price ?? 0),
        };
        const response = await (ensurePresent
          ? customerCommerceApi.addToWishlist(payload)
          : customerCommerceApi.toggleWishlist(payload));
        const result = response?.data?.result;
        if (result?.action === "added" || result?.action === "existing") {
          dispatch({ type: WISHLIST_ACTIONS.ADD_TO_WISHLIST, payload: { ...product, id: Number(product?.id) } });
        } else {
          dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: Number(product?.id) });
        }
        return result?.action === "added" || result?.action === "existing";
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to update wishlist");
        return false;
      }
    }

    dispatch({
      type: WISHLIST_ACTIONS.ADD_TO_WISHLIST,
      payload: { ...product, id: Number(product?.id) },
    });
    return true;
  };

  const removeFromWishlist = async (id, product = null) => {
    const normalizedId = Number(id);

    try {
      trackRemoveFromWishlist({ id: normalizedId, ...product });
    } catch (err) {
      console.warn("Wishlist analytics failed", err);
    }

    const currentItem = state.items.find((item) => String(item.id) === String(normalizedId));
    const productSlug = toProductSlug(product ?? currentItem ?? null);

    if (isAuthenticated) {
      try {
        const payload = {
          productId: Number.isInteger(normalizedId) && normalizedId > 0 ? normalizedId : undefined,
          productSlug: productSlug || undefined,
          productName: product?.name ?? currentItem?.name ?? product?.productName ?? currentItem?.productName ?? "Product",
          productImage: product?.image ?? currentItem?.image ?? product?.productImage ?? currentItem?.productImage ?? null,
          price: Number(product?.price ?? currentItem?.price ?? currentItem?.unitPrice ?? 0),
          unitPrice: Number(product?.price ?? currentItem?.price ?? currentItem?.unitPrice ?? 0),
        };

        await customerCommerceApi.toggleWishlist(payload);
        dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: normalizedId });
        return;
      } catch (err) {
        const message = err?.response?.data?.message || "Unable to remove item from wishlist";
        setError(message);
        console.error("Wishlist remove failed", err);
        return;
      }
    }

    dispatch({
      type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST,
      payload: normalizedId,
    });
  };

  const clearWishlist = () => {
    dispatch({
      type: WISHLIST_ACTIONS.CLEAR_WISHLIST,
    });
  };

  const isInWishlist = (id) => {
    return state.items.some((item) => String(item.id) === String(id));
  };

  const wishlistCount = useMemo(() => state.items.length, [state.items]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist: state.items,
        wishlistItems: state.items,
        wishlistCount,
        loading,
        error,
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

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
};

export default WishlistContext;
