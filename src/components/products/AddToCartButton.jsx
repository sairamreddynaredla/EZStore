import { Check } from "lucide-react";
import { useState } from "react";


// Accepts a full product object for dynamic cart addition
const AddToCartButton = ({
  product,
  isOutOfStock = false,
  onAddToCart,
  quantity = 1,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAdding(true);

    if (onAddToCart && product) {
      await onAddToCart(product, quantity);
    }

    setIsAdding(false);
    setIsAdded(true);

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isAdding}
      className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isAdded
          ? "bg-[#16A34A] text-white"
          : isOutOfStock
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-lg hover:shadow-xl"
      }`}
      aria-label={`Add ${product?.name} to cart`}
    >
      {isAdding ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check size={20} />
          Added!
        </>
      ) : isOutOfStock ? (
        "Out of Stock"
      ) : (
        <>
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
