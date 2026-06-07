import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// IMPORT YOUR LOCAL BANNERS
import dogBanner from "../../assets/banners/dog-banner.jpeg";
import catBanner from "../../assets/banners/cat-banner.jpeg";
import trustBanner from "../../assets/banners/trust-banner.jpeg";
import heroBanner from "../../assets/banners/hero-banner.jpeg";
import smallPetsBanner from "../../assets/banners/small-pets.jpeg";
import offerBanner from "../../assets/banners/offer-banner.jpeg";

const banners = [
  {
    id: 1,
    image: dogBanner,
    bg: "bg-[#f5e6d3]",
  },

  {
    id: 2,
    image: catBanner,
    bg: "bg-[#eef3df]",
  },

  {
    id: 3,
    image: trustBanner,
    bg: "bg-[#edf5dc]",
  },
  {
    id: 4,
    image: heroBanner,
    bg: "bg-[#fffaf6]",
  },
  {
    id: 5,
    image: smallPetsBanner,
    bg: "bg-[#f7fdfa]",
  },
  {
    id: 6,
    image: offerBanner,
    bg: "bg-[#f0f7ff]",
  },
];

const HeroBanner = () => {
  return (
    <div className="w-full pb-6">
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
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className={`${banner.bg} overflow-hidden shadow-xl w-full`}
            >
              <div className="relative flex items-center justify-center min-h-[240px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[460px] bg-white">
                
                {/* Banner Image */}
                <img
                  src={banner.image}
                  alt="banner"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                  width="1600"
                  height="460"
                  fetchPriority="low"
                />

                {/* Optional Dark Overlay */}
                <div className="absolute inset-0 bg-black/10" />
                
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;