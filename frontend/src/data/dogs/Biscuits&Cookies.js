// ==========================================
// src/data/dogs/treats/dogBiscuitsCookies.js
// ==========================================

import pedigreeBiscrokImg from "../../assets/products/dogs/biscuits-cookies/pedigree-biscrok-milk-biscuits.webp";
import droolsCalciumImg from "../../assets/products/dogs/biscuits-cookies/drools-absolute-calcium-bone-biscuits.webp";
import smartHeartBiscuitsImg from "../../assets/products/dogs/biscuits-cookies/smartheart-dog-biscuits-milk.webp";
import jerhighCookiesImg from "../../assets/products/dogs/biscuits-cookies/jerhigh-chicken-cookies.webp";
import goodiesBiscuitsImg from "../../assets/products/dogs/biscuits-cookies/goodies-energy-treat-biscuits.webp";

export const dogsBiscuitsCookies = [
  {
    id: 701,
    name: "Pedigree Biscrok Milk & Chicken Biscuits",
    brand: "Pedigree",
    category: "dogs-treats",
    subCategory: "biscuits-cookies",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Treats",
    productType: "Biscuits & Cookies",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Milk & Chicken",
    lifeStage: "Adult",
    specialDiet: "Regular",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 395,
    soldCount: 1250,
    stock: 84,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: pedigreeBiscrokImg,

    images: [pedigreeBiscrokImg, pedigreeBiscrokImg, pedigreeBiscrokImg, pedigreeBiscrokImg],

    description:
      "Crunchy Pedigree Biscrok biscuits with milk and chicken flavor that help reward dogs while supporting dental health.",

    ingredients: [
      "Cereals",
      "Chicken Meal",
      "Milk Solids",
      "Vegetable Oil",
      "Minerals",
      "Vitamins",
    ],

    features: [
      "Crunchy texture",
      "Supports dental hygiene",
      "Delicious milk flavor",
      "Ideal reward treat",
    ],

    nutrition: {
      protein: "15%",
      fat: "7%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Mars Petcare",
    country: "India",

    weight: ["1lb", "1.8lb"],

    variants: [
      {
        weight: "1lb",
        price: 4.99,
        originalPrice: 5.99,
      },
      {
        weight: "1.8lb",
        price: 8.49,
        originalPrice: 9.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.05,

    relatedProducts: [702, 703, 704],
  },

  {
    id: 702,
    name: "Drools Absolute Calcium Bone Biscuits",
    brand: "Drools",
    category: "dogs-treats",
    subCategory: "biscuits-cookies",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Treats",
    productType: "Biscuits & Cookies",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Milk",
    lifeStage: "Adult",
    specialDiet: "Calcium Rich",
    vegType: "Veg",
    size: "Medium",

    rating: 4.7,
    reviews: 242,
    soldCount: 830,
    stock: 61,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: droolsCalciumImg,

    images: [droolsCalciumImg, droolsCalciumImg, droolsCalciumImg, droolsCalciumImg],

    description:
      "Calcium-rich bone-shaped biscuits that help maintain strong bones and healthy teeth in dogs.",

    ingredients: ["Cereals", "Milk Solids", "Calcium", "Minerals", "Vitamins", "Vegetable Oil"],

    features: ["Bone health support", "Crunchy texture", "Calcium enriched", "Daily reward snack"],

    nutrition: {
      protein: "13%",
      fat: "5%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Drools Pet Food Pvt Ltd",
    country: "India",

    weight: ["0.6lb", "1.6lb"],

    variants: [
      {
        weight: "0.6lb",
        price: 3.49,
        originalPrice: 4.29,
      },
      {
        weight: "1.6lb",
        price: 7.49,
        originalPrice: 8.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.05,

    relatedProducts: [701, 703, 705],
  },

  {
    id: 703,
    name: "SmartHeart Milk Flavor Dog Biscuits",
    brand: "SmartHeart",
    category: "dogs-treats",
    subCategory: "biscuits-cookies",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Treats",
    productType: "Biscuits & Cookies",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Milk",
    lifeStage: "Adult",
    specialDiet: "Regular",
    vegType: "Veg",
    size: "Medium",

    rating: 4.6,
    reviews: 187,
    soldCount: 610,
    stock: 48,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: smartHeartBiscuitsImg,

    images: [
      smartHeartBiscuitsImg,
      smartHeartBiscuitsImg,
      smartHeartBiscuitsImg,
      smartHeartBiscuitsImg,
    ],

    description:
      "Nutritious milk-flavored biscuits designed to reward dogs while supporting everyday nutrition.",

    ingredients: [
      "Wheat Flour",
      "Milk Powder",
      "Vegetable Oil",
      "Minerals",
      "Vitamins",
      "Natural Flavor",
    ],

    features: ["Crunchy bite", "Milk flavor", "Healthy reward", "Vitamin fortified"],

    nutrition: {
      protein: "14%",
      fat: "6%",
      fiber: "2.5%",
      moisture: "10%",
    },

    manufacturer: "Perfect Companion Group",
    country: "Thailand",

    weight: ["0.8lb", "2lb"],

    variants: [
      {
        weight: "0.8lb",
        price: 4.49,
        originalPrice: 5.49,
      },
      {
        weight: "2lb",
        price: 8.99,
        originalPrice: 10.49,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.05,

    relatedProducts: [701, 702, 704],
  },

  {
    id: 704,
    name: "JerHigh Chicken Cookies Dog Treats",
    brand: "JerHigh",
    category: "dogs-treats",
    subCategory: "biscuits-cookies",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Treats",
    productType: "Biscuits & Cookies",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "High Protein",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 289,
    soldCount: 940,
    stock: 72,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: jerhighCookiesImg,

    images: [jerhighCookiesImg, jerhighCookiesImg, jerhighCookiesImg, jerhighCookiesImg],

    description:
      "Oven-baked chicken cookies packed with real chicken flavor and ideal as daily reward treats.",

    ingredients: [
      "Chicken Meat",
      "Wheat Flour",
      "Vegetable Protein",
      "Minerals",
      "Vitamins",
      "Natural Flavor",
    ],

    features: ["Made with chicken", "High palatability", "Crunchy texture", "Training reward"],

    nutrition: {
      protein: "18%",
      fat: "6%",
      fiber: "2%",
      moisture: "10%",
    },

    manufacturer: "Perfect Companion Group",
    country: "Thailand",

    weight: ["0.1lb", "0.3lb"],

    variants: [
      {
        weight: "0.1lb",
        price: 3.99,
        originalPrice: 4.99,
      },
      {
        weight: "0.3lb",
        price: 6.99,
        originalPrice: 8.49,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.05,

    relatedProducts: [701, 703, 705],
  },

  {
    id: 705,
    name: "Goodies Energy Treat Biscuits",
    brand: "Goodies",
    category: "dogs-treats",
    subCategory: "biscuits-cookies",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Treats",
    productType: "Biscuits & Cookies",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Chicken & Milk",
    lifeStage: "Adult",
    specialDiet: "Energy Support",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.5,
    reviews: 152,
    soldCount: 520,
    stock: 57,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: goodiesBiscuitsImg,

    images: [goodiesBiscuitsImg, goodiesBiscuitsImg, goodiesBiscuitsImg, goodiesBiscuitsImg],

    description:
      "Energy-packed crunchy biscuits enriched with vitamins and minerals for active dogs.",

    ingredients: [
      "Chicken Meal",
      "Milk Powder",
      "Cereals",
      "Minerals",
      "Vitamins",
      "Vegetable Oil",
    ],

    features: [
      "Energy boosting snack",
      "Crunchy texture",
      "Vitamin enriched",
      "Ideal daily reward",
    ],

    nutrition: {
      protein: "16%",
      fat: "7%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Goodies Pet Food",
    country: "India",

    weight: ["1lb", "2lb"],

    variants: [
      {
        weight: "1lb",
        price: 5.49,
        originalPrice: 6.49,
      },
      {
        weight: "2lb",
        price: 9.99,
        originalPrice: 11.49,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.05,

    relatedProducts: [701, 702, 704],
  },
];
