import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const BreedSlider = ({ title, breeds }) => {
  const swiperRef = useRef(null);

  return (

    <section className="mt-16 px-6">

      <div className="relative">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {title || "Explore Breeds"}
        </h2>

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
        spaceBetween={20}
        breakpoints={{

          320: {
            slidesPerView: 2,
          },

          640: {
            slidesPerView: 3,
          },

          1024: {
            slidesPerView: 5,
          },

        }}
        className="px-6"
      >

        {breeds.map((breed) => (

          <SwiperSlide key={breed.slug}>

            <Link to={`/breed/${breed.slug}`}>

              <div className="text-center cursor-pointer hover:scale-105 transition-all duration-300">

                <img
                  src={breed.banner?.image || breed.image}
                  alt={breed.banner?.title || breed.name}
                  className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-orange-200 shadow-lg"
                  loading="lazy"
                />

                <h3 className="mt-4 font-bold text-lg">

                  {breed.banner?.title || breed.name}

                </h3>

              </div>

            </Link>

          </SwiperSlide>

        ))}

      </Swiper>

    </section>

  );
};

export default BreedSlider;