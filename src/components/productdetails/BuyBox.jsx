import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "../products/AddToCartButton";
import BuyNowButton from "../BuyNowButton";

const BuyBox = ({
  product,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  addToCart,
  handleBuyNow,
}) => {
  const discountPercentage = selectedVariant?.originalPrice
    ? Math.round(
        ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) *
          100
      )
    : 0;

  // Prefer explicit product.shipFrom, then company, then brand; avoid hardcoding 'Amazon'
  const shipFrom = product.shipFrom || product.company || product.brand || "ETrade Online";
  // Prefer explicit soldBy or seller, fallback to brand when available
  const soldBy = product.soldBy || product.seller || product.brand || "ETrade Online";
  const deliveryDate = product.deliveryDate || "Tuesday, 2 June";
  const fastestDelivery = product.fastestDelivery || "Tomorrow, 1 June";

  return (
    <aside className="w-full lg:w-80 card-premium lg:p-4 p-3 lg:sticky lg:top-28 self-start">
      <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-[20px] border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            Standard purchase
          </div>
          <span className="h-3 w-3 rounded-full border-2 border-slate-700 bg-white" />
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            ${(selectedVariant?.price || product.price).toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-slate-500">($14.99 /0.2lb)</div>
        </div>

        <div className="mt-5 sm:mt-6 space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold text-slate-900">FREE delivery {deliveryDate}</p>
            </div>
            <Link
              to="/delivery-details"
              className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
            >
              Details
            </Link>
          </div>
          <div className="flex items-center justify-start">
            <div>
              <p className="font-semibold text-slate-900">Or fastest delivery {fastestDelivery}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <span className="text-lg">📍</span>
            <span className="font-medium text-slate-900">Deliver to Vijayawada 520010</span>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 text-sm font-semibold text-emerald-700">In stock</div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-xs sm:text-sm font-medium text-slate-700">Quantity</label>
          <div className="mt-3 flex items-center border border-slate-300 rounded-lg bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 font-bold text-lg transition-colors"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold py-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 font-bold text-lg transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => addToCart({ ...product, selectedVariant, quantity })}
          className="mt-4 w-full rounded-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base font-bold shadow-sm bg-amber-400 hover:bg-amber-300 text-black transition-colors"
        >
          Add to cart
        </button>

        <BuyNowButton
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          analyticsPayload={{ ...product, selectedVariant, quantity }}
          className="mt-2 w-full rounded-full bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400"
        >
          Buy Now
        </BuyNowButton>

        <div className="mt-4 text-sm text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span>Ships from</span>
            <span className="font-semibold text-slate-900">{shipFrom}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Sold by</span>
            <span className="font-semibold text-slate-900">{soldBy}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Gift options</span>
            <span className="font-semibold text-slate-900">Available at checkout</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment</span>
            <span className="font-semibold text-slate-900">Secure transaction</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BuyBox;
