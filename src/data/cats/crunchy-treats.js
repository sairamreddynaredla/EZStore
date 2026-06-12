// ==========================================
// src/data/cats/treats/catCrunchyTreats.js
// ==========================================

import temptationsMixupsImg from "../../assets/products/cats/crunchy-treats/temptations-mixups-backyard-cookout-cat-treats.jpg";
import friskiesPartyMixImg from "../../assets/products/cats/crunchy-treats/friskies-party-mix-original-crunch-cat-treats.jpg";
import dreamiesCheeseImg from "../../assets/products/cats/crunchy-treats/dreamies-cheese-crunchy-cat-treats.jpg";
import meoCrunchyImg from "../../assets/products/cats/crunchy-treats/meo-crunchy-cat-treats-seafood-flavor.jpg";
import purepetCrunchyImg from "../../assets/products/cats/crunchy-treats/purepet-crunchy-cat-treats-ocean-fish-flavor.jpg";

export const catCrunchyTreats = [
  {
    id: 1301,
    name: "Temptations MixUps Backyard Cookout Cat Treats",
    brand: "Temptations",
    category: "cats-crunchy-treats",
    subCategory: "crunchy-treats",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Treats",
    productType: "Crunchy Treats",
    flavor: "Chicken, Liver & Beef",
    lifeStage: "Adult",
    specialDiet: "Daily Treat",
    vegType: "Non-Veg",

    rating: 4.9,
    reviews: 342,
    soldCount: 1254,
    stock: 48,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: temptationsMixupsImg,

    images: [
      temptationsMixupsImg,
      temptationsMixupsImg,
      temptationsMixupsImg,
      temptationsMixupsImg,
    ],

    description:
      "Crunchy outside and soft inside cat treats with multiple savory flavors.",

    ingredients: [
      "Chicken Meal",
      "Beef Meal",
      "Animal Fat",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Crunchy texture",
      "Soft center",
      "Highly palatable",
      "Great training reward",
    ],

    nutrition: {
      protein: "30%",
      fat: "20%",
      fiber: "4%",
      moisture: "12%",
    },

    manufacturer: "Mars Petcare",
    country: "USA",

    weight: ["60g", "180g"],

    variants: [
      { weight: "60g", price: 3.99, originalPrice: 5.49 },
      { weight: "180g", price: 8.99, originalPrice: 11.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1302, 1303, 1304],
  },

  {
    id: 1302,
    name: "Friskies Party Mix Original Crunch Cat Treats",
    brand: "Friskies",
    category: "cats-crunchy-treats",
    subCategory: "crunchy-treats",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Treats",
    productType: "Crunchy Treats",
    flavor: "Chicken & Turkey",
    lifeStage: "Adult",
    specialDiet: "Protein Rich",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 265,
    soldCount: 964,
    stock: 39,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: friskiesPartyMixImg,

    images: [
      friskiesPartyMixImg,
      friskiesPartyMixImg,
      friskiesPartyMixImg,
      friskiesPartyMixImg,
    ],

    description:
      "Crunchy party mix cat treats packed with delicious chicken and turkey flavors.",

    ingredients: [
      "Chicken",
      "Turkey",
      "Corn",
      "Animal Fat",
      "Minerals",
    ],

    features: [
      "Crunchy bites",
      "Irresistible flavor",
      "Perfect reward",
      "Supports active cats",
    ],

    nutrition: {
      protein: "28%",
      fat: "18%",
      fiber: "4%",
      moisture: "10%",
    },

    manufacturer: "Purina",
    country: "USA",

    weight: ["57g", "170g"],

    variants: [
      { weight: "57g", price: 3.49, originalPrice: 4.99 },
      { weight: "170g", price: 8.49, originalPrice: 10.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1301, 1303, 1305],
  },

  {
    id: 1303,
    name: "Dreamies Cheese Crunchy Cat Treats",
    brand: "Dreamies",
    category: "cats-crunchy-treats",
    subCategory: "crunchy-treats",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Treats",
    productType: "Crunchy Treats",
    flavor: "Cheese",
    lifeStage: "Adult",
    specialDiet: "Daily Treat",
    vegType: "Veg",

    rating: 4.7,
    reviews: 221,
    soldCount: 786,
    stock: 42,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: dreamiesCheeseImg,

    images: [
      dreamiesCheeseImg,
      dreamiesCheeseImg,
      dreamiesCheeseImg,
      dreamiesCheeseImg,
    ],

    description:
      "Crunchy cheese flavored cat treats with a delicious soft center.",

    ingredients: [
      "Cheese",
      "Cereals",
      "Oils",
      "Minerals",
      "Vitamins",
    ],

    features: [
      "Crunchy outside",
      "Soft inside",
      "Cheese flavor",
      "Everyday snack",
    ],

    nutrition: {
      protein: "22%",
      fat: "20%",
      fiber: "2%",
      moisture: "8%",
    },

    manufacturer: "Mars Petcare",
    country: "UK",

    weight: ["60g", "180g"],

    variants: [
      { weight: "60g", price: 3.49, originalPrice: 4.99 },
      { weight: "180g", price: 8.99, originalPrice: 10.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1301, 1302, 1304],
  },

  {
    id: 1304,
    name: "Me-O Crunchy Cat Treats Seafood Flavor",
    brand: "Me-O",
    category: "cats-crunchy-treats",
    subCategory: "crunchy-treats",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Treats",
    productType: "Crunchy Treats",
    flavor: "Seafood",
    lifeStage: "Adult",
    specialDiet: "Omega Rich",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 188,
    soldCount: 692,
    stock: 54,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: meoCrunchyImg,

    images: [
      meoCrunchyImg,
      meoCrunchyImg,
      meoCrunchyImg,
      meoCrunchyImg,
    ],

    description:
      "Seafood flavored crunchy treats enriched with vitamins and taurine.",

    ingredients: [
      "Fish Meal",
      "Seafood Extract",
      "Taurine",
      "Minerals",
      "Vitamins",
    ],

    features: [
      "Contains taurine",
      "Crunchy texture",
      "Supports vision",
      "Healthy reward",
    ],

    nutrition: {
      protein: "30%",
      fat: "18%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Perfect Companion",
    country: "Thailand",

    weight: ["50g", "150g"],

    variants: [
      { weight: "50g", price: 2.99, originalPrice: 4.49 },
      { weight: "150g", price: 7.99, originalPrice: 9.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1301, 1303, 1305],
  },

  {
    id: 1305,
    name: "Purepet Crunchy Cat Treats Ocean Fish Flavor",
    brand: "Purepet",
    category: "cats-crunchy-treats",
    subCategory: "crunchy-treats",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Treats",
    productType: "Crunchy Treats",
    flavor: "Ocean Fish",
    lifeStage: "Adult",
    specialDiet: "Daily Treat",
    vegType: "Non-Veg",

    rating: 4.6,
    reviews: 156,
    soldCount: 534,
    stock: 45,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: purepetCrunchyImg,

    images: [
      purepetCrunchyImg,
      purepetCrunchyImg,
      purepetCrunchyImg,
      purepetCrunchyImg,
    ],

    description:
      "Crunchy ocean fish flavored treats designed for daily rewarding and snacking.",

    ingredients: [
      "Fish Meal",
      "Chicken Meal",
      "Animal Fat",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Ocean fish flavor",
      "Crunchy texture",
      "Daily treat",
      "Cat favorite",
    ],

    nutrition: {
      protein: "29%",
      fat: "18%",
      fiber: "4%",
      moisture: "10%",
    },

    manufacturer: "Purepet",
    country: "India",

    weight: ["35g", "140g"],

    variants: [
      { weight: "35g", price: 1.99, originalPrice: 3.49 },
      { weight: "140g", price: 6.99, originalPrice: 8.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1302, 1303, 1304],
  },
];