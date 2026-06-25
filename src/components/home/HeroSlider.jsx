import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard } from "swiper/modules";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import dogBanner from "../../assets/banners/dog-banner.webp";
import heroBanner from "../../assets/banners/hero-banner.webp";
import offerBanner from "../../assets/banners/offer-banner.webp";
import trustBanner from "../../assets/banners/trust-banner.webp";

const heroBanners = [
  {
    image: dogBanner,
    title: "Healthy Dogs Start Here",
    offer: "Save Up to 25%",
    subtitle: "Grain-Free & Vet-Approved Brands",
    cta: "Shop Dog Food",
    bg: "#F7F0E3",
    accent: "#F59E0B",
    pet: "Dog",
  },
  {
    image: heroBanner,
    title: "Complete Pet Solutions",
    offer: "Premium Quality",
    subtitle: "Everything your pets need for a happy life",
    cta: "Shop Now",
    bg: "#F7F0E3",
    accent: "#0F172A",
    pet: "Hero",
  },
  {
    image: offerBanner,
    title: "Special Offers",
    offer: "Up to 30% OFF",
    subtitle: "on Selected Products",
    cta: "View Offers",
    bg: "#F7F0E3",
    accent: "#0369A1",
    pet: "Offers",
  },
  {
    image: trustBanner,
    title: "Trusted by Pet Parents",
    offer: "Quality Guaranteed",
    subtitle: "Premium products with expert recommendations",
    cta: "Learn More",
    bg: "#F7F0E3",
    accent: "#10B981",
    pet: "Trust",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCtaClick = (pet) => {
    if (pet === "Dog") {
      navigate("/category/dog-food");
    } else if (pet === "Hero") {
      navigate("/shop");
    } else if (pet === "Offers") {
      navigate("/best-sellers");
    } else if (pet === "Trust") {
      navigate("/brands");
    }
  };

  return (
    <section className="homepage-hero w-full h-56 sm:h-96 md:h-[500px] lg:h-[600px] m-0 mt-0 md:-mt-20 lg:-mt-24 mb-4">
        <div
          className="relative w-full h-full"
          style={{
            ["--hero-accent"]: heroBanners[activeIndex]?.accent || heroBanners[activeIndex]?.bg || "#F5A623",
          }}
        >
        <Swiper
          modules={[Autoplay, Pagination, Keyboard]}
          autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ el: ".homepage-hero .swiper-pagination", clickable: true }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          loop
          spaceBetween={0}
          slidesPerView={1}
          className="hero-swiper w-full h-full"
          style={{ width: "100%", height: "100%" }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex || 0)}
        >
        {heroBanners.map((banner, idx) => (
          <SwiperSlide key={idx} className="w-full h-full relative" style={{ width: "100%", height: "100%" }}>
            {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.pet + " banner"}
                className="absolute inset-0 w-full h-full object-contain sm:object-cover object-center"
              />
            
            {/* Split Layout: Text on Left (50%), Image on Right (50%) */}
            <div className="absolute inset-0 flex flex-row z-10">
              {/* Left Side: Text Content */}
              <div className="w-1/2 flex flex-col justify-center items-start p-2 sm:p-4 md:p-12">
                <div className="max-w-xs sm:max-w-sm md:max-w-md">
                  <h2 className={`font-bold text-[#8B4513] mb-0.5 sm:mb-2 md:mb-3 leading-tight whitespace-normal ${banner.pet === "Offers" ? "text-sm sm:text-lg md:text-4xl lg:text-5xl" : banner.pet === "Dog" ? "text-xs sm:text-sm md:text-3xl lg:text-4xl" : banner.pet === "Trust" ? "text-xs sm:text-sm md:text-2xl lg:text-3xl" : banner.pet === "Hero" ? "text-xs sm:text-sm md:text-2xl lg:text-3xl" : "text-sm sm:text-sm md:text-2xl lg:text-3xl"}`}>
                    {banner.title}
                  </h2>
                  <div className={`font-semibold text-[#F5A623] mb-0.5 md:mb-2 ${banner.pet === "Offers" ? "text-xs sm:text-base md:text-2xl lg:text-3xl" : banner.pet === "Dog" ? "text-xs md:text-sm lg:text-lg" : banner.pet === "Trust" ? "text-xs sm:text-xs md:text-lg lg:text-2xl" : "text-xs md:text-xs lg:text-lg"}`}>
                    {banner.offer}
                  </div>
                  <div className={`text-[#333333] mb-1 sm:mb-2 md:mb-4 max-w-sm ${banner.pet === "Trust" ? "text-[0.625rem] sm:text-[0.625rem] md:text-sm lg:text-sm" : "text-[0.625rem] sm:text-xs md:text-base"}`}>
                    {banner.subtitle}
                  </div>
                  <button 
                    onClick={() => handleCtaClick(banner.pet)}
                    className={`bg-[#F5A623] hover:bg-[#E59C0D] text-white rounded-lg px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 w-fit ${banner.pet === "Offers" ? "text-xs sm:text-xs md:text-lg lg:text-xl" : banner.pet === "Trust" ? "text-xs sm:text-xs md:text-base" : "text-xs sm:text-xs md:text-base"}`}>
                    {banner.cta}
                  </button>
                </div>
              </div>

              {/* Right Side: Image Space (visible on larger screens) */}
              <div className="hidden sm:flex w-1/2" />
            </div>
          </SwiperSlide>
        ))}
        </Swiper>

        {/* Explicit pagination container so Swiper mounts bullets here only (overlay on image) */}
        <div className="swiper-pagination absolute left-0 right-0 bottom-4 flex justify-center z-30" />

        {/* Right-side arrow controls hooked to Swiper (placed over image at same bottom as pagination) */}
        <div
          className="absolute bottom-2 sm:bottom-4 right-6 sm:right-[6rem] flex items-center gap-3 z-40 hero-arrow-controls"
        >
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white border border-[#8B4513] flex items-center justify-center text-[#8B4513] shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-4 sm:h-4 rotate-180" viewBox="0 0 20 20" fill="#8B4513">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => swiperRef.current?.slideNext()}
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white border border-[#8B4513] flex items-center justify-center text-[#8B4513] shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="#8B4513">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
export default HeroSlider;
