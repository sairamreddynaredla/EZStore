// ==========================================
// src/data/dogs/prescription-food/dogPrescriptionFood.js
// ==========================================

import hillsIDImg from "../../assets/products/dogs/prescription-food/hills-prescription-diet-i-d-dog-food.webp";
import farminaVetLifeRenalImg from "../../assets/products/dogs/prescription-food/farmina-vet-life-renal-dog-food.webp";

import hillsMetabolicImg from "../../assets/products/dogs/prescription-food/hills-prescription-diet-metabolic-dog-food.webp";

export const dogPrescriptionFood = [

  {
    id: 402,
    name: "Hill's Prescription Diet i/d Digestive Care Dog Food",
    brand: "Hill's",
    category: "dogs-prescription-food",
    subCategory: "prescription-food",
    pet: "Dog",
    petType: "Dog",
  
    rating: 4.7,
    reviews: 118,
    soldCount: 320,
    stock: 22,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: farminaVetLifeRenalImg,

    images: [
      farminaVetLifeRenalImg,
      farminaVetLifeRenalImg,
      farminaVetLifeRenalImg,
      farminaVetLifeRenalImg,
    ],

    description: "Complete veterinary diet formulated to support dogs with chronic kidney disease.",

    ingredients: ["Chicken", "Rice", "Fish Oil", "Egg Powder", "Beet Pulp", "Minerals"],

    features: [
      "Kidney support formula",
      "Controlled phosphorus",
      "High-quality proteins",
      "Omega fatty acids",
    ],

    nutrition: {
      protein: "14%",
      fat: "18%",
      fiber: "2%",
      moisture: "9%",
    },

    manufacturer: "Farmina",
    country: "Italy",

    weight: ["4lb", "24lb"],

    variants: [
      {
        weight: "4lb",
        price: 32.99,
        originalPrice: 39.99,
      },
      {
        weight: "24lb",
        price: 109.99,
        originalPrice: 129.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [401, 402, 404],
  },

  

  {
    id: 405,
    name: "Hill's Prescription Diet Metabolic Dog Food",
    brand: "Hill's",
    category: "dogs-prescription-food",
    subCategory: "prescription-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Prescription Food",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Weight Management",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 201,
    soldCount: 580,
    stock: 27,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: hillsMetabolicImg,

    images: [hillsMetabolicImg, hillsMetabolicImg, hillsMetabolicImg, hillsMetabolicImg],

    description:
      "Clinically proven veterinary nutrition to help dogs lose weight and maintain healthy body condition.",

    ingredients: [
      "Chicken",
      "Whole Grain Wheat",
      "Corn Gluten Meal",
      "Pea Fiber",
      "Flaxseed",
      "Vitamins",
    ],

    features: [
      "Supports healthy weight loss",
      "Maintains lean muscle",
      "Clinically tested formula",
      "Veterinarian recommended",
    ],

    nutrition: {
      protein: "24%",
      fat: "11%",
      fiber: "13%",
      moisture: "8%",
    },

    manufacturer: "Hill's Pet Nutrition",
    country: "USA",

    weight: ["3lb", "8lb"],

    variants: [
      {
        weight: "3lb",
        price: 27.99,
        originalPrice: 34.99,
      },
      {
        weight: "8lb",
        price: 69.99,
        originalPrice: 82.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [401, 402, 404],
  },
];

// Provide alternate named export expected by aggregator
export const prescription = dogPrescriptionFood;

export default dogPrescriptionFood;
