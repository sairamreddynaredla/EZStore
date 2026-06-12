import oxbowImg from "../../assets/products/rabbit/oxbow-essentials-adult-rabbit-food.jpg";
import kayteeImg from "../../assets/products/rabbit/kaytee-fortidiet-pro-health-rabbit-food.jpg";
import burgessImg from "../../assets/products/rabbit/burgess-excel-adult-rabbit-nuggets.jpg";
import vitakraftImg from "../../assets/products/rabbit/vitakraft-vita-smart-rabbit-food.jpg";
import scienceSelectiveImg from "../../assets/products/rabbit/supreme-science-selective-rabbit-food.jpg";
import mazuriImg from "../../assets/products/rabbit/mazuri-timothy-based-rabbit-diet.jpg";

export const rabbitFood = [
{
  id: 2200,
  name: "Oxbow Essentials Adult Rabbit Food",
  brand: "Oxbow",
  category: "rabbit-food",
  subCategory: "pellets",
  pet: "Rabbit",
  petType: "Rabbit",
  productCategory: "Rabbit Food",
  productType: "Pellet Food",
  flavor: "Timothy Hay",
  lifeStage: "Adult",
  specialDiet: "High Fiber",
  vegType: "Veg",

  rating: 4.9,
  reviews: 245,
  soldCount: 1120,
  stock: 48,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: oxbowImg,

  images: [
    oxbowImg,
    oxbowImg,
    oxbowImg,
    oxbowImg,
  ],

  description:
    "Premium Timothy hay-based rabbit food formulated for adult rabbits.",

  ingredients: [
    "Timothy Hay",
    "Soybean Meal",
    "Wheat",
    "Flaxseed",
    "Vitamins",
  ],

  features: [
    "High fiber",
    "Supports digestion",
    "Healthy weight maintenance",
    "Complete nutrition",
  ],

  nutrition: {
    protein: "14%",
    fat: "2%",
    fiber: "25%",
    moisture: "10%",
  },

  manufacturer: "Oxbow",
  country: "USA",

  weight: ["1kg", "2.25kg"],

  variants: [
    {
      weight: "1kg",
      price: 12.99,
      originalPrice: 15.99,
    },
    {
      weight: "2.25kg",
      price: 24.99,
      originalPrice: 29.99,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [2201, 2202, 2203],
},

{
  id: 2201,
  name: "Kaytee Forti-Diet Pro Health Rabbit Food",
  brand: "Kaytee",
  category: "rabbit-food",
  subCategory: "pellets",
  pet: "Rabbit",
  petType: "Rabbit",
  productCategory: "Rabbit Food",
  productType: "Pellet Food",
  flavor: "Vegetable Blend",
  lifeStage: "Adult",
  specialDiet: "Daily Nutrition",
  vegType: "Veg",

  rating: 4.8,
  reviews: 198,
  soldCount: 930,
  stock: 42,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: kayteeImg,

  images: [
    kayteeImg,
    kayteeImg,
    kayteeImg,
    kayteeImg,
  ],

  description:
    "Balanced daily rabbit food enriched with probiotics and nutrients.",

  ingredients: [
    "Alfalfa Meal",
    "Timothy Hay",
    "Carrots",
    "Soybean Meal",
    "Vitamins",
  ],

  features: [
    "Supports digestive health",
    "Rich in nutrients",
    "Daily feeding formula",
    "Highly palatable",
  ],

  nutrition: {
    protein: "15%",
    fat: "3%",
    fiber: "22%",
    moisture: "10%",
  },

  manufacturer: "Kaytee",
  country: "USA",

  weight: ["1kg", "2kg"],

  variants: [
    {
      weight: "1kg",
      price: 10.99,
      originalPrice: 13.99,
    },
    {
      weight: "2kg",
      price: 19.99,
      originalPrice: 24.99,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [2200, 2202, 2204],
},

{
  id: 2202,
  name: "Burgess Excel Adult Rabbit Nuggets",
  brand: "Burgess",
  category: "rabbit-food",
  subCategory: "nuggets",
  pet: "Rabbit",
  petType: "Rabbit",
  productCategory: "Rabbit Food",
  productType: "Nuggets",
  flavor: "Mint",
  lifeStage: "Adult",
  specialDiet: "High Fiber",
  vegType: "Veg",

  rating: 4.8,
  reviews: 176,
  soldCount: 785,
  stock: 40,

  fastDelivery: true,
  isNew: true,
  deliveryDate: "Tomorrow",

  image: burgessImg,

  images: [
    burgessImg,
    burgessImg,
    burgessImg,
    burgessImg,
  ],

  description:
    "Fiber-rich rabbit nuggets with mint for healthy digestion.",

  ingredients: [
    "Grass",
    "Mint",
    "Timothy Hay",
    "Peas",
    "Vitamins",
  ],

  features: [
    "High fiber",
    "Supports dental health",
    "Prebiotics included",
    "Healthy digestion",
  ],

  nutrition: {
    protein: "13%",
    fat: "4%",
    fiber: "39%",
    moisture: "10%",
  },

  manufacturer: "Burgess",
  country: "UK",

  weight: ["1.5kg", "3kg"],

  variants: [
    {
      weight: "1.5kg",
      price: 14.99,
      originalPrice: 18.99,
    },
    {
      weight: "3kg",
      price: 26.99,
      originalPrice: 31.99,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [2200, 2201, 2205],
},

{
  id: 2203,
  name: "Vitakraft Vita Smart Rabbit Food",
  brand: "Vitakraft",
  category: "rabbit-food",
  subCategory: "premium-mix",
  pet: "Rabbit",
  petType: "Rabbit",
  productCategory: "Rabbit Food",
  productType: "Food Mix",
  flavor: "Vegetable Mix",
  lifeStage: "Adult",
  specialDiet: "Natural Nutrition",
  vegType: "Veg",

  rating: 4.7,
  reviews: 142,
  soldCount: 602,
  stock: 35,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: vitakraftImg,

  images: [
    vitakraftImg,
    vitakraftImg,
    vitakraftImg,
    vitakraftImg,
  ],

  description:
    "Complete rabbit food blend with vegetables, grains and hay.",

  ingredients: [
    "Timothy Hay",
    "Carrots",
    "Peas",
    "Corn",
    "Vitamins",
  ],

  features: [
    "Natural ingredients",
    "No artificial colors",
    "Supports immunity",
    "Balanced nutrition",
  ],

  nutrition: {
    protein: "14%",
    fat: "3%",
    fiber: "20%",
    moisture: "10%",
  },

  manufacturer: "Vitakraft",
  country: "Germany",

  weight: ["900g", "1.8kg"],

  variants: [
    {
      weight: "900g",
      price: 11.99,
      originalPrice: 14.99,
    },
    {
      weight: "1.8kg",
      price: 20.99,
      originalPrice: 25.99,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [2200, 2204, 2205],
},

{
  id: 2204,
  name: "Supreme Science Selective Rabbit Food",
  brand: "Supreme",
  category: "rabbit-food",
  subCategory: "science-selective",
  pet: "Rabbit",
  petType: "Rabbit",
  productCategory: "Rabbit Food",
  productType: "Pellet Food",
  flavor: "Timothy Hay",
  lifeStage: "Adult",
  specialDiet: "Veterinary Recommended",
  vegType: "Veg",

  rating: 4.9,
  reviews: 233,
  soldCount: 945,
  stock: 39,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: scienceSelectiveImg,

  images: [
    scienceSelectiveImg,
    scienceSelectiveImg,
    scienceSelectiveImg,
    scienceSelectiveImg,
  ],

  description:
    "Veterinarian-recommended rabbit pellets for complete nutrition.",

  ingredients: [
    "Timothy Hay",
    "Soybean Hulls",
    "Linseed",
    "Grass Meal",
    "Vitamins",
  ],

  features: [
    "Vet recommended",
    "Supports digestion",
    "Healthy coat",
    "Balanced nutrition",
  ],

  nutrition: {
    protein: "14%",
    fat: "4%",
    fiber: "25%",
    moisture: "10%",
  },

  manufacturer: "Supreme Petfoods",
  country: "UK",

  weight: ["1.5kg", "3kg"],

  variants: [
    {
      weight: "1.5kg",
      price: 15.99,
      originalPrice: 19.99,
    },
    {
      weight: "3kg",
      price: 28.99,
      originalPrice: 34.99,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [2201, 2202, 2205],
},

{
  id: 2205,
  name: "Mazuri Timothy Based Rabbit Diet",
  brand: "Mazuri",
  category: "rabbit-food",
  subCategory: "timothy-based",
  pet: "Rabbit",
  petType: "Rabbit",
  productCategory: "Rabbit Food",
  productType: "Pellet Food",
  flavor: "Timothy Hay",
  lifeStage: "Adult",
  specialDiet: "High Fiber",
  vegType: "Veg",

  rating: 4.8,
  reviews: 188,
  soldCount: 710,
  stock: 37,

  fastDelivery: true,
  isNew: true,
  deliveryDate: "Tomorrow",

  image: mazuriImg,

  images: [
    mazuriImg,
    mazuriImg,
    mazuriImg,
    mazuriImg,
  ],

  description:
    "Timothy hay-based complete rabbit diet with high fiber content.",

  ingredients: [
    "Timothy Hay",
    "Soybean Meal",
    "Wheat Middlings",
    "Flaxseed",
    "Vitamins",
  ],

  features: [
    "High fiber formula",
    "Supports digestion",
    "Healthy teeth",
    "Complete nutrition",
  ],

  nutrition: {
    protein: "14%",
    fat: "3%",
    fiber: "26%",
    moisture: "10%",
  },

  manufacturer: "Mazuri",
  country: "USA",

  weight: ["1kg", "2.5kg"],

  variants: [
    {
      weight: "1kg",
      price: 13.99,
      originalPrice: 16.99,
    },
    {
      weight: "2.5kg",
      price: 25.99,
      originalPrice: 30.99,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [2200, 2203, 2204],
},
];