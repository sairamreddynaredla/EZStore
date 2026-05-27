import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const heroBanners = [
  {
    image: "/src/assets/banners/tiny-friends-banner.png", // New banner image
    title: "Tiny Friends, Big Love",
    offer: "",
    subtitle: "Everything your little companions need for a happy and healthy life.",
    cta: "Explore Small Pets",
    bg: "#F7F0E3",
    pet: "Small Pets"
  },
  {
    image: "/src/assets/banners/cat-banner.jpeg",
    title: "Premium Cat Food",
    offer: "Flat 25% OFF",
    subtitle: "on Cat Food",
    cta: "Shop Now",
    bg: "#F7F0E3",
    pet: "Cat"
  },
  // Add more banners for other pets as needed
];

const HeroSlider = () => {
  return (
    <section className="px-6 py-4 bg-[#F7F0E3]">
      <div className="rounded-4xl overflow-hidden relative min-h-80 flex items-center justify-center">
        <Swiper
          autoplay={{ delay: 3500 }}
          loop
          spaceBetween={0}
          slidesPerView={1}
        >
          {heroBanners.map((banner, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-full flex flex-col md:flex-row items-center justify-between bg-cover bg-center"
                style={{ background: banner.bg }}
              >
                <div className="flex-1 flex flex-col justify-center p-8 md:p-16">
                  <h2 className="text-2xl md:text-4xl font-bold text-[#0D2B5C] mb-2">{banner.title}</h2>
                  <div className="text-lg md:text-2xl font-semibold text-[#F53B3B] mb-2">{banner.offer}</div>
                  <div className="text-base md:text-lg text-[#0D2B5C] mb-6">{banner.subtitle}</div>
                  <button className="bg-[#F53B3B] hover:bg-[#d32f2f] text-white rounded-xl px-8 py-3 font-bold text-lg shadow-lg transition-all">
                    {banner.cta}
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                  <img
                    src={banner.image}
                    alt={banner.pet + " food banner"}
                    className="max-h-64 w-auto rounded-3xl shadow-xl object-contain bg-white"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
export default HeroSlider;
