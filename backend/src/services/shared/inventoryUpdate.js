export const resolveStockUpdate = (currentStock = 0, update = {}) => {
  const baseStock = Number(currentStock ?? 0);
  const updateType = update?.type === "decrease" ? "decrease" : update?.type === "increase" ? "increase" : "set";
  const rawStock = update?.stock;
  const rawDelta = update?.stockDelta;

  if (updateType === "set") {
    const nextStock = Number(rawStock ?? baseStock);
    return {
      stock: Number.isFinite(nextStock) ? Math.max(0, nextStock) : baseStock,
      change: Number.isFinite(nextStock) ? nextStock - baseStock : 0,
      type: "set",
      reason: update?.reason || "Stock set",
    };
  }

  const delta = Number(rawDelta ?? 0);
  const nextStock = updateType === "increase" ? baseStock + delta : baseStock - delta;

  return {
    stock: Number.isFinite(nextStock) ? Math.max(0, nextStock) : baseStock,
    change: Number.isFinite(delta) ? (updateType === "increase" ? delta : -delta) : 0,
    type: updateType,
    reason: update?.reason || `${updateType === "increase" ? "Stock increase" : "Stock decrease"}`,
  };
};
