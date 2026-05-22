import { Link } from "react-router-dom";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import "swiper/css";

const BreedSlider = ({ breeds }) => {

  return (

    <section className="mt-16 px-6">

      <h2 className="text-3xl font-bold mb-10 text-center">

        Explore Breeds

      </h2>

      <Swiper
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
      >

        {breeds.map((breed) => (

          <SwiperSlide key={breed.slug}>

            <Link to={`/breed/${breed.slug}`}>

              <div className="text-center cursor-pointer hover:scale-105 transition-all duration-300">

                <img
                  src={breed.banner?.image || breed.image}
                  alt={breed.banner?.title || breed.name}
                  className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-orange-200 shadow-lg"
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