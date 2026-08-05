/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
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

const getWishlistKey = (item) => {
  const rawId = item?.productId ?? item?.id ?? item?.product?.id;
  const parsed = Number(rawId);
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : null;
};

const normalizeWishlistStateItem = (item = {}) => {
  const key = getWishlistKey(item);
  if (!key) return null;

  return {
    ...item,
    id: Number(key),
    productId: Number(key),
  };
};

const dedupeWishlistItems = (items = []) => {
  const seen = new Set();
  return items.reduce((acc, item) => {
    const normalized = normalizeWishlistStateItem(item);
    const key = getWishlistKey(normalized);
    if (!key || seen.has(key)) return acc;
    seen.add(key);
    acc.push(normalized);
    return acc;
  }, []);
};

const readStoredWishlist = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem("wishlist");
    const parsed = stored ? JSON.parse(stored) : [];
    const merged = Array.isArray(parsed) ? mergeWishlistItems(parsed) : [];
    return dedupeWishlistItems(merged);
  } catch (error) {
    console.warn("Failed to read wishlist", error);
    return [];
  }
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_TO_WISHLIST: {
      const normalizedPayload = normalizeWishlistStateItem(action.payload);
      if (!normalizedPayload) return state;

      const payloadKey = getWishlistKey(normalizedPayload);
      if (state.items.some((item) => getWishlistKey(item) === payloadKey)) {
        return state;
      }

      return {
        ...state,
        items: dedupeWishlistItems([...state.items, normalizedPayload]),
      };
    }

    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST: {
      const payloadKey = getWishlistKey({ id: action.payload, productId: action.payload });
      if (!payloadKey) return state;

      return {
        ...state,
        items: state.items.filter((item) => getWishlistKey(item) !== payloadKey),
      };
    }

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: [],
      };

    case "HYDRATE":
      return {
        ...state,
        items: dedupeWishlistItems(action.payload || []),
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
  const loadedUserIdRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem("wishlist", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (!isAuthenticated) {
      loadedUserIdRef.current = null;
      dispatch({ type: "HYDRATE", payload: readStoredWishlist() });
      return;
    }

    if (loadedUserIdRef.current === user?.id) {
      return;
    }

    loadedUserIdRef.current = user?.id;

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
        const wishlistItemId = currentItem?.wishlistItemId ?? product?.wishlistItemId;
        if (wishlistItemId && Number.isInteger(Number(wishlistItemId)) && Number(wishlistItemId) > 0) {
          await customerCommerceApi.removeWishlistItem(wishlistItemId);
        } else {
          const payload = {
            productId: Number.isInteger(normalizedId) && normalizedId > 0 ? normalizedId : undefined,
            wishlistItemId: currentItem?.wishlistItemId,
            productSlug: productSlug || undefined,
            productName: product?.name ?? currentItem?.name ?? product?.productName ?? currentItem?.productName ?? "Product",
            productImage: product?.image ?? currentItem?.image ?? product?.productImage ?? currentItem?.productImage ?? null,
            price: Number(product?.price ?? currentItem?.price ?? currentItem?.unitPrice ?? 0),
            unitPrice: Number(product?.price ?? currentItem?.price ?? currentItem?.unitPrice ?? 0),
          };

          await customerCommerceApi.toggleWishlist(payload);
        }

        dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: normalizedId });
        return;
      } catch (err) {
        // A stale local wishlist row can point to an item that has already
        // been removed on the server (for example after an earlier sync).
        // The requested end state is still achieved, so remove it locally.
        if (err?.response?.status === 404) {
          dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: normalizedId });
          setError("");
          return;
        }
        if (err?.response?.status === 401) {
          setError("Please sign in to update your wishlist");
        } else {
          const message = err?.response?.data?.message || "Unable to remove item from wishlist";
          setError(message);
        }
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

  const wishlistCount = useMemo(() => {
    const seen = new Set();
    state.items.forEach((item) => {
      const key = getWishlistKey(item);
      if (key) seen.add(key);
    });
    return seen.size;
  }, [state.items]);

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
