import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const BreedSlider = ({ breeds }) => {
  const swiperRef = useRef(null);

  return (
    <section className="mt-16 px-6">
      <div className="relative">
        {/* title removed to avoid duplicate subtitle on category pages */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-xl w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
          aria-label="Scroll breeds left"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-xl w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
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
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="py-8"
      >
        {breeds.map((breed) => (
          <SwiperSlide key={breed.slug} className="flex justify-center">
            <Link to={`/breed/${breed.slug}`} className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-orange-200 shadow-sm flex items-center justify-center bg-white">
                <img
                  src={breed.banner?.image || breed.image}
                  alt={breed.banner?.title || breed.name}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-2 font-medium text-sm sm:text-sm md:text-base text-center max-w-[140px] truncate">{breed.banner?.title || breed.name}</h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BreedSlider;
