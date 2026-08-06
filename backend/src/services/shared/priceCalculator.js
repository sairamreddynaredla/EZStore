// Helper to compute server-authoritative subtotal for an order
// items: array of { id, quantity, selectedVariant? }
// products: array of product records from DB with { id, price, metadata }
const normalizeProductLookupKey = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

export const computeOrderSubtotal = (items = [], products = []) => {
  const productMap = new Map();
  (products || []).forEach((p) => {
    if (p?.id !== undefined && p?.id !== null) {
      productMap.set(normalizeProductLookupKey(p.id), p);
    }
    if (typeof p?.slug === "string" && p.slug.trim()) {
      productMap.set(p.slug.trim(), p);
    }
  });

  let subtotal = 0;

  for (const item of items) {
    // Frontend catalog IDs are not guaranteed to match database IDs after a
    // catalog import. When a trusted product slug accompanies an old ID, use
    // the slug as a fallback instead of rejecting an otherwise valid cart.
    const productIdKey = normalizeProductLookupKey(item.productId ?? item.id);
    const productSlugKey = normalizeProductLookupKey(item.productSlug ?? item.slug);
    const qty = Math.max(0, Number(item.quantity ?? item.qty ?? 1));
    const product = productMap.get(productIdKey) || productMap.get(productSlugKey);
    if (!product) {
      const itemName = item.name
        ? `"${item.name}"`
        : item.productSlug
        ? `product "${item.productSlug}"`
        : `product ${normalizeProductLookupKey(item.productId ?? item.id)}`;
      const err = new Error(
        `Product not found: ${itemName}. Please update your cart and try again.`
      );
      err.status = 400;
      err.code = "PRODUCT_NOT_FOUND";
      err.productId = Number(item.productId ?? item.id) || null;
      err.itemName = item.name ?? item.productSlug ?? item.slug ?? null;
      throw err;
    }

    let unitPrice = Number(product.price ?? 0);

    const sel = item.selectedVariant || item.variant || null;
    const variants = (product.metadata && product.metadata.variants) || null;
    if (sel && variants && Array.isArray(variants)) {
      const match = variants.find((v) => {
        if (!v) return false;
        const keys = ["weight", "sku", "id", "key", "variantKey", "name"];
        return keys.some((k) => {
          try {
            return sel[k] && String(v[k]) && String(v[k]) === String(sel[k]);
          } catch {
            return false;
          }
        });
      });
      if (match && (match.price !== undefined && match.price !== null)) {
        unitPrice = Number(match.price);
      }
    }

    subtotal += Number((unitPrice * qty) || 0);
  }

  return Math.round(subtotal * 100) / 100;
};

export default { computeOrderSubtotal };
