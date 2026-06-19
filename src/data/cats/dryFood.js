import royalCaninImg from "../../assets/products/cats/dry-food/royal-canin-indoor-adult-dry-cat-food.webp";
import hillsImg from "../../assets/products/cats/dry-food/hills-science-diet-adult-indoor-cat-food.webp";
import purinaImg from "../../assets/products/cats/dry-food/purina-pro-plan-complete-essentials-adult-cat-food.webp";
import meoImg from "../../assets/products/cats/dry-food/meo-adult-ocean-fish-dry-cat-food.webp";
import whiskasImg from "../../assets/products/cats/dry-food/whiskas-ocean-fish-adult-dry-cat-food.webp";

export const dryFood = [
  {
    id: 1401,
    name: "Royal Canin Indoor Adult Dry Cat Food",
    brand: "Royal Canin",
    category: "cats-dry-food",
    subCategory: "dry-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Dry Food",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Indoor Formula",
    vegType: "Non-Veg",

    rating: 4.9,
    reviews: 312,
    soldCount: 1240,
    stock: 42,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninImg,

    images: [royalCaninImg, royalCaninImg, royalCaninImg, royalCaninImg],

    description: "Complete and balanced nutrition specially formulated for indoor adult cats.",

    ingredients: ["Chicken Meal", "Rice", "Corn", "Fish Oil", "Vitamins", "Minerals"],

    features: ["Indoor cat formula", "Supports digestion", "Healthy coat", "Balanced nutrition"],

    nutrition: {
      protein: "27%",
      fat: "15%",
      fiber: "4%",
      moisture: "10%",
    },

    manufacturer: "Royal Canin",

    country: "France",

    weight: ["4lb", "8lb"],

    variants: [
      {
        weight: "4lb",
        price: 24.99,
        originalPrice: 29.99,
      },
      {
        weight: "8lb",
        price: 44.99,
        originalPrice: 54.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1402, 1403, 1404],
  },

  {
    id: 1402,
    name: "Hill's Science Diet Adult Indoor Cat Food",
    brand: "Hill's",
    category: "cats-dry-food",
    subCategory: "dry-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Dry Food",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Hairball Control",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 284,
    soldCount: 986,
    stock: 38,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: hillsImg,

    images: [hillsImg, hillsImg, hillsImg, hillsImg],

    description:
      "Indoor cat food with natural fibers to support healthy digestion and hairball control.",

    ingredients: ["Chicken", "Brown Rice", "Barley", "Fish Oil", "Vitamins", "Minerals"],

    features: ["Hairball control", "Healthy digestion", "Lean muscle support", "Omega fatty acids"],

    nutrition: {
      protein: "30%",
      fat: "16%",
      fiber: "5%",
      moisture: "10%",
    },

    manufacturer: "Hill's",

    country: "USA",

    weight: ["3lb", "6lb"],

    variants: [
      {
        weight: "3lb",
        price: 19.99,
        originalPrice: 24.99,
      },
      {
        weight: "6lb",
        price: 36.99,
        originalPrice: 44.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1401, 1403, 1405],
  },

  {
    id: 1403,
    name: "Purina Pro Plan Complete Essentials Adult Cat Food",
    brand: "Purina Pro Plan",
    category: "cats-dry-food",
    subCategory: "dry-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Dry Food",
    flavor: "Chicken & Rice",
    lifeStage: "Adult",
    specialDiet: "Digestive Care",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 341,
    soldCount: 1362,
    stock: 46,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: purinaImg,

    images: [purinaImg, purinaImg, purinaImg, purinaImg],

    description: "Premium dry cat food with probiotics for digestive and immune support.",

    ingredients: ["Chicken", "Rice", "Fish Meal", "Probiotics", "Vitamins", "Minerals"],

    features: ["Probiotic formula", "Immune support", "Healthy skin", "High protein nutrition"],

    nutrition: {
      protein: "36%",
      fat: "16%",
      fiber: "3%",
      moisture: "12%",
    },

    manufacturer: "Purina",

    country: "USA",

    weight: ["3lb", "6lb"],

    variants: [
      {
        weight: "3lb",
        price: 22.99,
        originalPrice: 27.99,
      },
      {
        weight: "6lb",
        price: 41.99,
        originalPrice: 49.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1401, 1402, 1404],
  },

  {
    id: 1404,
    name: "Me-O Adult Ocean Fish Dry Cat Food",
    brand: "Me-O",
    category: "cats-dry-food",
    subCategory: "dry-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Dry Food",
    flavor: "Ocean Fish",
    lifeStage: "Adult",
    specialDiet: "Daily Nutrition",
    vegType: "Non-Veg",

    rating: 4.7,
    reviews: 228,
    soldCount: 892,
    stock: 58,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: meoImg,

    images: [meoImg, meoImg, meoImg, meoImg],

    description: "Ocean fish recipe enriched with taurine for healthy vision and heart function.",

    ingredients: ["Fish Meal", "Rice", "Corn", "Taurine", "Vitamins", "Minerals"],

    features: ["Contains taurine", "Healthy eyesight", "Strong bones", "Crunchy kibble"],

    nutrition: {
      protein: "30%",
      fat: "18%",
      fiber: "4%",
      moisture: "10%",
    },

    manufacturer: "Perfect Companion",

    country: "Thailand",

    weight: ["2.4lb", "6lb"],

    variants: [
      {
        weight: "2.4lb",
        price: 11.99,
        originalPrice: 14.99,
      },
      {
        weight: "6lb",
        price: 24.99,
        originalPrice: 29.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1401, 1403, 1405],
  },
  // Sample product for Catmos (emerging)
  {
    id: 1490,
    name: "Catmos Ocean Salmon Adult Dry Cat Food",
    brand: "Catmos",
    category: "cats-dry-food",
    subCategory: "dry-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Dry Food",
    flavor: "Salmon",
    lifeStage: "Adult",
    vegType: "Non-Veg",

    rating: 4.5,
    reviews: 42,
    soldCount: 120,
    stock: 25,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: meoImg,

    images: [meoImg, meoImg],

    description: "Catmos premium salmon dry food for adult cats.",

    variants: [
      { weight: "2lb", price: 9.99, originalPrice: 12.99 },
      { weight: "4lb", price: 17.99, originalPrice: 22.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.05,

    relatedProducts: [1401, 1402],
  },

  // Sample product for Imaginelles (emerging)
  {
    id: 1491,
    name: "Imaginelles Tuna & Chicken Dry Cat Mix",
    brand: "Imaginelles",
    category: "cats-dry-food",
    subCategory: "dry-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Dry Food",
    flavor: "Tuna & Chicken",
    lifeStage: "Adult",

    rating: 4.3,
    reviews: 18,
    soldCount: 60,
    stock: 30,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: whiskasImg,
    images: [whiskasImg],

    description: "Imaginelles tasty dry mix to delight picky eaters.",

    variants: [{ weight: "2lb", price: 8.49, originalPrice: 10.49 }],

    subscriptionEligible: false,
    relatedProducts: [1402, 1403],
  },

  {
    id: 1405,
    name: "Whiskas Ocean Fish Adult Dry Cat Food",
    brand: "Whiskas",
    category: "cats-dry-food",
    subCategory: "dry-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Dry Food",
    flavor: "Ocean Fish",
    lifeStage: "Adult",
    specialDiet: "Daily Nutrition",
    vegType: "Non-Veg",

    rating: 4.7,
    reviews: 267,
    soldCount: 1114,
    stock: 52,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: whiskasImg,

    images: [whiskasImg, whiskasImg, whiskasImg, whiskasImg],

    description: "Complete and balanced dry food for adult cats with ocean fish flavor.",

    ingredients: ["Fish", "Chicken Meal", "Cereals", "Vitamins", "Minerals"],

    features: ["Healthy coat", "Strong muscles", "Crunchy texture", "Balanced diet"],

    nutrition: {
      protein: "32%",
      fat: "14%",
      fiber: "5%",
      moisture: "10%",
    },

    manufacturer: "Mars Petcare",

    country: "India",

    weight: ["2.4lb", "6lb"],

    variants: [
      {
        weight: "2.4lb",
        price: 9.99,
        originalPrice: 12.99,
      },
      {
        weight: "6lb",
        price: 21.99,
        originalPrice: 26.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1402, 1403, 1404],
  },
];

export default dryFood;
