export function trackEvent(name, payload = {}) {
  try {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: name, ...payload });
      return;
    }
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, payload);
      return;
    }
  } catch (e) {
    // ignore
  }
  // Fallback for local dev: console
  // Keep shape consistent for analytics QA
  // Example: trackEvent('add_to_cart', { id: 2, sku: 'ped-1kg', quantity: 1 })
  // eslint-disable-next-line no-console
  console.log("[analytics] trackEvent", name, payload);
}

export function trackAddToCart(product = {}, quantity = 1) {
  trackEvent("add_to_cart", {
    product_id: product.id,
    sku: product.selectedVariant?.weight || product.variants?.[0]?.weight,
    name: product.name,
    price: product.selectedVariant?.price || product.price,
    quantity,
  });
}

export function trackBuyNow(product = {}, quantity = 1) {
  trackEvent("buy_now_click", {
    product_id: product.id,
    sku: product.selectedVariant?.weight || product.variants?.[0]?.weight,
    name: product.name,
    price: product.selectedVariant?.price || product.price,
    quantity,
  });
}

export function trackAddToWishlist(product = {}) {
  trackEvent("add_to_wishlist", {
    product_id: product.id,
    sku: product.selectedVariant?.weight || product.variants?.[0]?.weight,
    name: product.name,
  });
}

export function trackRemoveFromWishlist(product = {}) {
  trackEvent("remove_from_wishlist", {
    product_id: product.id || product,
  });
}
