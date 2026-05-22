import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const banners = [
  {
    id: 1,
    title: "Nutritious Meals For Your Dogs",
    subtitle: "Up to 35% OFF on Premium Dog Food",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop",
    bg: "bg-[#f5e6d3]",
    button: "Shop Dog Food",
  },

  {
    id: 2,
    title: "Healthy Food For Your Cats",
    subtitle: "Real Ingredients. No Fillers.",
    image:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1600&auto=format&fit=crop",
    bg: "bg-[#f3efc7]",
    button: "Shop Cat Food",
  },

  {
    id: 3,
    title: "Bird Food & Accessories",
    subtitle: "Keep Your Birds Happy & Active",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1600&auto=format&fit=crop",
    bg: "bg-[#dcecf7]",
    button: "Shop Bird Care",
  },

  {
    id: 4,
    title: "Fresh Food For Rabbits",
    subtitle: "Healthy Treats & Nutrition",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1600&auto=format&fit=crop",
    bg: "bg-[#dff3df]",
    button: "Shop Rabbit Food",
  },

  {
    id: 5,
    title: "Aquarium Essentials",
    subtitle: "Food & Care For Beautiful Fish",
    image:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1600&auto=format&fit=crop",
    bg: "bg-[#d8e8ff]",
    button: "Shop Fish Care",
  },

  {
    id: 6,
    title: "Hamster Food & Toys",
    subtitle: "Cute Essentials For Small Pets",
    image:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=1600&auto=format&fit=crop",
    bg: "bg-[#ffe4ec]",
    button: "Shop Small Pets",
  },
]

const HeroBanner = () => {
  return (
    <div className="px-4 md:px-6 py-6">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={30}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="rounded-[35px]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>

            <div
              className={`${banner.bg} rounded-[35px] overflow-hidden`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[500px]">

                {/* LEFT CONTENT */}
                <div className="p-10 md:p-16">

                  <span className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold">
                    SALE OFFER
                  </span>

                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-6 text-gray-900">
                    {banner.title}
                  </h1>

                  <p className="text-lg text-gray-700 mt-5">
                    {banner.subtitle}
                  </p>

                  <button className="mt-8 bg-red-600 hover:bg-red-700 transition-all text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg">
                    {banner.button}
                  </button>

                </div>

                {/* RIGHT IMAGE */}
                <div className="h-full">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-[500px] object-cover"
                  />
                </div>

              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  )
}

export default HeroBanner