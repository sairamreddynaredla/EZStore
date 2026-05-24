import { Heart } from "lucide-react";
import { useState } from "react";

// Accepts full product object for dynamic wishlist
const WishlistButton = ({ isWishlisted = false, product, onWishlistToggle }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isWishlisted;
    setIsAnimating(true);

    if (onWishlistToggle && product) {
      onWishlistToggle(product, nextState);
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      onClick={handleWishlistClick}
      className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
        isWishlisted
          ? "bg-red-500 text-white"
          : "bg-white/80 text-gray-400 hover:text-red-500"
      } ${isAnimating ? "scale-125" : "scale-100"}`}
      aria-label="Add to wishlist"
    >
      <Heart
        size={20}
        className={`transition-all ${isWishlisted ? "fill-white" : ""}`}
      />
    </button>
  );
};

export default WishlistButton;
