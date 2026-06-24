import { useState, useCallback, useMemo } from "react";
import { Plus, Minus, AlertCircle } from "lucide-react";
import useCart from "../../hooks/usecart";
import { useOptionalToast } from "../../context/ToastProvider";
import { trackAddToCart } from "../../utils/analytics";

/**
 * Professional Add to Cart Button Component
 * Features:
 * - Intelligent variant handling with validation
 * - Real-time quantity control with stepper UI
 * - Proper error handling and user feedback
 * - Accessibility support (ARIA labels, disabled states)
 * - Analytics integration
 * - Debounced rapid-click prevention
 */
const AddToCartButton = ({ 
  product, 
  isOutOfStock = false, 
  onAddToCart,
  btnClass,
  quantity = 1 
}) => {
  // Validate product data
  if (!product) {
    console.warn("AddToCartButton: product prop is required");
    return null;
  }

  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const toast = useOptionalToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flashSuccess, setFlashSuccess] = useState(false);

  // Memoize variant and weight calculations
  const selectedVariant = useMemo(() => {
    return product?.selectedVariant || product?.variants?.[0] || {
      weight: "1kg",
      price: product?.price || 0,
    };
  }, [product]);

  const weight = useMemo(() => {
    return selectedVariant?.weight || "1kg";
  }, [selectedVariant]);

  // Find matching cart item with memoization
  const cartItem = useMemo(() => {
    return cartItems.find(
      (item) => item?.id === product?.id && (item?.selectedVariant?.weight || "1kg") === weight
    );
  }, [cartItems, product?.id, weight]);

  const cartQty = cartItem?.quantity || 0;
  const inCart = cartQty > 0;

  // Debounced add handler
  const handleAdd = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Prevent double-clicks
    if (isLoading) return;

    // Validate product before adding
    if (!product?.id) {
      setError("Invalid product. Please refresh and try again.");
      toast?.error?.("Unable to add product. Please try again.");
      return;
    }

    if (isOutOfStock) {
      setError("This product is out of stock.");
      toast?.error?.("This product is out of stock.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const payload = { 
        ...product, 
        selectedVariant,
        quantity: quantity || 1 
      };

      // Call parent handler if provided
      if (onAddToCart) {
        await Promise.resolve(onAddToCart(payload, quantity || 1));
      }

      // Track analytics
      try {
        trackAddToCart(payload, quantity || 1);
      } catch (analyticsErr) {
        console.debug("Analytics tracking failed:", analyticsErr);
      }

      // Show success feedback
      toast?.success?.(
        `Added ${quantity || 1}x ${product?.name || "item"} to cart`
      );

      // Flash animation
      setFlashSuccess(true);
      setTimeout(() => setFlashSuccess(false), 1200);
    } catch (err) {
      console.error("Add to cart error:", err);
      setError("Failed to add item to cart. Please try again.");
      toast?.error?.("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [product, selectedVariant, quantity, isOutOfStock, onAddToCart, toast]);

  // Quantity change handlers with proper debouncing
  const handleIncrease = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isLoading) return;
    setIsLoading(true);
    try {
      increaseQuantity(product.id, weight);
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [product.id, weight, increaseQuantity, isLoading]);

  const handleDecrease = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (cartQty <= 1) {
        removeFromCart(product.id, weight);
        toast?.info?.(`${product?.name || "Item"} removed from cart`);
      } else {
        decreaseQuantity(product.id, weight);
      }
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [cartQty, product.id, product?.name, weight, removeFromCart, decreaseQuantity, isLoading, toast]);

  // Out of stock state
  if (isOutOfStock) {
    return (
      <button
        disabled
        aria-label="Out of stock"
        className="w-full py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        <AlertCircle size={16} />
        Out of Stock
      </button>
    );
  }

  // In cart → quantity stepper
  if (inCart) {
    return (
      <div
        className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-600 rounded-xl h-12 overflow-hidden transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        role="group"
        aria-label={`${product?.name || "Item"} quantity control`}
      >
        <button
          onClick={handleDecrease}
          disabled={isLoading}
          aria-label={`Decrease ${product?.name || "item"} quantity`}
          className="w-12 h-full flex items-center justify-center text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
        
        <span 
          className="text-white font-bold text-[15px] select-none min-w-[3rem] text-center"
          aria-live="polite"
          aria-label={`${cartQty} items in cart`}
        >
          {cartQty}
        </span>
        
        <button
          onClick={handleIncrease}
          disabled={isLoading}
          aria-label={`Increase ${product?.name || "item"} quantity`}
          className="w-12 h-full flex items-center justify-center text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    );
  }

  // Default → Add to Cart button
  return (
    <div className="flex flex-col gap-1 w-full">
      <button
        onClick={handleAdd}
        disabled={isLoading}
        aria-label={`Add ${product?.name || "item"} to cart`}
        aria-busy={isLoading}
        className={
          btnClass || 
          `w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 
           ${flashSuccess 
             ? "bg-green-500 text-white" 
             : "bg-amber-400 hover:bg-amber-500 text-black"
           } 
           disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2`
        }
        type="button"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
            Adding...
          </>
        ) : flashSuccess ? (
          <>
            <span>✓</span>
            Added!
          </>
        ) : (
          `Add to Cart${quantity > 1 ? ` (${quantity})` : ""}`
        )}
      </button>
      
      {error && (
        <div className="text-red-600 text-xs font-medium flex items-center gap-1 px-2">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
