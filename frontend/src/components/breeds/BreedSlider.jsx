import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const BreedSlider = ({ breeds }) => {
  const swiperRef = useRef(null);

  return (
    <section className="mt-16 px-6">
      <div className="relative overflow-visible">
        {/* title removed to avoid duplicate subtitle on category pages */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-[-56px] top-1/2 -translate-y-1/2 z-50 rounded-full bg-white shadow-xl w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
          aria-label="Scroll breeds left"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-[-56px] top-1/2 -translate-y-1/2 z-50 rounded-full bg-white shadow-xl w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
          aria-label="Scroll breeds right"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={36}
        loop={false}
        observer={true}
        observeParents={true}
        breakpoints={{
          320: { slidesPerView: Math.min(2, breeds.length) },
          640: { slidesPerView: Math.min(3, breeds.length) },
          1024: { slidesPerView: Math.min(5, breeds.length) },
        }}
        className="py-8"
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
    </section>
  );
};

export default BreedSlider;
