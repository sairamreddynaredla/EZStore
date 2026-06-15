import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

// IMPORT YOUR LOCAL BANNERS
import dogBanner from "../../assets/banners/dog-banner.jpeg";
import catBanner from "../../assets/banners/cat-banner.jpeg";
import trustBanner from "../../assets/banners/trust-banner.jpeg";
import heroBanner from "../../assets/banners/hero-banner.jpeg";
// removed two banners to keep only four hero slides

const banners = [
  {
    id: 1,
    image: dogBanner,
    bg: "bg-[#f5e6d3]",
    title: "Dog Essentials",
    tagline: "Quality food & care for your dog",
    ctaLabel: "Shop Dogs",
    ctaLink: "/dogs",
  },

  {
    id: 2,
    image: catBanner,
    bg: "bg-[#eef3df]",
    title: "Cat Care",
    tagline: "Premium nutrition for happy cats",
    ctaLabel: "Shop Cats",
    ctaLink: "/cats",
  },

  {
    id: 3,
    image: trustBanner,
    bg: "bg-[#edf5dc]",
    title: "Trusted Brands",
    tagline: "Shop verified, vet-recommended brands",
    ctaLabel: "Shop Brands",
    ctaLink: "/brands",
  },
  {
    id: 4,
    image: heroBanner,
    bg: "bg-[#fffaf6]",
    title: "New Arrivals",
    tagline: "Discover latest products and offers",
    ctaLabel: "Explore",
    ctaLink: "/",
  },
  // only first 4 banners are kept for cleaner hero
];

const HeroBanner = () => {
  return (
    <div className="w-full pb-6 overflow-visible">
      <div className="relative left-1/2 right-1/2 -translate-x-1/2 w-screen">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full hero-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`${banner.bg} w-full overflow-hidden`}>
              <div
                className="relative w-full flex items-center justify-center"
                style={{ height: 'min(600px, calc(100vh - 80px))', maxHeight: 'min(600px, calc(100vh - 80px))' }}
              >
                <img
                  src={banner.image}
                  alt={banner.title || 'banner'}
                  className="mx-auto h-full w-auto object-contain"
                  style={{ objectPosition: 'center' }}
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/6 pointer-events-none" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </div>
  );
};

export default HeroBanner;