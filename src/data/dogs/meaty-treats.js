import pedigreeRodeoImg from "../../assets/products/dogs/meaty-treats/pedigree-rodeo-chicken-treats.jpg";
import jerhighChickenJerkyImg from "../../assets/products/dogs/meaty-treats/jerhigh-chicken-jerky-treats.jpg";
// smartHeartStickImg removed; SmartHeart brand being hidden
import gnawlersMilkBoneImg from "../../assets/products/dogs/meaty-treats/gnawlers-calcium-milk-bone-treats.jpg";
import droolsSausageImg from "../../assets/products/dogs/meaty-treats/drools-real-chicken-sausage-treats.jpg";

export const dogsMeatyTreats = [

{
  id: 301,
  name: "Pedigree Rodeo Chicken Flavor Dog Treats",
  brand: "Pedigree",
  category: "dogs-treats",
  subCategory: "meaty-treats",
  pet: "Dog",
  petType: "Dog",
  productCategory: "Dog Treats",
  productType: "Meaty Treat",
  breedSize: "All Breeds",
  shopByBreed: "All",
  flavor: "Chicken",
  lifeStage: "Adult",
  specialDiet: "Regular",
  vegType: "Non-Veg",
  size: "Medium",

  rating: 4.6,
  reviews: 124,
  soldCount: 350,
  stock: 45,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: pedigreeRodeoImg,

  images: [
    pedigreeRodeoImg,
    pedigreeRodeoImg,
    pedigreeRodeoImg,
    pedigreeRodeoImg,
  ],

  description:
    "Pedigree Rodeo Chicken Flavor Treats are delicious chewy dog snacks enriched with vitamins and minerals for rewarding your dog every day.",

  ingredients: [
    "Chicken",
    "Cereals",
    "Vegetable Protein",
    "Vitamins",
    "Minerals",
    "Animal Derivatives",
  ],

  features: [
    "Soft chewy texture",
    "Chicken flavor dogs love",
    "Ideal for training rewards",
    "Fortified with vitamins",
  ],

  nutrition: {
    protein: "18%",
    fat: "4%",
    fiber: "2%",
    moisture: "20%",
  },

  manufacturer: "Mars Petcare",
  country: "India",

  weight: ["70g", "140g"],

  variants: [
    {
      weight: "70g",
      price: 2.99,
      originalPrice: 3.99,
    },
    {
      weight: "140g",
      price: 5.49,
      originalPrice: 6.99,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.05,
  relatedProducts: [302, 304],
},

{
  id: 302,
  name: "JerHigh Chicken Jerky Dog Treats",
  brand: "JerHigh",
  category: "dogs-treats",
  subCategory: "meaty-treats",
  pet: "Dog",
  petType: "Dog",
  productCategory: "Dog Treats",
  productType: "Meaty Treat",
  breedSize: "All Breeds",
  shopByBreed: "All",
  flavor: "Chicken",
  lifeStage: "Adult",
  specialDiet: "High Protein",
  vegType: "Non-Veg",
  size: "Medium",

  rating: 4.8,
  reviews: 218,
  soldCount: 520,
  stock: 38,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: jerhighChickenJerkyImg,

  images: [
    jerhighChickenJerkyImg,
    jerhighChickenJerkyImg,
    jerhighChickenJerkyImg,
    jerhighChickenJerkyImg,
  ],

  description:
    "JerHigh Chicken Jerky is made with real chicken meat and provides a tasty high-protein reward for dogs of all breeds.",

  ingredients: [
    "Chicken Meat",
    "Wheat Flour",
    "Vegetable Protein",
    "Glycerin",
    "Vitamins",
    "Minerals",
  ],

  features: [
    "Made with real chicken",
    "High protein snack",
    "Supports muscle health",
    "Highly palatable",
  ],

  nutrition: {
    protein: "22%",
    fat: "5%",
    fiber: "1%",
    moisture: "18%",
  },

  manufacturer: "JerHigh Pet Food",
  country: "Thailand",

  weight: ["70g", "100g"],

  variants: [
    {
      weight: "70g",
      price: 3.49,
      originalPrice: 4.29,
    },
    {
      weight: "100g",
      price: 5.29,
      originalPrice: 6.49,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.05,
  relatedProducts: [301, 304],
},


{
  id: 304,
  name: "Gnawlers Calcium Milk Bone Dog Treats",
  brand: "Gnawlers",
  category: "dogs-treats",
  subCategory: "meaty-treats",
  pet: "Dog",
  petType: "Dog",
  productCategory: "Dog Treats",
  productType: "Meaty Treat",
  breedSize: "All Breeds",
  shopByBreed: "All",
  flavor: "Milk",
  lifeStage: "Adult",
  specialDiet: "Calcium Rich",
  vegType: "Non-Veg",
  size: "Medium",

  rating: 4.5,
  reviews: 112,
  soldCount: 290,
  stock: 41,

  fastDelivery: true,
  isNew: true,
  deliveryDate: "Tomorrow",

  image: gnawlersMilkBoneImg,

  images: [
    gnawlersMilkBoneImg,
    gnawlersMilkBoneImg,
    gnawlersMilkBoneImg,
    gnawlersMilkBoneImg,
  ],

  description:
    "Gnawlers Calcium Milk Bone Treats help support healthy teeth and bones while providing a delicious chewing experience.",

  ingredients: [
    "Chicken",
    "Milk Solids",
    "Calcium",
    "Cereals",
    "Minerals",
    "Vitamins",
  ],

  features: [
    "Rich in calcium",
    "Supports dental health",
    "Promotes strong bones",
    "Long-lasting chew",
  ],

  nutrition: {
    protein: "19%",
    fat: "3%",
    fiber: "2%",
    moisture: "18%",
  },

  manufacturer: "Gnawlers",
  country: "India",

  weight: ["75g", "150g"],

  variants: [
    {
      weight: "75g",
      price: 2.99,
      originalPrice: 3.99,
    },
    {
      weight: "150g",
      price: 5.99,
      originalPrice: 7.49,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.05,
  relatedProducts: [301, 302],
},

{
  id: 305,
  name: "Drools Real Chicken Sausage Dog Treats",
  brand: "Drools",
  category: "dogs-treats",
  subCategory: "meaty-treats",
  pet: "Dog",
  petType: "Dog",
  productCategory: "Dog Treats",
  productType: "Meaty Treat",
  breedSize: "All Breeds",
  shopByBreed: "All",
  flavor: "Chicken",
  lifeStage: "Adult",
  specialDiet: "High Protein",
  vegType: "Non-Veg",
  size: "Medium",

  rating: 4.8,
  reviews: 245,
  soldCount: 610,
  stock: 60,

  fastDelivery: true,
  isNew: false,
  deliveryDate: "Tomorrow",

  image: droolsSausageImg,

  images: [
    droolsSausageImg,
    droolsSausageImg,
    droolsSausageImg,
    droolsSausageImg,
  ],

  description:
    "Drools Real Chicken Sausage Treats are premium meat snacks made with real chicken for rewarding and training dogs.",

  ingredients: [
    "Chicken",
    "Starch",
    "Vegetable Protein",
    "Natural Flavor",
    "Minerals",
    "Vitamins",
  ],

  features: [
    "Made with real chicken",
    "High protein formula",
    "Soft and chewy texture",
    "Suitable for training rewards",
  ],

  nutrition: {
    protein: "23%",
    fat: "5%",
    fiber: "1%",
    moisture: "17%",
  },

  manufacturer: "Drools Pet Food Pvt Ltd",
  country: "India",

  weight: ["70g", "140g"],

  variants: [
    {
      weight: "70g",
      price: 3.99,
      originalPrice: 4.99,
    },
    {
      weight: "140g",
      price: 6.99,
      originalPrice: 8.49,
    },
  ],

  subscriptionEligible: true,
  subscriptionDiscount: 0.05,
  relatedProducts: [302, 304],
},
];