import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import useCart from "../../hooks/usecart";
import { trackAddToCart } from "../../utils/analytics";

/**
 * Zigly-style Add to Cart button:
 * - Default: outlined "Add to Cart" (red border + red text on white bg, fills on hover)
 * - In cart: inline − qty + stepper with red bg
 * - Synced to cart state
 */
const AddToCartButton = ({ product, isOutOfStock = false, onAddToCart, btnClass }) => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, showFlash } = useCart();
  const [flash, setFlash] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [mobileVariantIdx, setMobileVariantIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 640 : false);

  // update isMobile on resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
    // On small screens, if variants exist, open variant picker modal
    if (typeof window !== "undefined" && window.innerWidth < 640 && (product.variants || []).length > 0) {
      setShowVariantModal(true);
      return;
    }
    const payload = { ...product, selectedVariant };
    if (onAddToCart) onAddToCart(payload, 1);
    try {
      trackAddToCart(payload, 1);
    } catch (err) {
      /* ignore analytics errors */
    }
    try {
      showFlash && showFlash("Added to cart", "success");
    } catch (err) {}
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  const navigate = useNavigate();

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
      try {
        showFlash && showFlash("Removed from cart", "error");
      } catch (err) {}
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
        className="w-full flex items-center justify-between bg-amber-500 rounded-lg sm:rounded-xl h-10 sm:h-12 overflow-hidden"
      >
        <button
          onClick={handleDecrease}
          className="w-10 sm:w-12 h-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <span className="text-white font-bold text-[14px] sm:text-[15px] select-none">{cartQty}</span>
        <button
          onClick={handleIncrease}
          className="w-10 sm:w-12 h-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Default → Add to Cart (desktop) or Add to Bag (mobile)
  return (
    <>
      <button
        onClick={handleAdd}
        className={
          btnClass
            ? btnClass
            : `w-full py-2 sm:py-3 rounded-md sm:rounded-xl text-sm sm:text-[14px] font-semibold transition-all duration-200 active:scale-95 bg-[#F59E0B] hover:bg-[#D97706] text-white`
        }
      >
        {flash ? "Added!" : "Add to Cart"}
      </button>

      {showVariantModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowVariantModal(false)}
          />

          <div className="relative w-full bg-white rounded-t-2xl p-4 sm:hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <img src={product.image || product.images?.[0]} alt={product.name} className="w-16 h-16 object-contain rounded" />
                <div>
                  <h3 className="font-semibold text-base leading-snug">{product.name}</h3>
                  <div className="text-sm font-semibold mt-1">{(product.variants || [])[mobileVariantIdx]?.weight || product.selectedVariant?.weight || ""}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold">₹{(((product.variants || [])[mobileVariantIdx]?.price) || product.selectedVariant?.price || product.price)?.toString()}</span>
                    {(((product.variants || [])[mobileVariantIdx]?.originalPrice) || product.selectedVariant?.originalPrice || product.originalPrice) > (((product.variants || [])[mobileVariantIdx]?.price) || product.selectedVariant?.price || product.price) && (
                      <span className="text-gray-400 line-through text-sm">₹{(((product.variants || [])[mobileVariantIdx]?.originalPrice) || product.selectedVariant?.originalPrice || product.originalPrice).toString()}</span>
                    )}
                    {(() => {
                      const orig = (((product.variants || [])[mobileVariantIdx]?.originalPrice) || product.selectedVariant?.originalPrice || product.originalPrice) || 0;
                      const cur = (((product.variants || [])[mobileVariantIdx]?.price) || product.selectedVariant?.price || product.price) || 0;
                      const disc = orig > cur ? Math.round(((orig - cur) / orig) * 100) : 0;
                      return disc > 0 ? (<span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">{disc}% OFF</span>) : null;
                    })()}
                  </div>
                </div>
              </div>
              <div>
                <button onClick={() => { setShowVariantModal(false); navigate(`/product/${product.id}`, { state: { product } }); }} className="text-sm text-gray-600">View</button>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="text-sm font-medium mb-2">Select Size</div>

              <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
                {(product.variants || []).map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMobileVariantIdx(idx)}
                    className={`min-w-[86px] flex-shrink-0 text-center px-4 py-3 rounded-lg border font-semibold ${
                      mobileVariantIdx === idx ? "bg-[#1B3A6B] text-white border-[#1B3A6B]" : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const sel = (product.variants || [])[mobileVariantIdx] || product.selectedVariant || product;
                    const payload = { ...product, selectedVariant: sel };
                    if (onAddToCart) onAddToCart(payload, 1);
                    setShowVariantModal(false);
                    try { showFlash && showFlash("Added to cart", "success"); } catch (err) {}
                  }}
                  className="w-full py-2 sm:py-3 rounded-md sm:rounded-xl text-sm sm:text-[14px] font-semibold transition-all duration-200 active:scale-95 bg-[#F59E0B] hover:bg-[#D97706] text-white"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCartButton;
