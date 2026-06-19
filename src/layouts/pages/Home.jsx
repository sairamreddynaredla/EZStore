import Navbar from "../../components/Navbar";

import { useState } from "react";
import HeroSlider from "../../components/home/HeroSlider";
import Categories from "../../components/home/Categories";
import PetBreedsCarousel from "../../components/home/PetBreedsCarousel";
import petData from "../../data/petData";

import FoodCategorySection from "../../components/home/FoodCategorySection";

import PetCategories from "../../components/home/PetCategories";

import PetBrands from "../../components/home/PetBrands";
import BestSellerSection from "../../components/home/BestSellerSection";

import TrustSection from "../../components/home/TrustSection";

import NewsLetterSection from "../../components/home/NewsLetterSection";

import TestimonialsSection from "../../components/home/TestimonialsSection";

import Footer from "../../components/Footer";

const Home = () => {
  const [selectedPet, setSelectedPet] = useState("dog");

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SLIDER - 4 Rotating Banners */}
      <HeroSlider />

      {/* SHOP CATEGORIES */}
      <Categories selectedPet={selectedPet} setSelectedPet={setSelectedPet} />

      {/* PET BREEDS CAROUSEL (no hero banners) */}
      <PetBreedsCarousel
        breeds={petData[selectedPet]?.breeds}
        title={`Popular ${selectedPet.charAt(0).toUpperCase() + selectedPet.slice(1)} Breeds`}
      />

      {/* FOOD CATEGORIES - Wet / Dry / Puppy & Kitten / Prescription */}
      <FoodCategorySection />

      {/* PET TYPES */}
      <PetCategories />

      {/* PREMIUM BRANDS */}
      <PetBrands />
      <BestSellerSection />

      {/* BLOG SECTION removed */}

      {/* TRUST SECTION */}
      <TrustSection />

      {/* NEWSLETTER */}
      <NewsLetterSection />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
