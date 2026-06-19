import royalCaninPuppyImg from "../../assets/products/dogs/puppyFood/royal-canin-mini-puppy-dry-dog-food.webp";
import pedigreePuppyImg from "../../assets/products/dogs/puppyFood/pedigree-puppy-chicken-milk-dry-food.webp";
import droolsPuppyImg from "../../assets/products/dogs/puppyFood/drools-puppy-chicken-egg-dry-food.webp";
import farminaPuppyImg from "../../assets/products/dogs/puppyFood/farmina-nd-puppy-medium-maxi-food.webp";

export const dogsPuppyFood = [
  {
    id: 601,
    name: "Royal Canin Mini Puppy Dry Dog Food",
    brand: "Royal Canin",
    category: "dogs-puppy-food",
    subCategory: "puppy-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Puppy Food",
    breedSize: "Small",
    shopByBreed: "Small",
    flavor: "Chicken",
    lifeStage: "Puppy",
    specialDiet: "Growth Support",
    vegType: "Non-Veg",
    size: "Small",

    rating: 4.9,
    reviews: 152,
    soldCount: 420,
    stock: 35,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninPuppyImg,

    images: [royalCaninPuppyImg, royalCaninPuppyImg, royalCaninPuppyImg, royalCaninPuppyImg],

    description:
      "Royal Canin Mini Puppy Dry Dog Food is specially formulated to support healthy growth, immune system development, and digestive health in small breed puppies.",

    ingredients: [
      "Chicken Protein",
      "Rice",
      "Corn",
      "Animal Fat",
      "Fish Oil",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Supports immune system",
      "Promotes healthy growth",
      "Highly digestible formula",
      "Ideal for small breed puppies",
    ],

    nutrition: { protein: "31%", fat: "20%", fiber: "2.4%", moisture: "10%" },

    manufacturer: "Royal Canin",
    country: "France",

    weight: ["2lb", "8lb"],

    variants: [
      { weight: "2lb", price: 12.99, originalPrice: 15.99 },
      { weight: "8lb", price: 44.99, originalPrice: 52.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [602, 603, 604],
  },
  {
    id: 602,
    name: "Pedigree Puppy Chicken & Milk Dry Food",
    brand: "Pedigree",
    category: "dogs-puppy-food",
    subCategory: "puppy-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Puppy Food",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Chicken & Milk",
    lifeStage: "Puppy",
    specialDiet: "Growth Support",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 138,
    soldCount: 385,
    stock: 42,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: pedigreePuppyImg,

    images: [pedigreePuppyImg, pedigreePuppyImg, pedigreePuppyImg, pedigreePuppyImg],

    description:
      "Pedigree Puppy Food with chicken and milk provides complete nutrition for growing puppies with strong bones and healthy muscles.",

    ingredients: ["Chicken", "Milk Solids", "Rice", "Corn", "Vegetable Oil", "Minerals"],

    features: [
      "Healthy bone growth",
      "Strong muscles",
      "Supports brain development",
      "Balanced puppy nutrition",
    ],

    nutrition: { protein: "28%", fat: "14%", fiber: "5%", moisture: "10%" },

    manufacturer: "Mars Petcare",
    country: "India",

    weight: ["2.4lb", "6lb", "20lb"],

    variants: [
      { weight: "2.4lb", price: 8.99, originalPrice: 10.99 },
      { weight: "6lb", price: 19.99, originalPrice: 24.99 },
      { weight: "20lb", price: 49.99, originalPrice: 59.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [601, 603, 604],
  },
  {
    id: 603,
    name: "Drools Puppy Chicken & Egg Dry Food",
    brand: "Drools",
    category: "dogs-puppy-food",
    subCategory: "puppy-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Puppy Food",
    breedSize: "All Breeds",
    shopByBreed: "All",
    flavor: "Chicken & Egg",
    lifeStage: "Puppy",
    specialDiet: "Growth Support",
    vegType: "Non-Veg",
    size: "Medium",

    rating: 4.7,
    reviews: 122,
    soldCount: 310,
    stock: 39,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: droolsPuppyImg,

    images: [droolsPuppyImg, droolsPuppyImg, droolsPuppyImg, droolsPuppyImg],

    description:
      "Drools Puppy Food contains high-quality protein and essential nutrients to support healthy puppy growth and development.",

    ingredients: ["Chicken", "Egg", "Rice", "Corn", "Fish Oil", "Minerals"],

    features: [
      "High protein formula",
      "Supports healthy growth",
      "Strong immunity",
      "Improves digestion",
    ],

    nutrition: { protein: "30%", fat: "14%", fiber: "4%", moisture: "10%" },

    manufacturer: "Drools Pet Food Pvt Ltd",
    country: "India",

    weight: ["2.4lb", "6lb", "20lb"],

    variants: [
      { weight: "2.4lb", price: 7.99, originalPrice: 9.99 },
      { weight: "6lb", price: 18.99, originalPrice: 22.99 },
      { weight: "20lb", price: 45.99, originalPrice: 55.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [601, 602, 604],
  },
  {
    id: 604,
    name: "Farmina N&D Puppy Medium Maxi Food",
    brand: "Farmina",
    category: "dogs-puppy-food",
    subCategory: "puppy-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Puppy Food",
    breedSize: "Large",
    shopByBreed: "Large",
    flavor: "Chicken & Pomegranate",
    lifeStage: "Puppy",
    specialDiet: "Grain Free",
    vegType: "Non-Veg",
    size: "Large",

    rating: 4.9,
    reviews: 94,
    soldCount: 205,
    stock: 18,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: farminaPuppyImg,

    images: [farminaPuppyImg, farminaPuppyImg, farminaPuppyImg, farminaPuppyImg],

    description:
      "Farmina N&D Puppy Food is a premium grain-free recipe designed to support healthy growth and development in puppies.",

    ingredients: ["Chicken", "Pomegranate", "Sweet Potato", "Fish Oil", "Vitamins", "Minerals"],

    features: [
      "Grain-free recipe",
      "High animal protein",
      "Supports healthy growth",
      "Premium ingredients",
    ],

    nutrition: { protein: "35%", fat: "20%", fiber: "2.9%", moisture: "9%" },

    manufacturer: "Farmina",
    country: "Italy",

    weight: ["5lb", "24lb"],

    variants: [
      { weight: "5lb", price: 24.99, originalPrice: 29.99 },
      { weight: "24lb", price: 84.99, originalPrice: 99.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [601, 603, 602],
  },
];
