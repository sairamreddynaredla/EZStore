import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// IMPORT YOUR LOCAL BANNERS

import dogBanner from "../../assets/banners/dog-banner.jpeg";
import catBanner from "../../assets/banners/cat-banner.jpeg";
import birdBanner from "../../assets/banners/bird-banner.jpeg";
import heroBanner from "../../assets/banners/hero-banner.jpeg";
import offerBanner from "../../assets/banners/offer-banner.jpeg";
import trustBanner from "../../assets/banners/trust-banner.jpeg";
import smallPetsBanner from "../../assets/banners/small-pets.jpeg";
const banners = [
  {
    id: 1,
    title: "Real Nutrition. Real Happiness.",
    subtitle: "Premium Dog Food With Real Ingredients",
    image: dogBanner,
    bg: "bg-[#f5e6d3]",
    button: "Shop Dog Food",
  },
  {
    id: 2,
    title: "Real Ingredients. Real Difference.",
    subtitle: "Healthy & Balanced Nutrition For Cats",
    image: catBanner,
    bg: "bg-[#eef3df]",
    button: "Shop Cat Food",
  },
  {
    id: 3,
    title: "Better Ingredients. Brighter Days.",
    subtitle: "Natural Bird Food For Happy Birds",
    image: birdBanner,
    bg: "bg-[#edf5dc]",
    button: "Shop Bird Food",
  },
  {
    id: 4,
    title: "Welcome to EZStore!",
    subtitle: "Your one-stop shop for all pet needs.",
    image: heroBanner,
    bg: "bg-[#e0f7fa]",
    button: "Explore Now",
  },
  {
    id: 5,
    title: "Special Offer!",
    subtitle: "Don't miss our exclusive deals.",
    image: offerBanner,
    bg: "bg-[#fff3e0]",
    button: "View Offers",
  },
  {
    id: 6,
    title: "Trusted by Pet Lovers",
    subtitle: "Quality products and happy customers.",
    image: trustBanner,
    bg: "bg-[#f3e5f5]",
    button: "See Why",
  },
  {
    id: 7,
    title: "Small Pets, Big Love",
    subtitle: "Special care for your tiny friends.",
    image: smallPetsBanner,
    bg: "bg-[#e8f5e9]",
    button: "Shop Small Pets",
  }
];

const HeroBanner = () => {
  return (
    <div className="px-4 md:px-6 py-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={30}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="rounded-[35px]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`${banner.bg} rounded-[35px] overflow-hidden shadow-xl`}>
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover rounded-[35px]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;