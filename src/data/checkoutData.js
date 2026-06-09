// Coupon codes
export const COUPONS = [
  { code: "WELCOME10", discount: 200, description: "Welcome discount" },
  { code: "SAVE20", discount: 500, description: "Save 20% off" },
  { code: "FREESHIP", discount: 0, shippingDiscount: true, description: "Free shipping" },
  { code: "SUMMER30", discount: 1000, description: "Summer special 30% off" },
];

// Delivery options
export const DELIVERY_OPTIONS = [
  {
    id: "standard",
    name: "Standard Delivery",
    days: "3-5",
    cost: 0,
    startDate: 3,
    endDate: 5,
  },
  {
    id: "express",
    name: "Express Delivery",
    days: "1-2",
    cost: 99,
    startDate: 1,
    endDate: 2,
  },
  {
    id: "overnight",
    name: "Overnight Delivery",
    days: "Next day",
    cost: 299,
    startDate: 1,
    endDate: 1,
  },
];

// Payment methods
export const PAYMENT_METHODS = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay using any UPI app",
    icon: "upi",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Visa, MasterCard, RuPay",
    icon: "visa",
  },
  {
    id: "gpay",
    name: "Google Pay",
    description: "Pay with Google Pay",
    icon: "gpay",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    description: "Pay with PhonePe",
    icon: "phonepe",
  },
  {
    id: "paytm",
    name: "Paytm",
    description: "Pay with Paytm",
    icon: "paytm",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "All major banks",
    icon: "bank",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive",
    icon: "cash",
  },
];

// States for address
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Checkout steps
export const CHECKOUT_STEPS = [
  { step: 1, label: "Cart", id: "cart" },
  { step: 2, label: "Shipping", id: "shipping" },
  { step: 3, label: "Payment", id: "payment" },
  { step: 4, label: "Confirmation", id: "confirmation" },
];
