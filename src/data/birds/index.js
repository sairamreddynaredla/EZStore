// ==========================================
// src/data/birds/food/birdsFood.js
// ==========================================

import verseleLagaImg from "../../assets/products/birds/versele-laga-prestige-budgies-bird-food.webp";
import kayteeImg from "../../assets/products/birds/kaytee-forti-diet-pro-health-parakeet-food.webp";
import zupreemImg from "../../assets/products/birds/zu-preem-fruitblend-small-bird-food.webp";
import vitapolImg from "../../assets/products/birds/vitapol-economy-parrot-food.webp";
import wildHarvestImg from "../../assets/products/birds/wild-harvest-daily-blend-parakeet-food.webp";
import higginsImg from "../../assets/products/birds/higgins-sunburst-gourmet-parrot-food.webp";

export const birdsFood = [
  {
    id: 2001,
    name: "Versele-Laga Prestige Budgies Bird Food",
    brand: "Versele-Laga",
    category: "birds-food",
    subCategory: "seed-mix",
    pet: "Bird",
    petType: "Bird",
    productCategory: "Bird Food",
    productType: "Seed Mix",
    flavor: "Mixed Seeds",
    lifeStage: "Adult",
    specialDiet: "Daily Nutrition",
    vegType: "Veg",

    rating: 4.8,
    reviews: 185,
    soldCount: 721,
    stock: 45,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: verseleLagaImg,

    images: [verseleLagaImg, verseleLagaImg, verseleLagaImg, verseleLagaImg],

    description:
      "Premium seed blend specially formulated for budgies with essential nutrients and vitamins.",

    ingredients: ["Canary Seed", "Millet", "Oats", "Flaxseed", "Vitamins"],

    features: [
      "Balanced nutrition",
      "Supports feather health",
      "High-quality seeds",
      "Suitable for budgies",
    ],

    nutrition: {
      protein: "13%",
      fat: "6%",
      fiber: "8%",
      moisture: "10%",
    },

    manufacturer: "Versele-Laga",
    country: "Belgium",

    weight: ["2lb", "8lb"],

    variants: [
      {
        weight: "2lb",
        price: 8.99,
        originalPrice: 10.99,
      },
      {
        weight: "8lb",
        price: 29.99,
        originalPrice: 35.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2002, 2003, 2004],
  },

  {
    id: 2002,
    name: "Kaytee Forti-Diet Pro Health Parakeet Food",
    brand: "Kaytee",
    category: "birds-food",
    subCategory: "pellets-seeds",
    pet: "Bird",
    petType: "Bird",
    productCategory: "Bird Food",
    productType: "Parakeet Food",
    flavor: "Seed Blend",
    lifeStage: "Adult",
    specialDiet: "Fortified",
    vegType: "Veg",

    rating: 4.7,
    reviews: 162,
    soldCount: 604,
    stock: 38,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: kayteeImg,

    images: [kayteeImg, kayteeImg, kayteeImg, kayteeImg],

    description: "Fortified daily nutrition food for parakeets with probiotics and natural grains.",

    ingredients: ["Millet", "Canary Seed", "Corn", "Oat Groats", "Probiotics"],

    features: ["Supports digestion", "Fortified formula", "Natural ingredients", "Daily feeding"],

    nutrition: {
      protein: "14%",
      fat: "5%",
      fiber: "7%",
      moisture: "10%",
    },

    manufacturer: "Kaytee",
    country: "USA",

    weight: ["1.8lb", "4.5lb"],

    variants: [
      {
        weight: "1.8lb",
        price: 7.99,
        originalPrice: 9.99,
      },
      {
        weight: "4.5lb",
        price: 18.99,
        originalPrice: 23.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2001, 2003, 2005],
  },

  {
    id: 2003,
    name: "ZuPreem FruitBlend Small Bird Food",
    brand: "ZuPreem",
    category: "birds-food",
    subCategory: "pellets",
    pet: "Bird",
    petType: "Bird",
    productCategory: "Bird Food",
    productType: "Pellets",
    flavor: "Fruit",
    lifeStage: "Adult",
    specialDiet: "Vitamin Enriched",
    vegType: "Veg",

    rating: 4.9,
    reviews: 245,
    soldCount: 912,
    stock: 41,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: zupreemImg,

    images: [zupreemImg, zupreemImg, zupreemImg, zupreemImg],

    description: "Colorful fruit-flavored pellets providing complete nutrition for small birds.",

    ingredients: ["Ground Corn", "Soybean Meal", "Fruit Flavor", "Vitamins", "Minerals"],

    features: ["Complete nutrition", "Fruit flavored", "No seed picking", "Supports immunity"],

    nutrition: {
      protein: "14%",
      fat: "4%",
      fiber: "3.5%",
      moisture: "10%",
    },

    manufacturer: "ZuPreem",
    country: "USA",

    weight: ["1lb", "3lb"],

    variants: [
      {
        weight: "1lb",
        price: 10.99,
        originalPrice: 13.99,
      },
      {
        weight: "3lb",
        price: 24.99,
        originalPrice: 29.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2001, 2002, 2004],
  },

  {
    id: 2004,
    name: "Vitapol Economy Parrot Food",
    brand: "Vitapol",
    category: "birds-food",
    subCategory: "parrot-food",
    pet: "Bird",
    petType: "Bird",
    productCategory: "Bird Food",
    productType: "Parrot Food",
    flavor: "Mixed Seeds",
    lifeStage: "Adult",
    specialDiet: "Daily Nutrition",
    vegType: "Veg",

    rating: 4.6,
    reviews: 118,
    soldCount: 402,
    stock: 35,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: vitapolImg,

    images: [vitapolImg, vitapolImg, vitapolImg, vitapolImg],

    description: "Nutritious parrot food blend containing grains, seeds and dried fruits.",

    ingredients: ["Sunflower Seeds", "Millet", "Corn", "Dried Fruits", "Grains"],

    features: ["Rich seed blend", "For parrots", "Healthy feathers", "Energy support"],

    nutrition: {
      protein: "12%",
      fat: "8%",
      fiber: "7%",
      moisture: "10%",
    },

    manufacturer: "Vitapol",
    country: "Poland",

    weight: ["1lb", "2lb"],

    variants: [
      {
        weight: "1lb",
        price: 5.99,
        originalPrice: 7.99,
      },
      {
        weight: "2lb",
        price: 10.99,
        originalPrice: 13.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2001, 2003, 2006],
  },

  {
    id: 2005,
    name: "Wild Harvest Daily Blend Parakeet Food",
    brand: "Wild Harvest",
    category: "birds-food",
    subCategory: "parakeet-food",
    pet: "Bird",
    petType: "Bird",
    productCategory: "Bird Food",
    productType: "Seed Mix",
    flavor: "Natural Blend",
    lifeStage: "Adult",
    specialDiet: "Daily Feed",
    vegType: "Veg",

    rating: 4.7,
    reviews: 173,
    soldCount: 641,
    stock: 48,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: wildHarvestImg,

    images: [wildHarvestImg, wildHarvestImg, wildHarvestImg, wildHarvestImg],

    description: "Wholesome daily blend of seeds and grains designed for parakeets.",

    ingredients: ["Millet", "Canary Seed", "Corn", "Oats", "Wheat"],

    features: ["Natural ingredients", "Daily nutrition", "Supports activity", "Healthy digestion"],

    nutrition: {
      protein: "13%",
      fat: "5%",
      fiber: "6%",
      moisture: "10%",
    },

    manufacturer: "Wild Harvest",
    country: "USA",

    weight: ["1.8lb", "3.6lb"],

    variants: [
      {
        weight: "1.8lb",
        price: 6.99,
        originalPrice: 8.99,
      },
      {
        weight: "3.6lb",
        price: 12.99,
        originalPrice: 16.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2002, 2003, 2006],
  },

  {
    id: 2006,
    name: "Higgins Sunburst Gourmet Parrot Food",
    brand: "Higgins",
    category: "birds-food",
    subCategory: "gourmet-parrot-food",
    pet: "Bird",
    petType: "Bird",
    productCategory: "Bird Food",
    productType: "Gourmet Food",
    flavor: "Fruit & Nut Mix",
    lifeStage: "Adult",
    specialDiet: "Premium",
    vegType: "Veg",

    rating: 4.9,
    reviews: 231,
    soldCount: 815,
    stock: 43,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: higginsImg,

    images: [higginsImg, higginsImg, higginsImg, higginsImg],

    description: "Premium gourmet blend with fruits, vegetables, nuts and seeds for parrots.",

    ingredients: ["Sunflower Seeds", "Papaya", "Pineapple", "Peanuts", "Vegetables"],

    features: ["Gourmet recipe", "Fruit enriched", "Premium nutrition", "Supports vitality"],

    nutrition: {
      protein: "14%",
      fat: "10%",
      fiber: "8%",
      moisture: "10%",
    },

    manufacturer: "Higgins",
    country: "USA",

    weight: ["1lb", "3lb"],

    variants: [
      {
        weight: "1lb",
        price: 11.99,
        originalPrice: 14.99,
      },
      {
        weight: "3lb",
        price: 27.99,
        originalPrice: 33.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [2003, 2004, 2005],
  },
];
