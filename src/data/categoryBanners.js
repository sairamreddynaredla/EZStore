import catBanner from "../assets/banners/cat-banner.jpeg";
import dogBanner from "../assets/banners/dog-banner.jpeg";
import dogDryBannerImg from "../assets/dog-dropdown-banner/dry-food-banner1.jpeg";
import dogBiscuitsImg from "../assets/dog-dropdown-banner/biscuits-cookies-dog-food-banner.jpeg";
import dogFreshImg from "../assets/dog-dropdown-banner/fresh-food-banner.jpeg";
import dogWetImg from "../assets/dog-dropdown-banner/wet-dog-food-banner.jpeg";
import dogPuppyImg from "../assets/dog-dropdown-banner/puppy-food-banner.jpeg";
import dogPrescriptionImg from "../assets/dog-dropdown-banner/prescription-dog-food-banner.jpeg";
import dogVegetarianImg from "../assets/dog-dropdown-banner/vegetarian-food-banner.jpeg";
import dogPuppyTreatsImg from "../assets/dog-dropdown-banner/puppy-treats-banner.jpeg";
import grainFreeImg from "../assets/dog-dropdown-banner/grain-free-food-banner.jpeg";
import meatyTreatsImg from "../assets/dog-dropdown-banner/meaty-treats-banner.jpeg";
import catDryBannerImg from "../assets/cat-dropdown-banner/dry-food-cats-banner.jpeg";
import catWetBannerImg from "../assets/cat-dropdown-banner/wet-food-cat-banner.jpeg";
import catKittenBannerImg from "../assets/cat-dropdown-banner/kitten-food-banner.jpeg";
import catMeatyTreatsBannerImg from "../assets/cat-dropdown-banner/meaty-cat-food.jpeg";
import catPrescriptionBannerImg from "../assets/cat-dropdown-banner/prescription-cat-food-banner.jpeg";
import catGrainFreeBannerImg from "../assets/cat-dropdown-banner/grain-free-food-cat-banner.jpeg";
import catCrunchyTreatsBannerImg from "../assets/cat-dropdown-banner/cat-crunchy-treats.jpeg";
import catCreamyTreatsBannerImg from "../assets/cat-dropdown-banner/creamy-treats.jpeg";

// Many category-specific banner files were not present in the repo.
// Use existing banners as sensible fallbacks to avoid build/import errors.
const dogDryBanner = dogDryBannerImg || dogBanner;
const dogBiscuitsBanner = dogBiscuitsImg || dogBanner;
const dogFreshBanner = dogFreshImg || dogBanner;
const grainFreeBanner = grainFreeImg || dogBanner;
const dogTreatsBanner = meatyTreatsImg || dogBanner;
const dogWetBanner = dogWetImg || dogBanner;
const dogVegBanner = dogVegetarianImg || dogBanner;
const dogPrescriptionBanner = dogPrescriptionImg || dogBanner;
const dogPuppyBanner = dogPuppyImg || dogBanner;
const dogPuppyTreatsBanner = dogPuppyTreatsImg || dogBanner;

const catDryBanner = catDryBannerImg || catBanner;
const catWetBanner = catWetBannerImg || catBanner;
const kittenBanner = catKittenBannerImg || catBanner;
const catMeatyTreatsBanner = catMeatyTreatsBannerImg || catBanner;
const catPrescriptionBanner = catPrescriptionBannerImg || catBanner;
const catGrainFreeBanner = catGrainFreeBannerImg || catBanner;
const catCrunchyTreatsBanner = catCrunchyTreatsBannerImg || catBanner;
const catCreamyTreatsBanner = catCreamyTreatsBannerImg || catBanner;

export const categoryBanners = {

  // ================= DOG FOOD =================

  "dogs-dry-food": {
    image: dogDryBanner,
    title: "Dry Dog Food",
    subtitle: "Crunchy healthy nutrition",
  },

  "dogs-wet-food": {
    image: dogWetBanner,
    title: "Wet Dog Food",
    subtitle: "Hydration packed meals",
  },

  "dogs-fresh-food": {
    image: dogFreshBanner,
    title: "Fresh Dog Food",
    subtitle: "Fresh and healthy meals",
  },

  "dogs-vegetarian-food": {
    image: dogVegBanner,
    title: "Vegetarian Dog Food",
    subtitle: "Plant powered nutrition",
  },

  "dogs-prescription-food": {
    image: dogPrescriptionBanner,
    title: "Prescription Dog Food",
    subtitle: "Vet recommended meals",
  },

  "dogs-puppy-food": {
    image: dogPuppyBanner,
    title: "Puppy Food",
    subtitle: "Healthy puppy growth",
  },

  "dogs-grain-free-food": {
    image: grainFreeBanner,
    title: "Grain Free Dog Food",
    subtitle: "Natural ingredient recipes",
  },

  // ================= DOG TREATS =================

  "dogs-biscuits-cookies": {
    image: dogBiscuitsBanner,
    title: "Dog Biscuits & Cookies",
    subtitle: "Tasty crunchy rewards",
  },

  "dogs-meaty-treats": {
    image: dogTreatsBanner,
    title: "Dog Meaty Treats",
    subtitle: "Protein rich treats",
  },

  "dogs-dental-treats": {
    image: dogPuppyTreatsBanner,
    title: "Dog Dental Treats",
    subtitle: "Healthy teeth & gums",
  },

  // ================= CAT FOOD =================

  "cats-dry-food": {
    image: catDryBanner,
    title: "Dry Cat Food",
    subtitle: "Healthy crunchy meals",
  },

  "cats-wet-food": {
    image: catWetBanner,
    title: "Wet Cat Food",
    subtitle: "Soft delicious meals",
  },

  "cats-kitten-food": {
    image: kittenBanner,
    title: "Kitten Food",
    subtitle: "Nutrition for growing kittens",
  },

  "cats-prescription-food": {
    image: catPrescriptionBanner,
    title: "Prescription Cat Food",
    subtitle: "Special care nutrition",
  },

  "cats-grain-free-food": {
    image: catGrainFreeBanner,
    title: "Grain Free Cat Food",
    subtitle: "Protein rich meals",
  },

  // ================= CAT TREATS =================

  "cats-meaty-treats": {
    image: catMeatyTreatsBanner,
    title: "Cat Meaty Treats",
    subtitle: "Delicious meat flavors",
  },

  "cats-crunchy-treats": {
    image: catCrunchyTreatsBanner,
    title: "Crunchy Cat Treats",
    subtitle: "Crispy healthy rewards",
  },

  "cats-creamy-treats": {
    image: catCreamyTreatsBanner,
    title: "Creamy Cat Treats",
    subtitle: "Soft creamy snacks",
  },
};