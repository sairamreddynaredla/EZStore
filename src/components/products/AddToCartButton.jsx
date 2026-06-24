import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import useCart from "../../hooks/usecart";
import { useOptionalToast } from "../../context/ToastProvider";
import { trackAddToCart } from "../../utils/analytics";

/**
 * Zigly-style Add to Cart button:
 * - Default: outlined "Add to Cart" (red border + red text on white bg, fills on hover)
 * - In cart: inline − qty + stepper with red bg
 * - Synced to cart state
 */
const AddToCartButton = ({ product, isOutOfStock = false, onAddToCart }) => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const toast = useOptionalToast();
  const [flash, setFlash] = useState(false);

  const selectedVariant = product?.selectedVariant || product?.variants?.[0];
  const weight = selectedVariant?.weight || "1kg";

  const cartItem = cartItems.find(
    (item) => item.id === product?.id && (item.selectedVariant?.weight || "1kg") === weight
  );
  const cartQty = cartItem?.quantity || 0;
  const inCart = cartQty > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || !product) return;
    const payload = { ...product, selectedVariant };
    if (onAddToCart) onAddToCart(payload, 1);
    try {
      trackAddToCart(payload, 1);
    } catch (err) {
      /* ignore analytics errors */
    }
    if (toast) {
      toast.success("Added to cart");
    }
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    increaseQuantity(product.id, weight);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQty <= 1) {
      removeFromCart(product.id, weight);
      if (toast) {
        toast.error("Removed from cart");
      }
    } else decreaseQuantity(product.id, weight);
  };

  // Out of stock
  if (isOutOfStock) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  // In cart → stepper
  if (inCart) {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="w-full flex items-center justify-between bg-amber-500 rounded-xl h-12 overflow-hidden"
      >
        <button
          onClick={handleDecrease}
          className="w-12 h-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <span className="text-white font-bold text-[15px] select-none">{cartQty}</span>
        <button
          onClick={handleIncrease}
          className="w-12 h-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Default → Add to Cart (Tailwind-only yellow button)
  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3 rounded-xl text-[13.5px] font-semibold transition-all duration-200 bg-amber-400 hover:bg-amber-300 text-black`}
    >
      {flash ? "Added!" : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
