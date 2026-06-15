import Navbar from "../../components/Navbar"

import HeroBanner from "../../components/home/HeroBanner"

import Categories from "../../components/home/Categories"

import FoodCategorySection from "../../components/home/FoodCategorySection"

import PetCategories from "../../components/home/PetCategories"

import BrandBanners from "../../components/home/BrandBanners"
import PetBrands from "../../components/home/PetBrands"
import RabbitProducts from "../../components/home/RabbitProducts"

import BestSellerSection from "../../components/home/BestSellerSection"


import TrustSection from "../../components/home/TrustSection"

import NewsLetterSection from "../../components/home/NewsLetterSection"

import TestimonialsSection from "../../components/home/TestimonialsSection"

import Footer from "../../components/Footer"

const Home = () => {

  return (

    <div className="bg-[#f8f8f8] min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <HeroBanner />

      {/* SHOP CATEGORIES */}
      <Categories />

      {/* FOOD CATEGORIES - Wet / Dry / Puppy & Kitten / Prescription */}
      <FoodCategorySection />

      {/* RABBIT PRODUCTS */}
      <RabbitProducts />

      {/* PET TYPES */}
      <PetCategories />

      {/* PREMIUM BRANDS */}
      <PetBrands />
      <BrandBanners />
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

  )
}

export default Home