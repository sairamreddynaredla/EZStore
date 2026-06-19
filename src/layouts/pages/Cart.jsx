import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/usecart";
import { useWishlist } from "../../context/usewishlist";
import { useState, useEffect } from "react";
import {
  Trash2,
  Heart,
  ShoppingCart,
  Truck,
  Gift,
  AlertCircle,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { COUPONS } from "../../data/checkoutData";

const Cart = () => {
  const navigate = useNavigate();

  const { cartItems, totalPrice, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
    useCart();

  const { addToWishlist } = useWishlist();
  const visibleItems = cartItems.filter((item) => item && item.selectedVariant);

  // Coupon state
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponValid, setCouponValid] = useState(false);

  // New features state
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [cartNotes, setCartNotes] = useState("");
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showBulkOffers, setShowBulkOffers] = useState(false);
  const [deletedItems, setDeletedItems] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);

  // Calculate bulk discount
  const getBulkDiscount = (item) => {
    const quantity = item.quantity;
    if (quantity >= 10) return 0.15; // 15% off
    if (quantity >= 5) return 0.1; // 10% off
    if (quantity >= 3) return 0.05; // 5% off
    return 0;
  };

  // Calculate delivery cost
  const getDeliveryCost = () => {
    if (selectedDelivery === "standard") return 0;
    if (selectedDelivery === "express") return 9.99;
    return 0;
  };

  // TAX RATE
  const TAX_RATE = 0.1; // 10% tax

  // Get stock status
  const getStockStatus = (item) => {
    const stock = item.stock || 100;
    if (stock <= 0) return { status: "Out of Stock", color: "text-red-600" };
    if (stock <= 5) return { status: `Only ${stock} left!`, color: "text-orange-600" };
    return { status: "In Stock", color: "text-green-600" };
  };

  // Get estimated delivery date
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    let daysToAdd = 0;

    if (selectedDelivery === "standard") daysToAdd = 3;
    else if (selectedDelivery === "express") daysToAdd = 1;

    const deliveryDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Delete with undo
  const handleDeleteWithUndo = (item, weight) => {
    const itemToDelete = { ...item, weight, timestamp: Date.now() };
    setDeletedItems([...deletedItems, itemToDelete]);
    removeFromCart(item.id, weight);
  };

  // Restore deleted item
  const handleRestoreItem = (deletedItem) => {
    setDeletedItems(deletedItems.filter((item) => item.timestamp !== deletedItem.timestamp));
  };

  // Calculate discount
  const appliedCoupon = COUPONS.find((c) => c.code === coupon);
  const couponDiscount = couponValid && appliedCoupon ? appliedCoupon.discount : 0;

  // Calculate bulk discounts
  const bulkDiscounts = visibleItems.reduce((sum, item) => {
    const itemTotal = (item.selectedVariant?.price ?? 0) * item.quantity;
    return sum + itemTotal * getBulkDiscount(item);
  }, 0);

  const deliveryCost = getDeliveryCost();

  const subtotal = totalPrice;
  const totalDiscount = couponDiscount + bulkDiscounts;
  const total = Math.max(0, subtotal - totalDiscount + deliveryCost);

  // Calculate tax
  const tax = Number(((subtotal - totalDiscount) * TAX_RATE).toFixed(2));
  const finalTotal = Math.max(0, subtotal - totalDiscount + deliveryCost + tax);

  // Handle coupon apply
  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      setCouponMessage("Please enter a coupon code");
      setCouponValid(false);
      return;
    }

    const found = COUPONS.find((c) => c.code.toLowerCase() === coupon.toLowerCase());
    if (found) {
      setCouponMessage(`✓ Coupon "${found.code}" applied! You saved $${found.discount}`);
      setCouponValid(true);
      setCoupon(found.code);
    } else {
      setCouponMessage("Invalid coupon code");
      setCouponValid(false);
    }
  };

  // Load recently viewed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, []);

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    setCoupon("");
    setCouponValid(false);
    setCouponMessage("");
  };

  // Save for later - adds to wishlist
  const handleSaveForLater = (id, weight) => {
    const item = visibleItems.find((i) => i.id === id && i.selectedVariant?.weight === weight);
    if (item) {
      addToWishlist(item);
      removeFromCart(id, weight);
    }
  };

  const handleConfirmClear = () => {
    // Clear entire cart at once
    clearCart();
    setShowClearModal(false);
  };

  const handleCancelClear = () => {
    setShowClearModal(false);
  };

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen">
        {/* Amazon-style header */}
        <div className="border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
          {visibleItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Main Cart Items - LEFT (3 columns) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Items header */}
                <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-semibold">
                      {visibleItems.length} item
                      {visibleItems.length !== 1 ? "s" : ""}
                    </span>{" "}
                    in your cart
                  </p>
                  <button
                    onClick={() => setShowClearModal(true)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline whitespace-nowrap"
                  >
                    Clear
                  </button>
                </div>

                {/* Cart Items */}
                {visibleItems.map((item, idx) => {
                  const bulkDiscount = getBulkDiscount(item);
                  const itemPrice = item.selectedVariant?.price ?? 0;
                  const itemSubtotal = itemPrice * item.quantity;
                  const itemBulkDiscount = itemSubtotal * bulkDiscount;
                  const itemTotal = itemSubtotal - itemBulkDiscount;

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
                        {/* Product Image */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative mx-auto sm:mx-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                            loading="lazy"
                          />
                          {/* Stock indicator badge */}
                          <div
                            className={`absolute top-2 right-2 ${getStockStatus(item).color} bg-white px-2 py-1 rounded-full text-xs font-semibold border`}
                          >
                            {getStockStatus(item).status}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2 hidden sm:flex">
                              <div className="flex text-yellow-400 text-sm">
                                {[...Array(4)].map((_, i) => (
                                  <span key={i}>★</span>
                                ))}
                                <span className="text-gray-400">☆</span>
                              </div>
                              <span className="text-xs text-gray-600">(412)</span>
                            </div>

                            {/* Variant info */}
                            {item.selectedVariant?.weight && (
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                                Weight:{" "}
                                <span className="font-semibold">{item.selectedVariant.weight}</span>
                              </p>
                            )}

                            {/* Price with bulk discount */}
                            <div className="mb-3 sm:mb-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xl sm:text-2xl font-bold text-red-600">
                                  ${itemPrice.toFixed(0)}
                                </span>
                                {bulkDiscount > 0 && (
                                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                                    {Math.round(bulkDiscount * 100)}% OFF
                                  </span>
                                )}
                              </div>
                              {item.quantity >= 3 && (
                                <p className="text-xs text-green-600 mt-1">
                                  💰 Save ${itemBulkDiscount.toFixed(0)}!
                                </p>
                              )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <label className="text-xs sm:text-sm text-gray-700 font-semibold">
                                Qty:
                              </label>
                              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                <button
                                  onClick={() =>
                                    decreaseQuantity(item.id, item.selectedVariant?.weight)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 font-bold text-lg transition-colors"
                                >
                                  −
                                </button>
                                <span className="px-4 sm:px-6 py-2 font-semibold text-center min-w-12">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    increaseQuantity(item.id, item.selectedVariant?.weight)
                                  }
                                  className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center hover:bg-gray-100 font-bold text-lg transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-200 flex-wrap text-xs sm:text-sm">
                            <button
                              onClick={() =>
                                handleDeleteWithUndo(item, item.selectedVariant?.weight)
                              }
                              className="flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-800 hover:underline font-semibold py-2 px-1 -ml-1"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                handleSaveForLater(item.id, item.selectedVariant?.weight)
                              }
                              className="flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-800 hover:underline font-semibold py-2 px-1"
                            >
                              <Heart size={16} />
                              Save for later
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right font-bold">
                          <div className="text-lg sm:text-xl text-gray-900">
                            ${itemTotal.toFixed(0)}
                          </div>
                          {itemBulkDiscount > 0 && (
                            <p className="text-xs text-red-600 mt-1">
                              -${itemBulkDiscount.toFixed(0)} bulk
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Summary - RIGHT (1 column) */}
              <div className="lg:col-span-1 space-y-4">
                {/* Bulk Offers Dropdown */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowBulkOffers(!showBulkOffers)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between hover:bg-amber-100 transition-colors gap-2"
                  >
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <span className="text-base sm:text-lg">🎁</span>
                      <span className="hidden sm:inline">Special Bulk Offers</span>
                      <span className="sm:hidden">Bulk Offers</span>
                    </h3>
                    <ChevronRight
                      size={20}
                      className={`text-amber-700 transition-transform ${
                        showBulkOffers ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {showBulkOffers && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t-2 border-amber-300 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200 text-xs sm:text-sm">
                        <span className="font-bold text-amber-700 whitespace-nowrap">Buy 3+</span>
                        <span className="text-gray-600 flex-1">Save 5%</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200 text-xs sm:text-sm">
                        <span className="font-bold text-amber-700 whitespace-nowrap">Buy 5+</span>
                        <span className="text-gray-600 flex-1">Save 10%</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200 text-xs sm:text-sm">
                        <span className="font-bold text-amber-700 whitespace-nowrap">Buy 10+</span>
                        <span className="text-gray-600 flex-1">Save 15%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Undo Delete Notifications */}
                {deletedItems.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      Recently Deleted
                    </p>
                    {deletedItems.slice(-3).map((deletedItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white p-2 rounded border border-blue-100 text-xs sm:text-sm gap-2"
                      >
                        <span className="text-gray-700 line-clamp-1">{deletedItem.name}</span>
                        <button
                          onClick={() => handleRestoreItem(deletedItem)}
                          className="text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap"
                        >
                          Undo
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Delivery Options */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Truck size={16} className="sm:w-5 sm:h-5" />
                    Delivery Speed
                  </h3>
                  <div className="mb-3 p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">
                      📅 <span className="hidden sm:inline">Estimated Delivery:</span>
                      <span className="sm:hidden">Est. Delivery:</span>{" "}
                      <span className="font-semibold text-gray-900">
                        {getEstimatedDeliveryDate()}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        id: "standard",
                        label: "Standard",
                        time: "5-7 days",
                        cost: 0,
                        displayLabel: "Standard Delivery (3-5 Days)",
                        dateRange: "Tue, 28 May – Thu, 30 May",
                      },
                      {
                        id: "express",
                        label: "Express",
                        time: "2-3 days",
                        cost: 9.99,
                        displayLabel: "Express Delivery (1-2 Days)",
                        dateRange: "Sat, 25 May – Mon, 27 May",
                      },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer text-xs sm:text-sm"
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={selectedDelivery === option.id}
                          onChange={(e) => setSelectedDelivery(e.target.value)}
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-600">{option.time}</p>
                        </div>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          {option.cost === 0 ? "FREE" : `$${option.cost.toFixed(0)}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Summary Sticky */}
                <div className="bg-white border border-gray-300 rounded-lg p-3 sm:p-5 sm:sticky sm:top-6 shadow-sm">
                  {/* Main Price Breakdown */}
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="text-gray-900 font-semibold">${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Coupon discount */}
                    {couponValid && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Coupon:</span>
                        <span className="font-semibold">-${couponDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Bulk discounts */}
                    {bulkDiscounts > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Bulk Savings:</span>
                        <span className="font-semibold">-${bulkDiscounts.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Shipping */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Delivery:</span>
                      <span
                        className={
                          deliveryCost === 0
                            ? "text-green-600 font-semibold"
                            : "text-gray-900 font-semibold"
                        }
                      >
                        {deliveryCost === 0 ? "FREE" : `$${deliveryCost.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 sm:pt-3">
                      <span className="text-gray-700">Tax (10%):</span>
                      <span className="text-gray-900 font-semibold">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Cost Breakdown Toggle */}
                  <button
                    onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
                    className="w-full text-left text-xs text-blue-600 hover:text-blue-800 py-2 font-semibold border-b border-gray-200"
                  >
                    {showTaxBreakdown ? "Hide" : "Show"} breakdown
                  </button>

                  {showTaxBreakdown && (
                    <div className="bg-gray-50 rounded p-2 sm:p-3 my-2 sm:my-4 text-xs space-y-1 sm:space-y-2 border border-gray-200">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      {(couponDiscount > 0 || bulkDiscounts > 0) && (
                        <div className="flex justify-between text-green-600">
                          <span>Discounts:</span>
                          <span className="font-semibold">-${totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-700">
                        <span>Delivery:</span>
                        <span
                          className={
                            deliveryCost === 0 ? "text-green-600 font-semibold" : "font-semibold"
                          }
                        >
                          {deliveryCost === 0 ? "FREE" : `$${deliveryCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700 border-t border-gray-300 pt-1 sm:pt-2">
                        <span>Tax (10%):</span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="bg-green-100 rounded p-2 sm:p-3 mb-3 sm:mb-4 border border-green-300">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                        Order Total:
                      </span>
                      <span className="text-lg sm:text-2xl font-bold text-green-700 whitespace-nowrap">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed to Checkout */}
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg mb-2 transition-colors text-xs sm:text-base"
                  >
                    Checkout
                  </button>

                  <button
                    onClick={() => navigate("/shop")}
                    className="w-full border border-gray-300 hover:border-gray-500 text-gray-900 font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-base"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Recently Viewed Items */}
                {recentlyViewed.length > 0 && (
                  <div className="mt-8 border-t-2 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold">Recently Viewed</h2>
                      <button
                        onClick={() => setShowRecentlyViewed(!showRecentlyViewed)}
                        className="text-blue-600 text-sm"
                      >
                        {showRecentlyViewed ? "Hide" : "Show"}
                      </button>
                    </div>
                    {showRecentlyViewed && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {recentlyViewed.slice(0, 6).map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            <div className="w-full aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain p-2"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm font-bold text-red-600">${item.price}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty Cart */
            <div className="text-center py-16">
              <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your EZStore cart is empty</h2>
              <p className="text-gray-600 mb-6">But it doesn't have to stay that way!</p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg inline-block transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
      {showClearModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="absolute inset-0 bg-black/40" onClick={handleCancelClear} />
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-[10000]"
          >
            <h3 className="text-lg font-semibold mb-2">Clear Cart</h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to clear your entire cart?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelClear}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
