import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
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
    pet: "Dog",
  },
  {
    image: heroBanner,
    title: "Complete Pet Solutions",
    offer: "Premium Quality",
    subtitle: "Everything your pets need for a happy life",
    cta: "Shop Now",
    bg: "#F7F0E3",
    pet: "Hero",
  },
  {
    image: offerBanner,
    title: "Special Offers",
    offer: "Up to 30% OFF",
    subtitle: "on Selected Products",
    cta: "View Offers",
    bg: "#F7F0E3",
    pet: "Offers",
  },
  {
    image: trustBanner,
    title: "Trusted by Pet Parents",
    offer: "Quality Guaranteed",
    subtitle: "Premium products with expert recommendations",
    cta: "Learn More",
    bg: "#F7F0E3",
    pet: "Trust",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();

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
    <section className="w-full h-56 sm:h-96 md:h-[500px] lg:h-[600px] m-0 -mt-12 mb-4">
      <Swiper 
        modules={[Autoplay]} 
        autoplay={{ delay: 3500 }} 
        loop 
        spaceBetween={0} 
        slidesPerView={1} 
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      >
        {heroBanners.map((banner, idx) => (
          <SwiperSlide key={idx} className="w-full h-full relative" style={{ width: "100%", height: "100%" }}>
            {/* Background Image */}
            <img
              src={banner.image}
              alt={banner.pet + " banner"}
              className="absolute inset-0 w-full h-full object-contain"
            />
            
            {/* Split Layout: Text on Left (50%), Image on Right (50%) */}
            <div className="absolute inset-0 flex flex-row z-10">
              {/* Left Side: Text Content */}
              <div className="w-1/2 flex flex-col justify-center items-start p-2 sm:p-4 md:p-12">
                <div className="max-w-xs sm:max-w-sm md:max-w-md">
                  <h2 className={`font-bold text-[#8B4513] mb-0.5 sm:mb-2 md:mb-3 leading-tight truncate ${banner.pet === "Offers" ? "text-sm sm:text-lg md:text-4xl lg:text-5xl" : banner.pet === "Dog" ? "text-xs sm:text-sm md:text-3xl lg:text-4xl" : banner.pet === "Trust" ? "text-xs sm:text-sm md:text-2xl lg:text-3xl" : banner.pet === "Hero" ? "text-xs sm:text-sm md:text-2xl lg:text-3xl" : "text-sm sm:text-sm md:text-2xl lg:text-3xl"}`}>
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
    </section>
  );
};
export default HeroSlider;
