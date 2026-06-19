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
    <section className="w-full relative" style={{ height: "clamp(300px, 60vh, 75vh)" }}>
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
              className="w-full h-full object-cover object-center absolute inset-0"
            />
            
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center md:justify-start items-start pt-8 md:pt-12 lg:pt-20">
              <div className="w-full max-w-4xl px-4 sm:px-6 md:px-12 lg:px-20">
                <div className="max-w-lg">
                  <h2 className={`font-bold text-[#8B4513] mb-2 md:mb-3 leading-tight ${banner.pet === "Offers" ? "text-xl sm:text-3xl md:text-4xl lg:text-5xl" : banner.pet === "Dog" ? "text-lg sm:text-2xl md:text-3xl lg:text-4xl" : "text-base sm:text-xl md:text-2xl lg:text-3xl"}`}>
                    {banner.title}
                  </h2>
                  <div className={`font-semibold text-[#F5A623] mb-1 md:mb-2 ${banner.pet === "Offers" ? "text-base sm:text-xl md:text-2xl lg:text-3xl" : banner.pet === "Dog" ? "text-sm md:text-base lg:text-lg" : "text-xs md:text-base lg:text-lg"}`}>
                    {banner.offer}
                  </div>
                  <div className={`text-[#333333] mb-3 md:mb-4 max-w-sm ${banner.pet === "Offers" ? "text-xs sm:text-base md:text-lg lg:text-xl" : "text-xs sm:text-sm md:text-base"}`}>
                    {banner.subtitle}
                  </div>
                  <button 
                    onClick={() => handleCtaClick(banner.pet)}
                    className={`bg-[#F5A623] hover:bg-[#E59C0D] text-white rounded-lg px-4 sm:px-6 py-2 md:py-3 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${banner.pet === "Offers" ? "text-xs sm:text-base md:text-lg lg:text-xl" : "text-xs sm:text-sm md:text-base"}`}>
                    {banner.cta}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
export default HeroSlider;
