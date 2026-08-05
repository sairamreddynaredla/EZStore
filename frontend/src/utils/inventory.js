// Inventory utilities
export const normalizeInventory = (product = {}) => {
  const stock = Number(product.stock ?? 0);
  const status = (product.status || (stock > 0 ? "active" : "out_of_stock")).toString();
  const trackInventory = product.trackInventory === undefined ? true : Boolean(product.trackInventory);
  const lowStockThreshold = Number(product.lowStockThreshold ?? 5);
  const isActive = product.isActive === undefined ? status !== "out_of_stock" : Boolean(product.isActive);

  return { stock, status, trackInventory, lowStockThreshold, isActive };
};

export const getAvailability = (product = {}) => {
  const { stock, status, trackInventory, lowStockThreshold, isActive } = normalizeInventory(product);

  // Determine basic flags
  const discontinued = status === "discontinued";
  const draft = status === "draft";
  const outOfStockStatus = status === "out_of_stock" || (trackInventory && stock <= 0 && status !== "active");

  const isAvailable = isActive && status === "active" && (!trackInventory || stock > 0);

  let availabilityMessage = "";
  if (discontinued) availabilityMessage = "This product has been discontinued.";
  else if (draft) availabilityMessage = "Not available yet.";
  else if (!isActive) availabilityMessage = "Currently unavailable.";
  else if (trackInventory && stock <= 0) availabilityMessage = "Out of Stock";
  else if (trackInventory && stock > 0 && stock <= lowStockThreshold) availabilityMessage = `Only ${stock} left`;
  else availabilityMessage = "In Stock";

  // Badge presentation
  let badge = { text: "", color: "" };
  if (discontinued) badge = { text: "Discontinued", color: "text-gray-500 bg-gray-100" };
  else if (!isActive) badge = { text: "Unavailable", color: "text-gray-500 bg-gray-100" };
  else if (trackInventory && stock <= 0) badge = { text: "Out of Stock", color: "text-red-700 bg-red-100" };
  else if (trackInventory && stock > 0 && stock <= lowStockThreshold) badge = { text: `Only ${stock} Left`, color: "text-orange-700 bg-orange-100" };
  else badge = { text: "In Stock", color: "text-green-700 bg-emerald-100" };

  return {
    isAvailable,
    discontinued,
    draft,
    outOfStock: trackInventory && stock <= 0,
    stock,
    status,
    trackInventory,
    lowStockThreshold,
    isActive,
    availabilityMessage,
    badge,
    canAddToCart: isAvailable,
    showNotifyButton: !isAvailable && trackInventory && !discontinued,
  };
};

export default { normalizeInventory, getAvailability };
