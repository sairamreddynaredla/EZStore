// ==========================================
// src/data/dogs/prescription-food/dogPrescriptionFood.js
// ==========================================

import royalCaninGastroImg from "../../assets/products/dogs/prescription-food/royal-canin-gastrointestinal-dry-dog-food1.jpg";
import hillsIDImg from "../../assets/products/dogs/prescription-food/hills-prescription-diet-i-d-dog-food.jpg";
import farminaVetLifeRenalImg from "../../assets/products/dogs/prescription-food/farmina-vet-life-renal-dog-food.jpg";
import royalCaninHypoallergenicImg from "../../assets/products/dogs/prescription-food/royal-canin-hypoallergenic-dog-food.jpg";
import hillsMetabolicImg from "../../assets/products/dogs/prescription-food/hills-prescription-diet-metabolic-dog-food.jpg";

export const dogPrescriptionFood = [
  {
    id: 401,
    name: "Royal Canin Gastrointestinal Dry Dog Food",
    brand: "Royal Canin",
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
    specialDiet: "Digestive Care",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 185,
    soldCount: 620,
    stock: 35,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninGastroImg,

    images: [
      royalCaninGastroImg,
      royalCaninGastroImg,
      royalCaninGastroImg,
      royalCaninGastroImg,
    ],

    description:
      "Specially formulated veterinary diet to support dogs with digestive disorders and gastrointestinal sensitivities.",

    ingredients: [
      "Rice",
      "Chicken Meal",
      "Animal Fat",
      "Beet Pulp",
      "Fish Oil",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Supports digestive health",
      "Highly digestible formula",
      "Balanced fiber content",
      "Veterinary recommended",
    ],

    nutrition: {
      protein: "25%",
      fat: "20%",
      fiber: "2%",
      moisture: "10%",
    },

    manufacturer: "Royal Canin",
    country: "France",

    weight: ["2kg", "7kg"],

    variants: [
      {
        weight: "2kg",
        price: 28.99,
        originalPrice: 34.99,
      },
      {
        weight: "7kg",
        price: 79.99,
        originalPrice: 92.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [402, 403, 404],
  },

  {
    id: 402,
    name: "Hill's Prescription Diet i/d Digestive Care Dog Food",
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
    specialDiet: "Digestive Care",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.9,
    reviews: 232,
    soldCount: 710,
    stock: 29,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: hillsIDImg,

    images: [
      hillsIDImg,
      hillsIDImg,
      hillsIDImg,
      hillsIDImg,
    ],

    description:
      "Veterinary nutrition clinically proven to support digestive health and nutrient absorption.",

    ingredients: [
      "Chicken",
      "Rice",
      "Corn Gluten Meal",
      "Animal Fat",
      "Fish Oil",
      "Vitamins",
    ],

    features: [
      "Easy digestion",
      "Supports stool quality",
      "Highly digestible ingredients",
      "Veterinarian approved",
    ],

    nutrition: {
      protein: "24%",
      fat: "15%",
      fiber: "1.7%",
      moisture: "8%",
    },

    manufacturer: "Hill's Pet Nutrition",
    country: "USA",

    weight: ["1.5kg", "4kg"],

    variants: [
      {
        weight: "1.5kg",
        price: 25.99,
        originalPrice: 31.99,
      },
      {
        weight: "4kg",
        price: 62.99,
        originalPrice: 74.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [401, 403, 404],
  },

  {
    id: 403,
    name: "Farmina Vet Life Renal Dog Food",
    brand: "Farmina",
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
    specialDiet: "Renal Care",
    vegType: "Non-Veg",
    size: "Medium",

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

    description:
      "Complete veterinary diet formulated to support dogs with chronic kidney disease.",

    ingredients: [
      "Chicken",
      "Rice",
      "Fish Oil",
      "Egg Powder",
      "Beet Pulp",
      "Minerals",
    ],

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

    weight: ["2kg", "12kg"],

    variants: [
      {
        weight: "2kg",
        price: 32.99,
        originalPrice: 39.99,
      },
      {
        weight: "12kg",
        price: 109.99,
        originalPrice: 129.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [401, 402, 404],
  },

  {
    id: 404,
    name: "Royal Canin Hypoallergenic Dog Food",
    brand: "Royal Canin",
    category: "dogs-prescription-food",
    subCategory: "prescription-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Prescription Food",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Hydrolyzed Protein",
    lifeStage: "Adult",
    specialDiet: "Hypoallergenic",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 163,
    soldCount: 470,
    stock: 30,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninHypoallergenicImg,

    images: [
      royalCaninHypoallergenicImg,
      royalCaninHypoallergenicImg,
      royalCaninHypoallergenicImg,
      royalCaninHypoallergenicImg,
    ],

    description:
      "Veterinary diet formulated for dogs with food allergies and skin sensitivities.",

    ingredients: [
      "Hydrolyzed Soy Protein",
      "Rice",
      "Animal Fat",
      "Beet Pulp",
      "Fish Oil",
      "Minerals",
    ],

    features: [
      "Supports skin health",
      "Reduces food intolerance",
      "Hydrolyzed protein formula",
      "Veterinary diet",
    ],

    nutrition: {
      protein: "21%",
      fat: "19%",
      fiber: "2%",
      moisture: "10%",
    },

    manufacturer: "Royal Canin",
    country: "France",

    weight: ["2kg", "7kg"],

    variants: [
      {
        weight: "2kg",
        price: 34.99,
        originalPrice: 41.99,
      },
      {
        weight: "7kg",
        price: 95.99,
        originalPrice: 114.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [401, 402, 403],
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

    images: [
      hillsMetabolicImg,
      hillsMetabolicImg,
      hillsMetabolicImg,
      hillsMetabolicImg,
    ],

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

    weight: ["1.5kg", "4kg"],

    variants: [
      {
        weight: "1.5kg",
        price: 27.99,
        originalPrice: 34.99,
      },
      {
        weight: "4kg",
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