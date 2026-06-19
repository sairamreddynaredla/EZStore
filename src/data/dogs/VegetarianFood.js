import royalCaninVegImg from "../../assets/products/dogs/vegetarian-food/royal-canin-vegetarian-adult-dry-dog-food.webp";
import farminaVegImg from "../../assets/products/dogs/vegetarian-food/farmina-vet-life-vegetarian-formula-dog-food.webp";
import droolsVegImg from "../../assets/products/dogs/vegetarian-food/drools-vegetarian-adult-dog-food.webp";
import purepetVegImg from "../../assets/products/dogs/vegetarian-food/purepet-vegetarian-adult-dog-food.webp";
import pedigreeVegImg from "../../assets/products/dogs/vegetarian-food/pedigree-vegetarian-adult-dry-dog-food.webp";
export const dogsVegetarianFood = [
  {
    id: 1101,
    name: "Royal Canin Vegetarian Adult Dry Dog Food",
    brand: "Royal Canin",
    category: "dogs-vegetarian-food",
    subCategory: "vegetarian-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Vegetarian Food",
    breedSize: "All",
    shopByBreed: "All",
    flavor: "Vegetable",
    lifeStage: "Adult",
    specialDiet: "Vegetarian",
    vegType: "Veg",
    size: "Medium",

    rating: 4.8,
    reviews: 92,
    soldCount: 245,
    stock: 22,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninVegImg,

    images: [royalCaninVegImg, royalCaninVegImg, royalCaninVegImg, royalCaninVegImg],

    description: "Complete vegetarian nutrition formulated for adult dogs with food sensitivities.",

    ingredients: ["Rice", "Corn", "Soy Protein", "Vegetable Oil", "Vitamins", "Minerals"],

    features: [
      "100% vegetarian",
      "Supports digestion",
      "Balanced nutrition",
      "Suitable for food sensitivities",
    ],

    nutrition: {
      protein: "22%",
      fat: "12%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Royal Canin",
    country: "France",

    weight: ["4lb", "14lb"],

    variants: [
      {
        weight: "4lb",
        price: 24.99,
        originalPrice: 29.99,
      },
      {
        weight: "14lb",
        price: 69.99,
        originalPrice: 79.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1102, 1103, 1104],
  },
  {
    id: 1102,
    name: "Farmina Vet Life Vegetarian Formula Dog Food",
    brand: "Farmina",
    category: "dogs-vegetarian-food",
    subCategory: "vegetarian-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Vegetarian Food",
    breedSize: "All",
    shopByBreed: "All",
    flavor: "Vegetable",
    lifeStage: "Adult",
    specialDiet: "Vegetarian",
    vegType: "Veg",
    size: "Medium",

    rating: 4.9,
    reviews: 84,
    soldCount: 198,
    stock: 18,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: farminaVegImg,
    images: [farminaVegImg, farminaVegImg, farminaVegImg, farminaVegImg],

    description: "Premium vegetarian formula enriched with vitamins and antioxidants.",

    ingredients: ["Rice", "Pea Protein", "Beet Pulp", "Vegetable Oil", "Vitamins", "Minerals"],

    features: ["Premium formula", "Digestive support", "Rich antioxidants", "Veterinary nutrition"],

    nutrition: {
      protein: "24%",
      fat: "13%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Farmina",
    country: "Italy",

    weight: ["4lb", "20lb"],

    variants: [
      { weight: "4lb", price: 28.99, originalPrice: 34.99 },
      { weight: "20lb", price: 84.99, originalPrice: 99.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1101, 1103, 1105],
  },

  {
    id: 1103,
    name: "Drools Vegetarian Adult Dog Food",
    brand: "Drools",
    category: "dogs-vegetarian-food",
    subCategory: "vegetarian-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Vegetarian Food",
    breedSize: "All",
    shopByBreed: "All",
    flavor: "Vegetable",
    lifeStage: "Adult",
    specialDiet: "Vegetarian",
    vegType: "Veg",
    size: "Medium",

    rating: 4.6,
    reviews: 105,
    soldCount: 310,
    stock: 36,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: droolsVegImg,

    images: [droolsVegImg, droolsVegImg, droolsVegImg, droolsVegImg],

    description:
      "Drools Vegetarian Adult Dog Food provides complete and balanced vegetarian nutrition to support healthy digestion, immunity, and overall wellbeing in adult dogs.",

    ingredients: [
      "Rice",
      "Corn",
      "Soy Protein",
      "Vegetable Oil",
      "Beet Pulp",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "100% vegetarian recipe",
      "Supports healthy digestion",
      "Rich in essential vitamins",
      "Balanced daily nutrition",
    ],

    nutrition: {
      protein: "21%",
      fat: "11%",
      fiber: "4%",
      moisture: "10%",
    },

    manufacturer: "Drools Pet Food Pvt Ltd",

    country: "India",

    weight: ["2.4lb", "6lb", "20lb"],

    variants: [
      {
        weight: "2.4lb",
        price: 8.99,
        originalPrice: 10.99,
      },
      {
        weight: "6lb",
        price: 18.99,
        originalPrice: 22.99,
      },
      {
        weight: "20lb",
        price: 49.99,
        originalPrice: 59.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1101, 1102, 1104],
  },

  {
    id: 1104,
    name: "Purepet Vegetarian Adult Dog Food",
    brand: "Purepet",
    category: "dogs-vegetarian-food",
    subCategory: "vegetarian-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Vegetarian Food",
    breedSize: "All",
    shopByBreed: "All",
    flavor: "Vegetable",
    lifeStage: "Adult",
    specialDiet: "Vegetarian",
    vegType: "Veg",
    size: "Medium",

    rating: 4.5,
    reviews: 98,
    soldCount: 275,
    stock: 42,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: purepetVegImg,

    images: [purepetVegImg, purepetVegImg, purepetVegImg, purepetVegImg],

    description:
      "Purepet Vegetarian Adult Dog Food is formulated with high-quality plant-based ingredients to provide complete and balanced nutrition for adult dogs.",

    ingredients: [
      "Rice",
      "Corn",
      "Soy Protein",
      "Vegetable Oil",
      "Beet Pulp",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Complete vegetarian nutrition",
      "Supports digestive health",
      "Healthy skin and coat",
      "Daily balanced diet",
    ],

    nutrition: {
      protein: "20%",
      fat: "10%",
      fiber: "4%",
      moisture: "10%",
    },

    manufacturer: "Purepet",

    country: "India",

    weight: ["2.4lb", "6lb", "14lb"],

    variants: [
      {
        weight: "2.4lb",
        price: 7.99,
        originalPrice: 9.99,
      },
      {
        weight: "6lb",
        price: 17.99,
        originalPrice: 21.99,
      },
      {
        weight: "14lb",
        price: 34.99,
        originalPrice: 41.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1101, 1103, 1105],
  },

  {
    id: 1105,
    name: "Pedigree Vegetarian Adult Dry Dog Food",
    brand: "Pedigree",
    category: "dogs-vegetarian-food",
    subCategory: "vegetarian-food",
    pet: "Dog",
    petType: "Dog",
    productCategory: "Dog Food",
    productType: "Vegetarian Food",
    breedSize: "All",
    shopByBreed: "All",
    flavor: "Vegetable",
    lifeStage: "Adult",
    specialDiet: "Vegetarian",
    vegType: "Veg",
    size: "Medium",

    rating: 4.7,
    reviews: 132,
    soldCount: 358,
    stock: 48,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: pedigreeVegImg,

    images: [pedigreeVegImg, pedigreeVegImg, pedigreeVegImg, pedigreeVegImg],

    description:
      "Pedigree Vegetarian Adult Dry Dog Food delivers balanced nutrition with essential vitamins, minerals and plant-based protein for adult dogs.",

    ingredients: [
      "Rice",
      "Corn",
      "Soy Protein",
      "Vegetable Oil",
      "Carrot Powder",
      "Vitamins",
      "Minerals",
    ],

    features: [
      "Vegetarian recipe",
      "Supports immunity",
      "Healthy digestion",
      "Complete daily nutrition",
    ],

    nutrition: {
      protein: "22%",
      fat: "11%",
      fiber: "3.5%",
      moisture: "10%",
    },

    manufacturer: "Mars Petcare",

    country: "India",

    weight: ["2.4lb", "6lb", "20lb"],

    variants: [
      {
        weight: "2.4lb",
        price: 8.49,
        originalPrice: 10.49,
      },
      {
        weight: "6lb",
        price: 19.99,
        originalPrice: 23.99,
      },
      {
        weight: "20lb",
        price: 47.99,
        originalPrice: 56.99,
      },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1102, 1103, 1104],
  },
];
