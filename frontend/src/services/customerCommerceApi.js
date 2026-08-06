import authApi from "./authApi";

let cachedPaymentConfig = null;
let paymentConfigRequest = null;
let cachedAddresses = null;
let savedAddressesRequest = null;
let cartRequest = null;

const customerCommerceApi = {
  getCart: ({ force = false } = {}) => {
    if (cartRequest && !force) {
      return cartRequest;
    }

    const request = authApi.get("/customer/cart").finally(() => {
      if (cartRequest === request) {
        cartRequest = null;
      }
    });
    cartRequest = request;

    return request;
  },
  addToCart: (payload) => authApi.post("/customer/cart", payload),
  updateCartItem: (itemId, quantity) => authApi.patch(`/customer/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId) => authApi.delete(`/customer/cart/${itemId}`),
  clearCart: () => authApi.delete("/customer/cart"),
  validateCoupon: (payload) => authApi.post("/customer/coupons/validate", payload),
  getWishlist: () => authApi.get("/customer/wishlist"),
  toggleWishlist: (payload) => authApi.post("/customer/wishlist", payload),
  removeWishlistItem: (wishlistItemId) => authApi.delete(`/customer/wishlist/${wishlistItemId}`),
  addToWishlist: (payload) => authApi.post("/customer/wishlist/add", payload),
  getSavedItems: () => authApi.get("/customer/saved"),
  saveForLater: (payload) => authApi.post("/customer/saved", payload),
  getRecentlyViewed: () => authApi.get("/customer/recently-viewed"),
  trackRecentlyViewed: (payload) => authApi.post("/customer/recently-viewed", payload),
  getReviews: (params = {}) => authApi.get("/customer/reviews", { params }),
  submitReview: (payload) => authApi.post("/customer/reviews", payload),
  getAddresses: (params = {}) => {
    if (cachedAddresses) {
      return Promise.resolve(cachedAddresses);
    }
    if (!savedAddressesRequest) {
      savedAddressesRequest = authApi.get("/addresses", { params }).finally(() => {
        savedAddressesRequest = null;
      });
    }
    return savedAddressesRequest.then((response) => {
      cachedAddresses = response;
      return response;
    });
  },
  createOrder: (payload, idempotencyKey) => authApi.post("/payment/create-order", payload, {
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
  }),
  getPayment: (paymentId) => authApi.get(`/payment/${paymentId}`),
  getPaymentByOrder: (orderId) => authApi.get(`/payment/order/${orderId}`),
  getPaymentsForCustomer: () => authApi.get("/payment/customer"),
  getPaymentConfig: () => {
    if (cachedPaymentConfig) {
      return Promise.resolve(cachedPaymentConfig);
    }
    if (!paymentConfigRequest) {
      paymentConfigRequest = authApi.get("/payment/config").finally(() => {
        paymentConfigRequest = null;
      });
    }
    return paymentConfigRequest.then((response) => {
      cachedPaymentConfig = response;
      return response;
    });
  },
  getOrders: () => authApi.get("/orders"),
  // Do not leave the order-success page loading forever when the API is unavailable.
  getOrder: (orderId) => authApi.get(`/orders/${orderId}`, { timeout: 15000 }),
  cancelOrder: (orderId) => authApi.post(`/orders/${orderId}/cancel`),
  requestReturn: (orderId, payload = {}) => authApi.post(`/orders/${orderId}/returns`, payload),
  requestRefund: (orderId, payload = {}) => authApi.post(`/orders/${orderId}/refunds`, payload),
};

export default customerCommerceApi;
