import Navbar from "../../components/Navbar";

import { useState } from "react";
import HeroSlider from "../../components/home/HeroSlider";
import SearchBelowHero from "../../components/home/SearchBelowHero";
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

      {/* Mobile-only search above hero banners */}
      <SearchBelowHero />

      {/* HERO SLIDER - 4 Rotating Banners */}
      <HeroSlider />

      {/* SHOP BY PET FOOD - mid page section */}
      <PetCategories selectedPet={selectedPet} setSelectedPet={setSelectedPet} />

      {/* EXPLORE. PICK. PAMPER. - Food categories */}
      <FoodCategorySection />

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
