// Coupon codes
export const COUPONS = [
  { code: "WELCOME10", discount: 5, description: "Welcome discount" },
  { code: "SAVE20", discount: 10, description: "Save 20% off" },
  { code: "FREESHIP", discount: 0, shippingDiscount: true, description: "Free shipping" },
  { code: "SUMMER30", discount: 15, description: "Summer special 30% off" },
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
    cost: 49,
    startDate: 1,
    endDate: 1,
  },
];

// Payment methods
export const PAYMENT_METHODS = [
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Visa, MasterCard, American Express",
    icon: "card",
  },
  {
    id: "gpay",
    name: "Google Pay",
    description: "Pay with Google Pay",
    icon: "google-pay",
  },
  {
    id: "apple",
    name: "Apple Pay",
    description: "Pay with Apple Pay",
    icon: "apple-pay",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with PayPal",
    icon: "paypal",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Direct bank transfer",
    icon: "net banking",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive",
    icon: "cod",
  },
];

// States for address
export const INDIAN_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

// Checkout steps
export const CHECKOUT_STEPS = [
  { step: 1, label: "Cart", id: "cart" },
  { step: 2, label: "Shipping", id: "shipping" },
  { step: 3, label: "Payment", id: "payment" },
  { step: 4, label: "Confirmation", id: "confirmation" },
];
