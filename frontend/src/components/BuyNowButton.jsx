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
      className={`w-full py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 btn btn-primary ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      // remove shrink-on-click by not using active scale transforms
    >
      {children}
    </button>
  );
};

export default BuyNowButton;
