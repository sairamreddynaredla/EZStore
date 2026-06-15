import royalCaninGrainFreeImg from "../../assets/products/cats/grain-free-food/royal-canin-grain-free-adult-cat-food.jpg";
import orijenImg from "../../assets/products/cats/grain-free-food/orijen-original-grain-free-cat-food.jpg";
import tasteWildImg from "../../assets/products/cats/grain-free-food/taste-of-the-wild-rocky-mountain-grain-free-cat-food.jpg";
import farminaImg from "../../assets/products/cats/grain-free-food/farmina-nd-chicken-pomegranate-grain-free-cat-food.jpg";

export const grainFreeFood = [

{
  id: 1501,
  name: "Royal Canin Grain Free Adult Cat Food",
  brand: "Royal Canin",
  category: "cats-grain-free-food",
  subCategory: "grain-free-food",
  pet: "Cat",
  petType: "Cat",
  productCategory: "Cat Food",
  productType: "Grain Free Food",
  flavor: "Chicken",
  lifeStage: "Adult",
  specialDiet: "Grain Free",
  vegType: "Non-Veg",

  rating: 4.8,
  reviews: 245,
  soldCount: 864,
  stock: 36,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: royalCaninGrainFreeImg,

  images: [
    royalCaninGrainFreeImg,
    royalCaninGrainFreeImg,
    royalCaninGrainFreeImg,
    royalCaninGrainFreeImg,
  ],

  description:
    "High protein grain-free nutrition formulated for healthy adult cats.",

  ingredients: [
    "Chicken",
    "Peas",
    "Potatoes",
    "Fish Oil",
    "Vitamins",
    "Minerals",
  ],

  features: [
    "Grain free recipe",
    "High protein",
    "Supports digestion",
    "Healthy skin and coat",
  ],

  nutrition: {
    protein: "34%",
    fat: "18%",
    fiber: "4%",
    moisture: "10%",
  },

  manufacturer: "Royal Canin",
  country: "France",

  weight: ["2kg", "4kg"],

  variants: [
    { weight: "2kg", price: 28.99, originalPrice: 34.99 },
    { weight: "4kg", price: 52.99, originalPrice: 62.99 },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [1502, 1504],
},

{
  id: 1502,
  name: "Orijen Original Grain Free Cat Food",
  brand: "Orijen",
  category: "cats-grain-free-food",
  subCategory: "grain-free-food",
  pet: "Cat",
  petType: "Cat",
  productCategory: "Cat Food",
  productType: "Grain Free Food",
  flavor: "Chicken & Turkey",
  lifeStage: "Adult",
  specialDiet: "Grain Free",
  vegType: "Non-Veg",

  rating: 4.9,
  reviews: 382,
  soldCount: 1148,
  stock: 28,

  fastDelivery: true,
  isNew: true,
  deliveryDate: "Tomorrow",

  image: orijenImg,

  images: [
    orijenImg,
    orijenImg,
    orijenImg,
    orijenImg,
  ],

  description:
    "Biologically appropriate grain-free food packed with animal protein.",

  ingredients: [
    "Chicken",
    "Turkey",
    "Eggs",
    "Fish",
    "Vitamins",
    "Minerals",
  ],

  features: [
    "85% animal ingredients",
    "Grain free",
    "Rich protein source",
    "Supports lean muscles",
  ],

  nutrition: {
    protein: "40%",
    fat: "20%",
    fiber: "3%",
    moisture: "10%",
  },

  manufacturer: "Champion Petfoods",
  country: "Canada",

  weight: ["1.8kg", "5.4kg"],

  variants: [
    { weight: "1.8kg", price: 34.99, originalPrice: 42.99 },
    { weight: "5.4kg", price: 84.99, originalPrice: 99.99 },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [1501, 1505],
},

{
  id: 1504,
  name: "Taste of the Wild Rocky Mountain Grain Free Cat Food",
  brand: "Taste of the Wild",
  category: "cats-grain-free-food",
  subCategory: "grain-free-food",
  pet: "Cat",
  petType: "Cat",
  productCategory: "Cat Food",
  productType: "Grain Free Food",
  flavor: "Salmon & Venison",
  lifeStage: "Adult",
  specialDiet: "Grain Free",
  vegType: "Non-Veg",

  rating: 4.7,
  reviews: 226,
  soldCount: 792,
  stock: 27,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: tasteWildImg,

  images: [
    tasteWildImg,
    tasteWildImg,
    tasteWildImg,
    tasteWildImg,
  ],

  description:
    "Grain-free formula with roasted venison and smoked salmon.",

  ingredients: [
    "Salmon",
    "Venison",
    "Peas",
    "Potatoes",
    "Vitamins",
    "Minerals",
  ],

  features: [
    "Novel protein sources",
    "Grain free",
    "Supports muscles",
    "Rich antioxidants",
  ],

  nutrition: {
    protein: "42%",
    fat: "18%",
    fiber: "3%",
    moisture: "10%",
  },

  manufacturer: "Taste of the Wild",
  country: "USA",

  weight: ["2kg", "6.6kg"],

  variants: [
    { weight: "2kg", price: 31.99, originalPrice: 38.99 },
    { weight: "6.6kg", price: 89.99, originalPrice: 104.99 },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [1501, 1503, 1505],
},

{
  id: 1505,
  name: "Farmina N&D Chicken & Pomegranate Grain Free Cat Food",
  brand: "Farmina",
  category: "cats-grain-free-food",
  subCategory: "grain-free-food",
  pet: "Cat",
  petType: "Cat",
  productCategory: "Cat Food",
  productType: "Grain Free Food",
  flavor: "Chicken",
  lifeStage: "Adult",
  specialDiet: "Grain Free",
  vegType: "Non-Veg",

  rating: 4.9,
  reviews: 318,
  soldCount: 1024,
  stock: 34,

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
    "Premium grain-free cat food with chicken and pomegranate.",

  ingredients: [
    "Chicken",
    "Pomegranate",
    "Sweet Potato",
    "Fish Oil",
    "Vitamins",
    "Minerals",
  ],

  features: [
    "Natural ingredients",
    "Low glycemic recipe",
    "Grain free",
    "Rich antioxidants",
  ],

  nutrition: {
    protein: "44%",
    fat: "20%",
    fiber: "2.5%",
    moisture: "8%",
  },

  manufacturer: "Farmina",
  country: "Italy",

  weight: ["1.5kg", "5kg"],

  variants: [
    { weight: "1.5kg", price: 32.99, originalPrice: 39.99 },
    { weight: "5kg", price: 79.99, originalPrice: 94.99 },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.1,

  relatedProducts: [1502, 1503, 1504],
},

];

export default grainFreeFood;
