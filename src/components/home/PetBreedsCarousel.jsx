import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const PetBreedsCarousel = ({ breeds, title }) => {
  const swiperRef = useRef(null);

  if (!breeds || breeds.length === 0) return null;

  return (
    <section className="mt-8 px-6 md:px-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>

      <div className="relative">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-xl w-8 h-8 md:w-12 md:h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
          aria-label="Scroll breeds left"
        >
          <ChevronLeft size={16} className="md:w-[20px]" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-xl w-8 h-8 md:w-12 md:h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
          aria-label="Scroll breeds right"
        >
          <ChevronRight size={16} className="md:w-[20px]" />
        </button>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={12}
          loop={false}
          observer={true}
          observeParents={true}
          breakpoints={{
            320: { slidesPerView: Math.min(2, breeds.length) },
            640: { slidesPerView: Math.min(3, breeds.length), spaceBetween: 16 },
            1024: { slidesPerView: Math.min(5, breeds.length), spaceBetween: 20 },
          }}
          className="py-4 md:py-6 px-10 md:px-0"
        >
          {breeds.map((breed) => {
            const src =
              (breed.banner && breed.banner.image) ||
              breed.image ||
              breed.heroImage ||
              (breed.overview && breed.overview.image) ||
              "";
            const rawTitle = (breed.banner && breed.banner.title) || breed.name;
            const title = rawTitle.replace(/^meet the\s+/i, "");
            return (
              <SwiperSlide key={breed.slug} className="flex justify-center">
                <Link to={`/breed/${breed.slug}`} className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-orange-200 shadow-sm flex items-center justify-center bg-white">
                    {src ? (
                      <img
                        src={src}
                        alt={title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 font-medium text-sm sm:text-sm md:text-base text-center max-w-[140px] truncate">
                    {title}
                  </h3>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default PetBreedsCarousel;
