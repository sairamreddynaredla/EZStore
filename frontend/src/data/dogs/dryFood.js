// dogsDryFood.js

// blueBuffaloImg removed
import royalCaninImg from "../../assets/products/dogs/dry-food/royal-canin-maxi-adult-dry-dog-food.png.webp";
import purinaImg from "../../assets/products/dogs/dry-food/purina-pro-plan-complete-essentials-adult-dry-dog-food.webp";
import farminaImg from "../../assets/products/dogs/dry-food/farmina-nd-chicken-pomegranate-adult-medium-maxi-dry-dog-food.webp";
import applodImg from "../../assets/Applod Dry  Chicken & Veg.jpg";
import carniwelImg from "../../assets/Carniwel_Chicken_Small_Breed_Dogs_Puppy_Food_.webp";
// acanaImg removed

export const dogsDryFood = [
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

    images: [royalCaninImg, royalCaninImg, royalCaninImg, royalCaninImg],

    description: "Complete and balanced nutrition specially formulated for large breed adult dogs.",

    ingredients: ["Chicken Meal", "Rice", "Corn", "Animal Fat", "Fish Oil", "Vitamins", "Minerals"],

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
    subscriptionDiscount: 0.1,

    relatedProducts: [103, 104],
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

    images: [purinaImg, purinaImg, purinaImg, purinaImg],

    description: "Premium adult dry dog food with probiotics for digestive and immune health.",

    ingredients: [
      "Chicken",
      "Rice",
      "Poultry By Product Meal",
      "Fish Meal",
      "Vitamins",
      "Minerals",
    ],

    features: ["Fortified probiotics", "High-quality protein", "Supports immunity", "Healthy coat"],

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
    subscriptionDiscount: 0.1,

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

    images: [farminaImg, farminaImg, farminaImg, farminaImg],

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

    weight: ["5lb", "14lb", "24lb"],

    variants: [
      {
        weight: "5lb",
        price: 34.99,
        originalPrice: 42.99,
      },
      {
        weight: "14lb",
        price: 74.99,
        originalPrice: 89.99,
      },
      {
        weight: "24lb",
        price: 114.99,
        originalPrice: 129.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [103],
  },

  // Sample product for Applod (emerging)
  {
    id: 106,
    name: "Applod Chicken & Veg Adult Dry Dog Food",
    brand: "Applod",
    category: "dogs-dry-food",
    subCategory: "dry-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Dry Food",
    breedSize: "All",
    flavor: "Chicken & Veg",
    lifeStage: "Adult",

    rating: 4.4,
    reviews: 34,
    soldCount: 90,
    stock: 22,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: applodImg,
    images: [applodImg],

    description: "Applod balanced nutrition for adult dogs with real chicken.",

    variants: [{ weight: "4lb", price: 14.99, originalPrice: 18.99 }],

    subscriptionEligible: false,
    relatedProducts: [102, 103],
  },

  // Sample product for Carniwel (emerging)
  {
    id: 107,
    name: "Carniwel Puppy Growth Formula",
    brand: "Carniwel",
    category: "dogs-dry-food",
    subCategory: "dry-food",
    pet: "Dog",
    petType: "Puppy",
    productCategory: "Dog Food",
    productType: "Dry Food",
    breedSize: "Small",
    flavor: "Chicken",
    lifeStage: "Puppy",

    rating: 4.6,
    reviews: 20,
    soldCount: 50,
    stock: 15,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: carniwelImg,
    images: [carniwelImg],

    description: "Carniwel growth formula to support healthy puppy development.",

    variants: [{ weight: "2lb", price: 12.99, originalPrice: 15.99 }],

    subscriptionEligible: false,
    relatedProducts: [102],
  },
];
