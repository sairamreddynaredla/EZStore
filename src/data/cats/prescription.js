import royalCaninUrinaryImg from "../../assets/products/cats/prescription-food/royal-canin-urinary-so-cat-food.webp";
import hillsCDImg from "../../assets/products/cats/prescription-food/hills-prescription-diet-cd-multicare-cat-food.webp";
import purinaUrImg from "../../assets/products/cats/prescription-food/purina-pro-plan-veterinary-ur-urinary-cat-food.webp";
import farminaRenalImg from "../../assets/products/cats/prescription-food/farmina-vet-life-renal-cat-food.webp";
import royalCaninHypoallergenicImg from "../../assets/products/cats/prescription-food/royal-canin-hypoallergenic-cat-food.webp";

export const catPrescriptionFood = [
  {
    id: 1801,
    name: "Royal Canin Urinary SO Cat Food",
    brand: "Royal Canin",
    category: "cats-prescription-food",
    subCategory: "prescription-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Prescription Food",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Urinary Care",
    vegType: "Non-Veg",

    rating: 4.9,
    reviews: 286,
    soldCount: 892,
    stock: 24,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: royalCaninUrinaryImg,

    images: [
      royalCaninUrinaryImg,
      royalCaninUrinaryImg,
      royalCaninUrinaryImg,
      royalCaninUrinaryImg,
    ],

    description: "Veterinary diet formulated to support urinary tract health in adult cats.",

    ingredients: ["Chicken Meal", "Rice", "Corn", "Fish Oil", "Minerals", "Vitamins"],

    features: [
      "Urinary tract support",
      "Helps dissolve struvite stones",
      "Balanced minerals",
      "Veterinary formula",
    ],

    nutrition: {
      protein: "32%",
      fat: "15%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Royal Canin",
    country: "France",

    weight: ["3lb", "7lb"],

    variants: [
      { weight: "3lb", price: 29.99, originalPrice: 36.99 },
      { weight: "7lb", price: 58.99, originalPrice: 69.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1802, 1803, 1804],
  },

  {
    id: 1802,
    name: "Hill's Prescription Diet c/d Multicare Cat Food",
    brand: "Hill's",
    category: "cats-prescription-food",
    subCategory: "prescription-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Prescription Food",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Urinary Care",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 254,
    soldCount: 744,
    stock: 22,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: hillsCDImg,

    images: [hillsCDImg, hillsCDImg, hillsCDImg, hillsCDImg],

    description: "Clinical nutrition specially formulated for urinary health.",

    ingredients: ["Chicken", "Rice", "Fish Oil", "Vitamins", "Minerals"],

    features: [
      "Supports bladder health",
      "Reduces urinary crystal risk",
      "Clinically tested",
      "Balanced nutrition",
    ],

    nutrition: {
      protein: "34%",
      fat: "17%",
      fiber: "2%",
      moisture: "10%",
    },

    manufacturer: "Hill's",
    country: "USA",

    weight: ["3.6lb", "7.6lb"],

    variants: [
      { weight: "3.6lb", price: 32.99, originalPrice: 39.99 },
      { weight: "7.6lb", price: 61.99, originalPrice: 74.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1801, 1803, 1805],
  },

  {
    id: 1803,
    name: "Purina Pro Plan Veterinary Diets UR Urinary Cat Food",
    brand: "Purina Pro Plan",
    category: "cats-prescription-food",
    subCategory: "prescription-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Prescription Food",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Urinary Care",
    vegType: "Non-Veg",

    rating: 4.8,
    reviews: 238,
    soldCount: 702,
    stock: 26,

    fastDelivery: true,
    isNew: false,
    deliveryDate: "Tomorrow",

    image: purinaUrImg,

    images: [purinaUrImg, purinaUrImg, purinaUrImg, purinaUrImg],

    description: "Veterinary urinary support diet with controlled mineral content.",

    ingredients: ["Chicken", "Rice", "Animal Fat", "Vitamins", "Minerals"],

    features: [
      "Supports urinary health",
      "Controlled minerals",
      "High digestibility",
      "Veterinary nutrition",
    ],

    nutrition: {
      protein: "35%",
      fat: "16%",
      fiber: "3%",
      moisture: "10%",
    },

    manufacturer: "Purina",
    country: "USA",

    weight: ["3lb", "6lb"],

    variants: [
      { weight: "3lb", price: 28.99, originalPrice: 34.99 },
      { weight: "6lb", price: 54.99, originalPrice: 64.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1801, 1802, 1804],
  },

  {
    id: 1804,
    name: "Farmina Vet Life Renal Cat Food",
    brand: "Farmina",
    category: "cats-prescription-food",
    subCategory: "prescription-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Prescription Food",
    flavor: "Chicken",
    lifeStage: "Adult",
    specialDiet: "Renal Care",
    vegType: "Non-Veg",

    rating: 4.7,
    reviews: 192,
    soldCount: 538,
    stock: 20,

    fastDelivery: true,
    isNew: true,
    deliveryDate: "Tomorrow",

    image: farminaRenalImg,

    images: [farminaRenalImg, farminaRenalImg, farminaRenalImg, farminaRenalImg],

    description: "Prescription renal diet designed to support kidney function.",

    ingredients: ["Chicken", "Rice", "Fish Oil", "Vitamins", "Minerals"],

    features: ["Kidney support", "Reduced phosphorus", "High quality protein", "Veterinary diet"],

    nutrition: {
      protein: "26%",
      fat: "18%",
      fiber: "2.5%",
      moisture: "10%",
    },

    manufacturer: "Farmina",
    country: "Italy",

    weight: ["4lb", "10lb"],

    variants: [
      { weight: "4lb", price: 34.99, originalPrice: 42.99 },
      { weight: "10lb", price: 82.99, originalPrice: 94.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1801, 1803, 1805],
  },

  {
    id: 1805,
    name: "Royal Canin Hypoallergenic Cat Food",
    brand: "Royal Canin",
    category: "cats-prescription-food",
    subCategory: "prescription-food",
    pet: "Cat",
    petType: "Cat",
    productCategory: "Cat Food",
    productType: "Prescription Food",
    flavor: "Hydrolyzed Protein",
    lifeStage: "Adult",
    specialDiet: "Hypoallergenic",
    vegType: "Non-Veg",

    rating: 4.9,
    reviews: 214,
    soldCount: 624,
    stock: 18,

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

    description: "Specialized veterinary diet for cats with food sensitivities.",

    ingredients: ["Hydrolyzed Protein", "Rice Starch", "Fish Oil", "Vitamins", "Minerals"],

    features: [
      "Food allergy support",
      "Skin barrier support",
      "Highly digestible",
      "Veterinary formula",
    ],

    nutrition: {
      protein: "31%",
      fat: "17%",
      fiber: "2.8%",
      moisture: "10%",
    },

    manufacturer: "Royal Canin",
    country: "France",

    weight: ["4lb", "9lb"],

    variants: [
      { weight: "4lb", price: 36.99, originalPrice: 44.99 },
      { weight: "9lb", price: 74.99, originalPrice: 89.99 },
    ],

    subscriptionEligible: true,
    subscriptionDiscount: 0.1,

    relatedProducts: [1802, 1803, 1804],
  },
];

export default catPrescriptionFood;
