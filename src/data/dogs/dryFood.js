// dogsDryFood.js

import blueBuffaloImg from "../../assets/products/dogs/dry-food/blue-buffalo-wilderness-adult-grain-free-dry-dog-food.png.jpg";
import royalCaninImg from "../../assets/products/dogs/dry-food/royal-canin-maxi-adult-dry-dog-food.png.jpg";
import purinaImg from "../../assets/products/dogs/dry-food/purina-pro-plan-complete-essentials-adult-dry-dog-food.jpg";
import farminaImg from "../../assets/products/dogs/dry-food/farmina-nd-chicken-pomegranate-adult-medium-maxi-dry-dog-food.jpg";
import acanaImg from "../../assets/products/dogs/dry-food/acana-classics-red-meat-recipe-dry-dog-food.jpg";


export const dogsDryFood = [
  {
    id: 101,
    name: "Blue Buffalo Wilderness Adult Grain Free Dry Dog Food",
    brand: "Blue Buffalo",
    category: "dogs-dry-food",
    subCategory: "dry-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Dry Food",
    breedSize: "Large",
    shopByBreed: "Large",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Grain Free",
    vegType: "Non-Veg",
    size: "Large",

    rating: 4.7,
    reviews: 86,
    soldCount: 210,
    stock: 24,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: blueBuffaloImg,

    images: [
      blueBuffaloImg,
      blueBuffaloImg,
      blueBuffaloImg,
      blueBuffaloImg,
    ],

    description:
      "Blue Buffalo Wilderness Adult is a grain-free, high-protein dry dog food designed to support strong muscles and steady energy for adult dogs.",

    ingredients: [
      "Chicken",
      "Pea Protein",
      "Peas",
      "Potatoes",
      "Canola Oil",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "High protein from real chicken",
      "Grain-free recipe",
      "Supports healthy muscle development",
      "Rich in antioxidants",
    ],

    nutrition: {
      protein: "32%",
      fat: "18%",
      fiber: "5%",
      moisture: "10%",
    },

    manufacturer: "Blue Buffalo",

    country: "USA",

    weight: ["4lb", "12lb", "24lb"],

    variants: [
      {
        weight: "4lb",
        price: 21.99,
        originalPrice: 29.99,
      },
      {
        weight: "12lb",
        price: 54.99,
        originalPrice: 69.99,
      },
      {
        weight: "24lb",
        price: 94.99,
        originalPrice: 119.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.10,

    relatedProducts: [102, 103, 104],
  },

  {
    id: 102,
    name: "Royal Canin Maxi Adult Dry Dog Food",
    brand: "Royal Canin",
    category: "dogs-dry-food",
    subCategory: "dry-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Dry Food",
    breedSize: "Large",
    shopByBreed: "Large",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "High Protein",
    vegType: "Non-Veg",
    size: "Large",

    rating: 4.8,
    reviews: 142,
    soldCount: 428,
    stock: 18,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninImg,

    images: [
      royalCaninImg,
      royalCaninImg,
      royalCaninImg,
      royalCaninImg,
    ],

    description:
      "Complete and balanced nutrition specially formulated for large breed adult dogs.",

    ingredients: [
      "Chicken Meal",
      "Rice",
      "Corn",
      "Animal Fat",
      "Fish Oil",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Supports healthy digestion",
      "Strong bone support",
      "Healthy skin",
      "Ideal weight maintenance",
    ],

    nutrition: {
      protein: "26%",
      fat: "17%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Royal Canin",

    country: "France",

    weight: ["4lb", "15lb", "30lb"],

    variants: [
      {
        weight: "4lb",
        price: 24.99,
        originalPrice: 32.99,
      },
      {
        weight: "15lb",
        price: 64.99,
        originalPrice: 79.99,
      },
      {
        weight: "30lb",
        price: 109.99,
        originalPrice: 129.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.10,

    relatedProducts: [103, 104, 105],
  },

  {
    id: 103,
    name: "Purina Pro Plan Complete Essentials Adult Dry Dog Food",
    brand: "Purina Pro Plan",
    category: "dogs-dry-food",
    subCategory: "dry-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Dry Food",
    breedSize: "All",
    shopByBreed: "All",
    flavor: "Chicken & Rice",
    lifeStage: "Adult",
    specialDiet: "Digestive Care",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 196,
    soldCount: 542,
    stock: 31,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: purinaImg,

    images: [
      purinaImg,
      purinaImg,
      purinaImg,
      purinaImg,
    ],

    description:
      "Premium adult dry dog food with probiotics for digestive and immune health.",

    ingredients: [
      "Chicken",
      "Rice",
      "Poultry By Product Meal",
      "Fish Meal",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Fortified probiotics",
      "High-quality protein",
      "Supports immunity",
      "Healthy coat",
    ],

    nutrition: {
      protein: "27%",
      fat: "17%",
      fiber: "3%",
      moisture: "12%",
    },

    manufacturer: "Purina",

    country: "USA",

    weight: ["6lb", "18lb", "35lb"],

    variants: [
      {
        weight: "6lb",
        price: 28.99,
        originalPrice: 35.99,
      },
      {
        weight: "18lb",
        price: 62.99,
        originalPrice: 74.99,
      },
      {
        weight: "35lb",
        price: 99.99,
        originalPrice: 119.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.10,

    relatedProducts: [101, 104, 106],
  },

  {
    id: 104,
    name: "Farmina N&D Chicken & Pomegranate Adult Medium Maxi Dry Dog Food",
    brand: "Farmina",
    category: "dogs-dry-food",
    subCategory: "dry-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Dry Food",
    breedSize: "Medium",
    shopByBreed: "Medium",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Natural",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.9,
    reviews: 118,
    soldCount: 304,
    stock: 16,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: farminaImg,

    images: [
      farminaImg,
      farminaImg,
      farminaImg,
      farminaImg,
    ],

    description:
      "Natural low-grain nutrition with chicken and pomegranate for healthy growth and vitality.",

    ingredients: [
      "Chicken",
      "Dehydrated Chicken",
      "Pomegranate",
      "Sweet Potato",
      "Fish Oil",
      "Vitamins",
    ],

    features: [
      "Natural ingredients",
      "Low glycemic formula",
      "Rich antioxidants",
      "Supports digestion",
    ],

    nutrition: {
      protein: "30%",
      fat: "18%",
      fiber: "2.9%",
      moisture: "9%",
    },

    manufacturer: "Farmina",

    country: "Italy",

    weight: ["2.5kg", "7kg", "12kg"],

    variants: [
      {
        weight: "2.5kg",
        price: 34.99,
        originalPrice: 42.99,
      },
      {
        weight: "7kg",
        price: 74.99,
        originalPrice: 89.99,
      },
      {
        weight: "12kg",
        price: 114.99,
        originalPrice: 129.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.10,

    relatedProducts: [103, 104, 105],
  },

  { 
    id: 105,
    name: "Acana Classics Red Meat Recipe Dry Dog Food",
    brand: "Acana",
    category: "dogs-dry-food",
    subCategory: "dry-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Dry Food",
    breedSize: "All",
    shopByBreed: "All",
    flavor: "Red Meat",
    lifeStage: "Adult",
    specialDiet: "High Protein",
    vegType: "Non-Veg",
    size: "Large",

    rating: 4.8,
    reviews: 94,
    soldCount: 266,
    stock: 22,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: acanaImg,

    images: [
      acanaImg,
      acanaImg,
      acanaImg,
      acanaImg,
    ],

    description:
      "Protein-rich recipe made with beef, pork and lamb to support lean muscle and overall health.",

    ingredients: [
      "Beef",
      "Pork",
      "Lamb",
      "Pumpkin",
      "Lentils",
      "Vitamins",
    ],

    features: [
      "Protein rich formula",
      "Supports lean muscles",
      "Healthy digestion",
      "Natural ingredients",
    ],

    nutrition: {
      protein: "29%",
      fat: "17%",
      fiber: "5%",
      moisture: "12%",
    },

    manufacturer: "Acana",

    country: "Canada",

    weight: ["4lb", "14lb", "25lb"],

    variants: [
      {
        weight: "4lb",
        price: 26.99,
        originalPrice: 34.99,
      },
      {
        weight: "14lb",
        price: 69.99,
        originalPrice: 84.99,
      },
      {
        weight: "25lb",
        price: 109.99,
        originalPrice: 129.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.10,

    relatedProducts: [104, 105, 106],
  },
];