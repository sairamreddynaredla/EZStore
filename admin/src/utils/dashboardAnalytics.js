const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "$0.00";
  }

  return `$${NUMBER_FORMATTER.format(amount)}`;
};

export const getStatusLabel = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    default:
      return status || "Unknown";
  }
};

export const getStatusTone = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return "warning";
    case "processing":
    case "shipped":
      return "info";
    case "delivered":
      return "success";
    case "cancelled":
    case "refunded":
      return "danger";
    default:
      return "neutral";
  }
};
