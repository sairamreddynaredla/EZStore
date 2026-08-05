// Helper to compute server-authoritative subtotal for an order
// items: array of { id, quantity, selectedVariant? }
// products: array of product records from DB with { id, price, metadata }
export const computeOrderSubtotal = (items = [], products = []) => {
  const productMap = new Map((products || []).map((p) => [p.id, p]));
  let subtotal = 0;

  for (const item of items) {
    const pid = Number(item.id);
    const qty = Math.max(0, Number(item.quantity ?? 1));
    const product = productMap.get(pid);
    if (!product) {
      // Provide helpful error with more context
      const itemName = item.name ? `"${item.name}"` : `product ${item.id}`;
      const err = new Error(
        `Product ${itemName} is no longer available. Please update your cart and try again.`
      );
      err.status = 400;
      err.code = "PRODUCT_NOT_FOUND";
      err.productId = pid;
      err.itemName = item.name;
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
