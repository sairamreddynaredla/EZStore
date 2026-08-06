import { useEffect, useMemo, useRef, useState } from "react";

import { CartContext } from "./cart-context";
import { useToast } from "./toast-context";
import customerCommerceApi from "../services/customerCommerceApi";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "./usewishlist";
import { normalizeCartItem, buildCartItemPayload } from "./cartItemUtils";

const toProductSlug = (product) => {
  const value = product?.slug || product?.name || product?.title || "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const readStoredCart = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  const storedCart = window.localStorage.getItem("cart");

  if (!storedCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(storedCart);

    return (parsed || []).map((item) => normalizeCartItem(item));
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCartItemKey = (item) => {
  const productId = Number(item.productId ?? item.id) || undefined;
  const variantKey = String(item.variantKey || item.selectedVariant?.weight || item.selectedVariant?.variantKey || "default").trim();
  const productSlug = item.productSlug || toProductSlug(item);
  return `${productId || productSlug || "unknown"}::${variantKey}`;
};

const groupLocalCartItems = (items) => {
  const grouped = new Map();

  for (const rawItem of items || []) {
    const item = buildCartItemPayload(rawItem);
    if (!item.productId && !item.productSlug) continue;

    const key = getCartItemKey(item);
    const existing = grouped.get(key);
    if (existing) {
      grouped.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
        stock: Math.max(existing.stock || 0, item.stock || 0),
      });
    } else {
      grouped.set(key, item);
    }
  }

  return Array.from(grouped.values());
};

const mergeLocalCartToRemote = async (items) => {
  const localItems = groupLocalCartItems(items);
  if (!localItems.length) return;

  let remoteItems = [];
  try {
    const response = await customerCommerceApi.getCart();
    remoteItems = Array.isArray(response?.data?.items) ? response.data.items : [];
  } catch (err) {
    console.error("Unable to load authenticated cart before merge", err);
    throw err;
  }

  const remoteMap = new Map();
  for (const rawItem of remoteItems) {
    const normalized = normalizeCartItem(rawItem);
    remoteMap.set(getCartItemKey(normalized), normalized);
  }

  const failures = [];

  const addToCartWithRetry = async (payload, retries = 1) => {
    try {
      await customerCommerceApi.addToCart(payload);
      return null;
    } catch (err) {
      if (retries > 0) {
        return addToCartWithRetry(payload, retries - 1);
      }
      return err;
    }
  };

  const mergePromises = localItems.map(async (localItem) => {
    const key = getCartItemKey(localItem);
    const remoteItem = remoteMap.get(key);
    const alreadyInRemote = Number(remoteItem?.quantity ?? 0);
    const requestedQuantity = Number(localItem.quantity ?? 1);
    let delta = Math.max(0, requestedQuantity - alreadyInRemote);

    if (delta <= 0) return;

    if (localItem.stock > 0) {
      const available = Math.max(0, localItem.stock - alreadyInRemote);
      if (available <= 0) {
        failures.push({ item: localItem, reason: "Stock unavailable for merged item" });
        return;
      }
      if (delta > available) {
        delta = available;
      }
    }

    const payload = {
      ...localItem,
      quantity: delta,
    };

    const err = await addToCartWithRetry(payload, 1);
    if (err) {
      failures.push({ item: localItem, error: err });
    }
  });

  await Promise.all(mergePromises);

  if (failures.length === 0) {
    try {
      window.localStorage.removeItem("cart");
    } catch {
      // Ignore storage failures. Preserve merge success semantics if item data was already added.
    }
    return;
  }

  console.error("Guest cart merge partially failed", failures);
};

