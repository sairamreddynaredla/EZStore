import authApi from "./authApi";

const customerCommerceApi = {
  getCart: () => authApi.get("/customer/cart"),
  addToCart: (payload) => authApi.post("/customer/cart", payload),
  updateCartItem: (itemId, quantity) => authApi.patch(`/customer/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId) => authApi.delete(`/customer/cart/${itemId}`),
  clearCart: () => authApi.delete("/customer/cart"),
  getWishlist: () => authApi.get("/customer/wishlist"),
  toggleWishlist: (payload) => authApi.post("/customer/wishlist", payload),
  addToWishlist: (payload) => authApi.post("/customer/wishlist/add", payload),
  getSavedItems: () => authApi.get("/customer/saved"),
  saveForLater: (payload) => authApi.post("/customer/saved", payload),
  getRecentlyViewed: () => authApi.get("/customer/recently-viewed"),
  trackRecentlyViewed: (payload) => authApi.post("/customer/recently-viewed", payload),
  getReviews: (params = {}) => authApi.get("/customer/reviews", { params }),
  submitReview: (payload) => authApi.post("/customer/reviews", payload),
  createOrder: (payload) => authApi.post("/orders", payload),
  getOrders: () => authApi.get("/orders"),
  getOrder: (orderId) => authApi.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => authApi.post(`/orders/${orderId}/cancel`),
  requestReturn: (orderId, payload = {}) => authApi.post(`/orders/${orderId}/returns`, payload),
  requestRefund: (orderId, payload = {}) => authApi.post(`/orders/${orderId}/refunds`, payload),
};

export default customerCommerceApi;
