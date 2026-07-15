import tetraImg from "../../assets/products/fish/tetra-tetramin-tropical-flakes-fish-food.webp";
import hikariImg from "../../assets/products/fish/hikari-tropical-micro-pellets-fish-food.webp";
import omegaOneImg from "../../assets/products/fish/omega-one-super-color-flakes-fish-food.webp";
import fluvalImg from "../../assets/products/fish/fluval-bug-bites-tropical-formula-fish-food.webp";
import seraImg from "../../assets/products/fish/sera-vipan-nature-tropical-fish-food.webp";
import apiImg from "../../assets/products/fish/api-tropical-pellets-fish-food.webp";

export const fishFood = [
  {
    id: 2101,
    name: "Tetra TetraMin Tropical Flakes Fish Food",
    brand: "Tetra",
    category: "fish-food",
    subCategory: "flakes",
    pet: "Fish",
    petType: "Fish",
    productCategory: "Fish Food",
    productType: "Flake Food",
    flavor: "Seafood",
    lifeStage: "All Life Stages",
    specialDiet: "Daily Nutrition",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 185,
    soldCount: 760,
    stock: 42,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: tetraImg,

    images: [tetraImg, tetraImg, tetraImg, tetraImg],

    description: "Complete daily nutrition flake food suitable for most tropical fish species.",

    ingredients: ["Fish Meal", "Shrimp Meal", "Seaweed", "Vitamins", "Minerals"],

    features: ["Easy digestion", "Color enhancement", "Balanced nutrition", "Daily feeding"],

    nutrition: {
      protein: "47%",
      fat: "10%",
      fiber: "2%",
      moisture: "8%",
    },

    manufacturer: "Tetra",
    country: "Germany",

    weight: ["0.1lb", "0.4lb"],

    variants: [
      {
        weight: "0.1lb",
        price: 5.99,
        originalPrice: 7.99,
      },
      {
        weight: "0.4lb",
        price: 15.99,
        originalPrice: 19.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2102, 2103, 2104],
  },

  {
    id: 2102,
    name: "Hikari Tropical Micro Pellets Fish Food",
    brand: "Hikari",
    category: "fish-food",
    subCategory: "micro-pellets",
    pet: "Fish",
    petType: "Fish",
    productCategory: "Fish Food",
    productType: "Pellet Food",
    flavor: "Seafood",
    lifeStage: "All Life Stages",
    specialDiet: "High Protein",
    vegType: "Non-Veg",

    rating: 4.9,
    reviews: 223,
    soldCount: 895,
    stock: 38,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: hikariImg,

    images: [hikariImg, hikariImg, hikariImg, hikariImg],

    description: "Premium micro pellets designed for tropical fish with superior digestibility.",

    ingredients: ["Fish Meal", "Krill Meal", "Spirulina", "Wheat Flour", "Vitamins"],

    features: ["High protein formula", "Easy digestion", "Promotes growth", "Water stable pellets"],

    nutrition: {
      protein: "48%",
      fat: "9%",
      fiber: "2%",
      moisture: "10%",
    },

    manufacturer: "Hikari",
    country: "Japan",

    weight: ["0.1lb", "0.2lb"],

    variants: [
      {
        weight: "0.1lb",
        price: 6.99,
        originalPrice: 8.99,
      },
      {
        weight: "0.2lb",
        price: 14.99,
        originalPrice: 18.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2101, 2103, 2104],
  },
  {
    id: 2103,
    name: "Omega One Super Color Flakes Fish Food",
    brand: "Omega One",
    category: "fish-food",
    subCategory: "color-enhancing-flakes",
    pet: "Fish",
    petType: "Fish",
    productCategory: "Fish Food",
    productType: "Flake Food",
    flavor: "Salmon",
    lifeStage: "All Life Stages",
    specialDiet: "Color Enhancement",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 198,
    soldCount: 712,
    stock: 41,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: omegaOneImg,

    images: [omegaOneImg, omegaOneImg, omegaOneImg, omegaOneImg],

    description: "Natural salmon-based flakes formulated to improve fish coloration and vitality.",

    ingredients: ["Whole Salmon", "Whole Herring", "Kelp", "Spirulina", "Vitamins"],

    features: [
      "Enhances natural colors",
      "Rich in Omega fatty acids",
      "Highly palatable",
      "Premium ingredients",
    ],

    nutrition: {
      protein: "42%",
      fat: "12%",
      fiber: "2%",
      moisture: "8%",
    },

    manufacturer: "Omega One",
    country: "USA",

    weight: ["0.1lb", "0.3lb"],

    variants: [
      {
        weight: "0.1lb",
        price: 7.99,
        originalPrice: 9.99,
      },
      {
        weight: "0.3lb",
        price: 18.99,
        originalPrice: 22.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2101, 2102, 2105],
  },

  {
    id: 2104,
    name: "Fluval Bug Bites Tropical Formula Fish Food",
    brand: "Fluval",
    category: "fish-food",
    subCategory: "insect-protein",
    pet: "Fish",
    petType: "Fish",
    productCategory: "Fish Food",
    productType: "Granules",
    flavor: "Insect Protein",
    lifeStage: "All Life Stages",
    specialDiet: "High Protein",
    vegType: "Non-Veg",

    rating: 4.9,
    reviews: 276,
    soldCount: 1032,
    stock: 52,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: fluvalImg,

    images: [fluvalImg, fluvalImg, fluvalImg, fluvalImg],

    description: "Insect-based tropical fish food inspired by the natural diet of wild fish.",

    ingredients: ["Black Soldier Fly Larvae", "Salmon", "Fish Protein", "Peas", "Vitamins"],

    features: ["Insect protein source", "Supports growth", "Highly digestible", "Natural formula"],

    nutrition: {
      protein: "45%",
      fat: "12%",
      fiber: "5%",
      moisture: "10%",
    },

    manufacturer: "Fluval",
    country: "Canada",

    weight: ["0.1lb", "0.2lb"],

    variants: [
      {
        weight: "0.1lb",
        price: 8.99,
        originalPrice: 10.99,
      },
      {
        weight: "0.2lb",
        price: 17.99,
        originalPrice: 21.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2101, 2102, 2106],
  },

  {
    id: 2105,
    name: "Sera Vipan Nature Tropical Fish Food",
    brand: "Sera",
    category: "fish-food",
    subCategory: "tropical-flakes",
    pet: "Fish",
    petType: "Fish",
    productCategory: "Fish Food",
    productType: "Flake Food",
    flavor: "Natural Blend",
    lifeStage: "All Life Stages",
    specialDiet: "Natural Nutrition",
    vegType: "Non-Veg",

    rating: 4.7,
    reviews: 154,
    soldCount: 563,
    stock: 44,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: seraImg,

    images: [seraImg, seraImg, seraImg, seraImg],

    description: "Natural tropical fish flakes without artificial colors or preservatives.",

    ingredients: ["Fish Protein", "Krill", "Herbs", "Sea Algae", "Vitamins"],

    features: [
      "Natural ingredients",
      "No preservatives",
      "Supports immunity",
      "Daily feeding formula",
    ],

    nutrition: {
      protein: "46%",
      fat: "8%",
      fiber: "3%",
      moisture: "7%",
    },

    manufacturer: "Sera",
    country: "Germany",

    weight: ["0.1lb", "0.4lb"],

    variants: [
      {
        weight: "0.1lb",
        price: 6.49,
        originalPrice: 8.49,
      },
      {
        weight: "0.4lb",
        price: 16.49,
        originalPrice: 20.49,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2101, 2103, 2106],
  },

  {
    id: 2106,
    name: "API Tropical Pellets Fish Food",
    brand: "API",
    category: "fish-food",
    subCategory: "pellets",
    pet: "Fish",
    petType: "Fish",
    productCategory: "Fish Food",
    productType: "Pellet Food",
    flavor: "Seafood",
    lifeStage: "All Life Stages",
    specialDiet: "Clean Water Formula",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 187,
    soldCount: 694,
    stock: 36,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: apiImg,

    images: [apiImg, apiImg, apiImg, apiImg],

    description:
      "Nutrient-rich tropical pellets designed to reduce waste and maintain water quality.",

    ingredients: ["Fish Meal", "Shrimp Meal", "Seaweed", "Yeast", "Vitamins"],

    features: ["Clean water formula", "Slow sinking pellets", "Supports growth", "Easy digestion"],

    nutrition: {
      protein: "44%",
      fat: "8%",
      fiber: "4%",
      moisture: "10%",
    },

    manufacturer: "API",
    country: "USA",

    weight: ["0.1lb", "0.4lb"],

    variants: [
      {
        weight: "0.1lb",
        price: 5.99,
        originalPrice: 7.99,
      },
      {
        weight: "0.4lb",
        price: 14.99,
        originalPrice: 18.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2102, 2104, 2105],
  },
];