const CartProvider = ({ children }) => {
  const { success, error } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { addToWishlist } = useWishlist();
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [hydrated, setHydrated] = useState(false);
  const mergeLocalCartOnceRef = useRef(false);
  const cartLoadRequestRef = useRef(0);

  const loadRemoteCart = async ({ force = false } = {}) => {
    const requestId = ++cartLoadRequestRef.current;
    try {
      const response = await customerCommerceApi.getCart({ force });
      const items = Array.isArray(response?.data?.items) ? response.data.items : [];
      if (requestId === cartLoadRequestRef.current) {
        setCartItems(items.map(normalizeCartItem));
      }
    } catch (err) {
      console.error(err);
      if (requestId === cartLoadRequestRef.current) {
        setCartItems([]);
      }
    } finally {
      if (requestId === cartLoadRequestRef.current) {
        setHydrated(true);
      }
    }
  };

  const refreshCart = async () => {
    await loadRemoteCart({ force: true });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isAuthenticated) {
      const mergeAndLoad = async () => {
        const storedCart = readStoredCart();
        const shouldMerge = storedCart.length > 0 && !mergeLocalCartOnceRef.current;

        if (shouldMerge) {
          try {
            await mergeLocalCartToRemote(storedCart);
            mergeLocalCartOnceRef.current = true;
          } catch (err) {
            console.error("Guest cart merge failed, leaving guest cart intact", err);
          }
        }

        await loadRemoteCart();
      };

      mergeAndLoad();
      return;
    }

    setCartItems(readStoredCart());
    setHydrated(true);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage || isAuthenticated || !hydrated) {
      return;
    }

    window.localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, hydrated, isAuthenticated]);

  const getCartItemVariantWeight = (item, fallbackWeight = null) => {
    return String(
      item?.selectedVariant?.weight ||
        item?.selectedVariant?.variantKey ||
        item?.variantKey ||
        item?.variant?.weight ||
        fallbackWeight ||
        "1kg"
    ).trim();
  };

  const getCartItemIdentity = (item, fallbackId = null, fallbackWeight = null) => {
    const normalizedId = Number(item?.productId ?? item?.id ?? fallbackId ?? 0) || null;
    const productSlug = item?.productSlug || toProductSlug(item) || "";
    const variantWeight = getCartItemVariantWeight(item, fallbackWeight);

    return {
      id: normalizedId,
      slug: productSlug,
      variantWeight,
    };
  };

  const matchesCartItem = (item, id, weight, slug = null) => {
    const target = getCartItemIdentity({ id, productSlug: slug, selectedVariant: { weight } }, id, weight);
    const source = getCartItemIdentity(item, id, weight);

    const sameId = Boolean(source.id && target.id && source.id === target.id);
    const sameSlug = Boolean(source.slug && target.slug && source.slug === target.slug);
    const sameVariant = source.variantWeight === target.variantWeight;

    return (sameId || sameSlug) && sameVariant;
  };

  const findMatchingItem = (items, id, weight) => {
    return items.find((item) => matchesCartItem(item, id, weight));
  };

  const addToCart = async (product) => {
    if (!product || typeof product !== "object") {
      error("Unable to add invalid product to cart");
      return;
    }

    const { showToast = true, quantity = 1, ...productData } = product;
    const selectedVariant =
      productData.selectedVariant ||
      productData.variants?.[0] ||
      ({
        weight: "1kg",
        price: Number(productData.price) || 0,
      });

    const selectedWeight = selectedVariant.weight || "1kg";
    const productSlug = toProductSlug(productData);
    const previousItems = [...cartItems];

    setCartItems((currentItems) => {
      const existingProduct = currentItems.find((item) =>
        matchesCartItem(item, productData.id, selectedWeight, productSlug)
      );

      if (existingProduct) {
        return currentItems.map((item) =>
          matchesCartItem(item, productData.id, selectedWeight, productSlug)
            ? {
                ...item,
                quantity: Number(item.quantity || 0) + Number(quantity || 1),
              }
            : item
        );
      }

      return [
        ...currentItems,
        normalizeCartItem({
          ...productData,
          id: productData.id ?? productData.productId,
          productId: productData.productId ?? productData.id,
          productSlug,
          selectedVariant,
          quantity: Number(quantity) || 1,
        }),
      ];
    });

    if (!isAuthenticated) {
      if (showToast) {
        success("Added to cart");
      }
      return;
    }

    try {
      const payload = buildCartItemPayload({
        ...productData,
        id: productData.id ?? productData.productId,
        productSlug,
        selectedVariant,
        quantity: Number(quantity) || 1,
      });
      // Product payload normalization should preserve the cart image field
      // regardless of whether the catalog uses image, imageUrl, or productImage.

      await customerCommerceApi.addToCart(payload);
      await loadRemoteCart();

      if (showToast) {
        success("Added to cart");
      }
    } catch (err) {
      setCartItems(previousItems);
      error(err?.response?.data?.message || "Unable to add item to cart");
    }
  };

  const removeFromCart = async (id, weight, notify = true) => {
    const item = findMatchingItem(cartItems, id, weight);

    if (isAuthenticated && item?.cartItemId) {
      try {
        await customerCommerceApi.removeCartItem(item.cartItemId);
        await loadRemoteCart();
      } catch (err) {
        error(err?.response?.data?.message || "Unable to remove item from cart");
        return;
      }
    } else {
      setCartItems((currentItems) =>
        currentItems.filter(
          (currentItem) => !(currentItem.id === id && (currentItem.selectedVariant?.weight || "1kg") === (weight || "1kg"))
        )
      );
    }

    if (notify) {
      success("Removed from cart");
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      setCartItems([]);
      try {
        await customerCommerceApi.clearCart();
        await loadRemoteCart({ force: true });
        success("Cart cleared");
        return true;
      } catch (err) {
        error(err?.response?.data?.message || "Unable to clear cart");
        return false;
      }
    }

    setCartItems([]);
    try {
      window.localStorage.removeItem("cart");
    } catch {
      // The in-memory cart is still cleared when browser storage is unavailable.
    }
    success("Cart cleared");
    return true;
  };

  const saveForLater = async (id, weight, fallbackItem = null) => {
    const item = findMatchingItem(cartItems, id, weight) || fallbackItem;

    if (!item) {
      error("Unable to save item for later");
      return;
    }

    if (isAuthenticated) {
      try {
        // Ensure the item is in the actual wishlist (rather than the separate
        // saved-items collection) before removing it from the cart.
        const added = await addToWishlist(item, { ensurePresent: true });
        if (!added) throw new Error("Unable to move item to wishlist");
        await removeFromCart(id, weight, false);
        success("Moved to wishlist");
        return;
      } catch (err) {
        error(err?.response?.data?.message || "Unable to move item to wishlist");
        return;
      }
    }

    const added = await addToWishlist(item);
    if (!added) return;
    await removeFromCart(id, weight, false);
    success("Moved to wishlist");
  };

  const increaseQuantity = async (id, weight) => {
    const item = findMatchingItem(cartItems, id, weight);

    if (isAuthenticated && item?.cartItemId) {
      try {
        await customerCommerceApi.updateCartItem(item.cartItemId, Number(item.quantity || 1) + 1);
        await loadRemoteCart();
        return;
      } catch (err) {
        error(err?.response?.data?.message || "Unable to update cart item");
        return;
      }
    }

    setCartItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === id && (currentItem.selectedVariant?.weight || "1kg") === (weight || "1kg")
          ? {
              ...currentItem,
              quantity: currentItem.quantity + 1,
            }
          : currentItem
      )
    );
  };

  const decreaseQuantity = async (id, weight) => {
    const item = findMatchingItem(cartItems, id, weight);

    if (isAuthenticated && item?.cartItemId) {
      try {
        await customerCommerceApi.updateCartItem(item.cartItemId, Math.max(1, Number(item.quantity || 1) - 1));
        await loadRemoteCart();
        return;
      } catch (err) {
        error(err?.response?.data?.message || "Unable to update cart item");
        return;
      }
    }

    setCartItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === id && (currentItem.selectedVariant?.weight || "1kg") === (weight || "1kg")
          ? {
              ...currentItem,
              quantity: currentItem.quantity > 1 ? currentItem.quantity - 1 : 1,
            }
          : currentItem
      )
    );
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.selectedVariant?.price ?? item.price ?? 0);
      const quantity = Number(item.quantity ?? 0);
      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        saveForLater,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        refreshCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
