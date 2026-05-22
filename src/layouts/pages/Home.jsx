import Navbar from "../../components/Navbar"

import HeroBanner from "../../components/home/HeroBanner"

import Categories from "../../components/home/Categories"

import PetCategories from "../../components/home/PetCategories"

import PetBrands from "../../components/home/PetBrands"

import BestSellerSection from "../../components/home/BestSellerSection"

import BlogSection from "../../components/home/BlogSection"

import TrustSection from "../../components/home/TrustSection"

import NewsLetterSection from "../../components/home/NewsLetterSection"

import TestimonialsSection from "../../components/home/TestimonialsSection"

import Footer from "../../components/Footer"

import BreedSlider from "../../components/breeds/BreedSlider"

import breedData from "../../data/breeds"

const Home = () => {

  // ================= FILTER BREEDS =================

  const dogBreeds = breedData.filter(
    (item) => item.category === "dog"
  )

  const catBreeds = breedData.filter(
    (item) => item.category === "cat"
  )

  const birdBreeds = breedData.filter(
    (item) => item.category === "bird"
  )

  const rabbitBreeds = breedData.filter(
    (item) => item.category === "rabbit"
  )

  const fishBreeds = breedData.filter(
    (item) => item.category === "fish"
  )

  const hamsterBreeds = breedData.filter(
    (item) => item.category === "hamster"
  )

  return (

    <div className="bg-[#f8f8f8] min-h-screen overflow-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <HeroBanner />

      {/* SHOP CATEGORIES */}
      <Categories />

      {/* PET TYPES */}
      <PetCategories />

      {/* PREMIUM BRANDS */}
      <PetBrands />

      {/* BEST SELLERS */}
      <BestSellerSection />



      {/* BLOG SECTION */}
      <BlogSection />

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