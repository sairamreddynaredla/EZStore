// dogsWetFood.js

import purinaWetImg from "../../assets/products/dogs/wet-food/purina-pro-plan-savory-wet-dog-food.jpg";
import royalCaninWetImg from "../../assets/products/dogs/wet-food/royal-canin-adult-wet-dog-food.jpg";
import blueBuffaloWetImg from "../../assets/products/dogs/wet-food/blue-buffalo-homestyle-recipe-wet-dog-food.jpg";
import pedigreeWetImg from "../../assets/products/dogs/wet-food/pedigree-chicken-wet-dog-food.jpg";
import hillsWetImg from "../../assets/products/dogs/wet-food/hills-science-diet-adult-wet-dog-food.jpg";

export const dogsWetFood = [
  {
    id: 201,
    name: "Purina Pro Plan Savory Wet Dog Food",
    brand: "Purina Pro Plan",
    category: "dogs-wet-food",
    subCategory: "wet-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Wet Food",
    breedSize: "All Breeds",
    shopByBreed: "All Breeds",
    flavor: "Chicken & Rice",
    lifeStage: "Adult",
    specialDiet: "High Protein",
    vegType: "Non-Veg",
    size: "12.5oz",

    rating: 4.7,
    reviews: 238,
    soldCount: 320,
    stock: 32,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: purinaWetImg,

    images: [
      purinaWetImg,
      purinaWetImg,
    ],

    description:
      "Purina Pro Plan wet dog food provides balanced nutrition with high-quality protein and wet texture that adult dogs love.",

    ingredients: [
      "Chicken",
      "Broth",
      "Rice",
      "Peas",
      "Carrots",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "High protein wet food",
      "Supports muscle maintenance",
      "Rich savory flavor",
      "Easy to serve and digest",
    ],

    nutrition: {
      protein: "10%",
      fat: "6%",
      fiber: "2%",
      moisture: "78%",
    },

    manufacturer: "Purina",

    weight: ["12.5oz"],

    variants: [
      {
        weight: "12.5oz",
        price: 3.99,
        originalPrice: 4.99,
      },
    ],

    relatedProducts: [202, 203, 204],
  },

  {
    id: 202,
    name: "Royal Canin Adult Wet Dog Food",
    brand: "Royal Canin",
    category: "dogs-wet-food",
    subCategory: "wet-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Wet Food",
    breedSize: "All Breeds",
    shopByBreed: "All Breeds",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Digestive Care",
    vegType: "Non-Veg",
    size: "13oz",

    rating: 4.8,
    reviews: 185,
    soldCount: 275,
    stock: 28,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninWetImg,

    images: [
      royalCaninWetImg,
      royalCaninWetImg,
    ],

    description:
      "Royal Canin Adult Wet Dog Food delivers balanced nutrition and supports digestive health.",

    ingredients: [
      "Chicken",
      "Pork By Products",
      "Broth",
      "Rice",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Supports digestive health",
      "Highly palatable",
      "Balanced nutrition",
      "Soft texture",
    ],

    nutrition: {
      protein: "9%",
      fat: "5.5%",
      fiber: "1.8%",
      moisture: "80%",
    },

    manufacturer: "Royal Canin",

    weight: ["13oz"],

    variants: [
      {
        weight: "13oz",
        price: 4.29,
        originalPrice: 5.29,
      },
    ],

    relatedProducts: [201, 203, 205],
  },

  {
    id: 203,
    name: "Blue Buffalo Homestyle Recipe Wet Dog Food",
    brand: "Blue Buffalo",
    category: "dogs-wet-food",
    subCategory: "wet-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Wet Food",
    breedSize: "All Breeds",
    shopByBreed: "All Breeds",
    flavor: "Chicken Dinner",
    lifeStage: "Adult",
    specialDiet: "Natural",
    vegType: "Non-Veg",
    size: "12.5oz",

    rating: 4.7,
    reviews: 210,
    soldCount: 290,
    stock: 26,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: blueBuffaloWetImg,

    images: [
      blueBuffaloWetImg,
      blueBuffaloWetImg,
    ],

    description:
      "Natural wet dog food made with real chicken and wholesome vegetables.",

    ingredients: [
      "Chicken",
      "Chicken Broth",
      "Carrots",
      "Peas",
      "Brown Rice",
      "Vitamins",
    ],

    features: [
      "Real chicken first ingredient",
      "Natural recipe",
      "No artificial preservatives",
      "Rich taste",
    ],

    nutrition: {
      protein: "9.5%",
      fat: "7%",
      fiber: "1.5%",
      moisture: "78%",
    },

    manufacturer: "Blue Buffalo",

    weight: ["12.5oz"],

    variants: [
      {
        weight: "12.5oz",
        price: 4.19,
        originalPrice: 5.19,
      },
    ],

    relatedProducts: [201, 202, 205],
  },

  {
    id: 204,
    name: "Pedigree Chicken Wet Dog Food",
    brand: "Pedigree",
    category: "dogs-wet-food",
    subCategory: "wet-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Wet Food",
    breedSize: "All Breeds",
    shopByBreed: "All Breeds",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Balanced Nutrition",
    vegType: "Non-Veg",
    size: "13.2oz",

    rating: 4.5,
    reviews: 198,
    soldCount: 450,
    stock: 40,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: pedigreeWetImg,

    images: [
      pedigreeWetImg,
      pedigreeWetImg,
    ],

    description:
      "Pedigree wet food offers complete nutrition with delicious chicken flavor.",

    ingredients: [
      "Chicken",
      "Meat By Products",
      "Broth",
      "Rice",
      "Minerals",
    ],

    features: [
      "Complete nutrition",
      "Soft texture",
      "Delicious taste",
      "Easy digestion",
    ],

    nutrition: {
      protein: "8%",
      fat: "5%",
      fiber: "1%",
      moisture: "82%",
    },

    manufacturer: "Pedigree",

    weight: ["13.2oz"],

    variants: [
      {
        weight: "13.2oz",
        price: 2.99,
        originalPrice: 3.99,
      },
    ],

    relatedProducts: [201, 202, 205],
  },

  {
    id: 205,
    name: "Hill's Science Diet Adult Wet Dog Food",
    brand: "Hill's Science Diet",
    category: "dogs-wet-food",
    subCategory: "wet-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Wet Food",
    breedSize: "All Breeds",
    shopByBreed: "All Breeds",
    flavor: "Chicken & Barley",
    lifeStage: "Adult",
    specialDiet: "Digestive Care",
    vegType: "Non-Veg",
    size: "13oz",

    rating: 4.8,
    reviews: 165,
    soldCount: 240,
    stock: 22,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: hillsWetImg,

    images: [
      hillsWetImg,
      hillsWetImg,
    ],

    description:
      "Premium wet dog food formulated for digestive health and overall wellness.",

    ingredients: [
      "Chicken",
      "Pork Liver",
      "Barley",
      "Carrots",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Supports digestion",
      "High-quality protein",
      "Balanced minerals",
      "Healthy immune system",
    ],

    nutrition: {
      protein: "8.5%",
      fat: "5.5%",
      fiber: "1.5%",
      moisture: "78%",
    },

    manufacturer: "Hill's",

    weight: ["13oz"],

    variants: [
      {
        weight: "13oz",
        price: 4.49,
        originalPrice: 5.49,
      },
    ],

    relatedProducts: [201, 202, 203],
  },
];

// Provide alternate export name expected by other modules
export const wetFood = dogsWetFood;