/**
 * Reusable Buy Now Button
 * Props:
 * - onClick: function to handle click
 * - disabled: boolean to disable button
 * - children: button label (default: 'Buy Now')
 * - className: additional classes
 */
import { trackBuyNow } from "../utils/analytics";

const BuyNowButton = ({
  onClick,
  disabled,
  children = "Buy Now",
  className = "",
  analyticsPayload,
}) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    const quantity = analyticsPayload?.quantity || 1;
    try {
      trackBuyNow(analyticsPayload || {}, quantity);
    } catch (err) {
      /* ignore */
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full min-w-45 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 bg-amber-500 hover:bg-amber-600 text-white ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default BuyNowButton;
