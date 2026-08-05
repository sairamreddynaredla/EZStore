export const mergeWishlistItems = (guestItems = [], remoteItems = []) => {
  const mergedByProductId = new Map();

  const getProductId = (item) => {
    const rawId = item?.productId ?? item?.id ?? item?.product?.id;
    const parsed = Number(rawId);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const register = (item, isRemote = false) => {
    const productId = getProductId(item);
    if (!productId) {
      return;
    }

    const normalized = {
      ...item,
      id: productId,
      productId,
      // A remote record's id is the wishlist-row id; a guest record's id is
      // the product id and must never be used as a delete endpoint id.
      wishlistItemId: isRemote ? item?.id : item?.wishlistItemId,
      name: item?.name ?? item?.productName ?? item?.product?.name ?? "Product",
      price: item?.price ?? item?.unitPrice ?? item?.product?.price ?? 0,
      image: item?.image ?? item?.productImage ?? item?.product?.imageUrl ?? null,
      selectedVariant: item?.selectedVariant ?? null,
      productName: item?.productName ?? item?.name ?? item?.product?.name ?? "Product",
      productImage: item?.productImage ?? item?.image ?? item?.product?.imageUrl ?? null,
      unitPrice: item?.unitPrice ?? item?.price ?? item?.product?.price ?? 0,
    };

    const existing = mergedByProductId.get(productId);
    // Keep the richer guest catalogue data while preferring the server row id
    // and server values once an authenticated wishlist has been loaded.
    mergedByProductId.set(productId, {
      ...existing,
      ...normalized,
      wishlistItemId: normalized.wishlistItemId ?? existing?.wishlistItemId,
      selectedVariant: normalized.selectedVariant ?? existing?.selectedVariant ?? null,
    });
  };

  guestItems.forEach((item) => register(item));
  remoteItems.forEach((item) => {
    register(item, true);
  });

  return [...mergedByProductId.values()];
};
