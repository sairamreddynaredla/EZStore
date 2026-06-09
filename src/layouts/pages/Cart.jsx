import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/usecart";
import { useState } from "react";
import { Trash2, Heart, ShoppingCart } from "lucide-react";
import { COUPONS } from "../../data/checkoutData";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const visibleItems = cartItems.filter((item) => item && item.selectedVariant);

  // Coupon state
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  // Calculate discount
  const appliedCoupon = COUPONS.find((c) => c.code === coupon);
  const discount = couponValid && appliedCoupon ? appliedCoupon.discount : 0;

  const shipping = 0;
  const total = Math.max(0, totalPrice - discount + shipping);

  // Handle coupon apply
  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      setCouponMessage("Please enter a coupon code");
      setCouponValid(false);
      return;
    }

    const found = COUPONS.find((c) => c.code.toLowerCase() === coupon.toLowerCase());
    if (found) {
      setCouponMessage(`✓ Coupon "${found.code}" applied! You saved ₹${found.discount}`);
      setCouponValid(true);
      setCoupon(found.code);
    } else {
      setCouponMessage("Invalid coupon code");
      setCouponValid(false);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    setCoupon("");
    setCouponValid(false);
    setCouponMessage("");
  };

  // Save for later
  const handleSaveForLater = (id, weight) => {
    const item = visibleItems.find((i) => i.id === id && i.selectedVariant?.weight === weight);
    if (item) {
      setSavedItems([...savedItems, item]);
      removeFromCart(id, weight);
    }
  };

  // Move from saved to cart
  const handleMoveToCart = (item) => {
    const { id, selectedVariant } = item;
    setSavedItems(
      savedItems.filter((si) => !(si.id === id && si.selectedVariant?.weight === selectedVariant?.weight))
    );
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

        <div className="max-w-7xl mx-auto px-4 py-6">
          {visibleItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Cart Items - LEFT (3 columns) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Items header */}
                <div className="bg-gray-50 px-4 py-3 border border-gray-200 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""}</span> in your cart
                  </p>
                </div>

                {/* Cart Items */}
                {visibleItems.map((item, idx) => {
                  const itemTotal = (item.selectedVariant?.price ?? 0) * item.quantity;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex text-yellow-400">
                                {[...Array(4)].map((_, i) => (
                                  <span key={i}>★</span>
                                ))}
                                <span className="text-gray-400">☆</span>
                              </div>
                              <span className="text-xs text-gray-600">(412 reviews)</span>
                            </div>

                            {/* Variant info */}
                            {item.selectedVariant?.weight && (
                              <p className="text-sm text-gray-600 mb-3">
                                Weight: <span className="font-semibold">{item.selectedVariant.weight}</span>
                              </p>
                            )}

                            {/* Price */}
                            <div className="mb-4">
                              <span className="text-2xl font-bold text-red-600">₹{(item.selectedVariant?.price ?? 0).toFixed(0)}</span>
                              <span className="text-sm text-gray-500 ml-2">each</span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-3 mb-4">
                              <label className="text-sm text-gray-700 font-semibold">Qty:</label>
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() => decreaseQuantity(item.id, item.selectedVariant?.weight)}
                                  disabled={item.quantity <= 1}
                                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  −
                                </button>
                                <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => increaseQuantity(item.id, item.selectedVariant?.weight)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-6 pt-2 border-t border-gray-200">
                            <button
                              onClick={() => removeFromCart(item.id, item.selectedVariant?.weight)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                            <button
                              onClick={() => handleSaveForLater(item.id, item.selectedVariant?.weight)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm"
                            >
                              <Heart size={16} />
                              Save for later
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right font-bold text-xl text-gray-900">₹{itemTotal.toFixed(0)}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Saved for later section */}
                {savedItems.length > 0 && (
                  <div className="mt-8 border-t-2 pt-6">
                    <h2 className="text-lg font-bold mb-4">Saved for later ({savedItems.length})</h2>
                    <div className="space-y-4">
                      {savedItems.map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 flex gap-4 items-center">
                          <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-lg font-bold text-red-600">₹{(item.selectedVariant?.price ?? 0).toFixed(0)}</p>
                          </div>
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded"
                          >
                            Move to cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary - RIGHT (1 column) */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-6">
                  {/* Subtotal */}
                  <div className="mb-4 pb-4 border-b border-gray-300">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="text-gray-900 font-semibold">₹{totalPrice.toFixed(0)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-700">Shipping:</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>

                    {/* Coupon discount */}
                    {couponValid && appliedCoupon && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Discount:</span>
                        <span className="text-green-600 font-semibold">-₹{appliedCoupon.discount}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Order Total:</span>
                      <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout */}
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg mb-3 transition-colors"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate("/shop")}
                    className="w-full border border-gray-400 hover:border-gray-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </button>

                  {/* Coupon section */}
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <p className="text-sm text-gray-600 mb-3 font-semibold">Apply Coupon Code</p>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => {
                          setCoupon(e.target.value);
                          setCouponMessage("");
                        }}
                        onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponValid}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-900 font-semibold rounded text-sm transition-colors"
                      >
                        {couponValid ? "Applied" : "Apply"}
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`text-xs mt-2 ${couponValid ? "text-green-600" : "text-red-600"}`}>{couponMessage}</p>
                    )}
                    {couponValid && (
                      <button onClick={handleRemoveCoupon} className="text-xs text-red-600 hover:text-red-800 mt-2">
                        Remove coupon
                      </button>
                    )}
                  </div>

                  {/* Security badges */}
                  <div className="mt-6 pt-6 border-t border-gray-300 space-y-3 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔒</span>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      <span>Genuine products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚚</span>
                      <span>Fast delivery</span>
                    </div>
                  </div>
                </div>
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
    </>
  );
};

export default Cart;

