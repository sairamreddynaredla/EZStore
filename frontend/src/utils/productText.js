export const normalizeFlavor = (flavor) => {
  const cleaned = String(flavor || "Chicken").trim();
  if (/rice/i.test(cleaned) || cleaned.includes("&")) {
    return cleaned;
  }
  return `${cleaned} & Rice`;
};

export const getFlavorMeatLabel = (flavor) =>
  String(flavor || "Chicken").trim().replace(/\s*&\s*.*$/i, "");
