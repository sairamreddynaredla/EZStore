import { useEffect, useMemo, useState } from "react";

import { CartContext } from "./cart-context";
import { useToast } from "./toast-context";
import customerCommerceApi from "../services/customerCommerceApi";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "./usewishlist";

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

    return (parsed || []).map((item) => {
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
};

const normalizeCartItem = (item) => {
  const selectedVariant = item.selectedVariant || item.variant || item.variants?.[0] || {
    weight: "1kg",
    price: Number(item.unitPrice ?? item.price ?? 0),
  };

  const unitPrice = Number(item.unitPrice ?? item.price ?? selectedVariant.price ?? 0);
  const normalizedVariant = {
    ...(selectedVariant || {}),
    price: Number(selectedVariant?.price ?? unitPrice ?? 0),
    weight: selectedVariant?.weight || selectedVariant?.variantKey || "1kg",
  };

  return {
    ...item,
    id: item.productId ?? item.id,
    productId: item.productId ?? item.id,
    cartItemId: item.cartItemId ?? item.id,
    name: item.productName ?? item.name ?? "Product",
    image: item.productImage ?? item.image ?? item.product?.imageUrl ?? null,
    price: unitPrice,
    quantity: Number(item.quantity ?? 1),
    selectedVariant: normalizedVariant,
    stock: item.stock ?? 100,
  };
};

const CartProvider = ({ children }) => {
  const { success, error } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { addToWishlist } = useWishlist();
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [hydrated, setHydrated] = useState(false);

  const loadRemoteCart = async () => {
    try {
      const response = await customerCommerceApi.getCart();
      const items = Array.isArray(response?.data?.items) ? response.data.items : [];
      setCartItems(items.map(normalizeCartItem));
    } catch (err) {
      console.error(err);
      setCartItems([]);
    } finally {
      setHydrated(true);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isAuthenticated) {
      loadRemoteCart();
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

  const findMatchingItem = (items, id, weight) => {
    return items.find((item) => {
      const itemWeight = item.selectedVariant?.weight || item.selectedVariant?.variantKey || "1kg";
      return item.id === id && itemWeight === (weight || "1kg");
    });
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

    if (isAuthenticated) {
      try {
        const payload = {
          productId: Number(productData.id),
          // Category pages use the local catalog, whose numeric IDs do not
          // necessarily match the database IDs. The API resolves this slug
          // to the authoritative product ID before storing the cart item.
          productSlug: toProductSlug(productData),
          productName: productData.name || "Product",
          productImage: productData.image || productData.imageUrl || null,
          price: Number(productData.price ?? selectedVariant.price ?? 0),
          unitPrice: Number(productData.price ?? selectedVariant.price ?? 0),
          quantity: Number(quantity) || 1,
          variantKey: selectedWeight,
          selectedVariant,
        };

        await customerCommerceApi.addToCart(payload);
        await loadRemoteCart();

        if (showToast) {
          success("Added to cart");
        }
        return;
      } catch (err) {
        error(err?.response?.data?.message || "Unable to add item to cart");
        return;
      }
    }

    setCartItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) =>
          item.id === productData.id &&
          (item.selectedVariant?.weight || "1kg") === selectedWeight
      );

      if (existingProduct) {
        return currentItems.map((item) =>
          item.id === productData.id &&
          (item.selectedVariant?.weight || "1kg") === selectedWeight
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...productData,
          selectedVariant,
          quantity,
        },
      ];
    });

    if (showToast) {
      success("Added to cart");
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
      try {
        await customerCommerceApi.clearCart();
        await loadRemoteCart();
        success("Cart cleared");
        return;
      } catch (err) {
        error(err?.response?.data?.message || "Unable to clear cart");
        return;
      }
    }

    setCartItems([]);
    success("Cart cleared");
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
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
