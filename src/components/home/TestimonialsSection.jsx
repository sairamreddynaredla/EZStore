import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { useState } from "react"

const testimonials = [

  {
    id: 1,
    name: "Sarah Johnson",
    city: "California, USA",
    image: "https://i.pravatar.cc/150?img=1",
    review:
      "Absolutely loved the quality and packaging. My Golden Retriever instantly loved the food. The website experience also feels super premium.",
    rating: 5,
  },

  {
    id: 2,
    name: "David Miller",
    city: "New York, USA",
    image: "https://i.pravatar.cc/150?img=2",
    review:
      "Fast delivery, authentic products, and excellent customer support. eZSTORE genuinely feels like a trusted pet brand.",
    rating: 5,
  },

  {
    id: 3,
    name: "Emily Roberts",
    city: "Texas, USA",
    image: "https://i.pravatar.cc/150?img=3",
    review:
      "I ordered premium cat food and grooming essentials. Everything arrived perfectly packed and on time.",
    rating: 5,
  },

  {
    id: 4,
    name: "Michael Brown",
    city: "Florida, USA",
    image: "https://i.pravatar.cc/150?img=4",
    review:
      "The product recommendations are actually useful. It feels curated for pet parents instead of generic ecommerce.",
    rating: 5,
  },

]

const TestimonialsSection = () => {

  const [startIndex, setStartIndex] = useState(0)

  const visibleTestimonials = testimonials.slice(startIndex, startIndex + 3)

  const nextSlide = () => {

    if (startIndex + 3 < testimonials.length) {
      setStartIndex(startIndex + 1)
    }

  }

  const prevSlide = () => {

    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
    }

  }

  return (

    <section className="py-24 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* TOP */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">

          <div>

            <p className="text-red-500 uppercase tracking-[4px] font-semibold mb-4">

              Trusted By Pet Parents

            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">

              What Customers Say
              About eZSTORE

            </h2>

            <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">

              Thousands of pet parents trust eZSTORE for premium
              pet nutrition, fast delivery, and authentic products.

            </p>

          </div>

          {/* ARROWS */}

          <div className="flex items-center gap-4 mt-8 lg:mt-0">

            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:shadow-xl transition"
            >

              <ChevronLeft size={24} />

            </button>

            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-full bg-[#16325B] text-white flex items-center justify-center hover:bg-[#0d2240] transition"
            >

              <ChevronRight size={24} />

            </button>

          </div>

        </div>

        {/* TESTIMONIALS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {visibleTestimonials.map((item) => (

            <div
              key={item.id}
              className="bg-[#f8f8f8] rounded-[36px] p-8 hover:shadow-2xl transition duration-500 relative overflow-hidden"
            >

              {/* QUOTE ICON */}

              <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 rounded-full blur-2xl"></div>

              <div className="relative z-10">

                {/* TOP */}

                <div className="flex items-center justify-between mb-8">

                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>

                      <h3 className="text-xl font-bold text-gray-900">

                        {item.name}

                      </h3>

                      <p className="text-gray-500">

                        {item.city}

                      </p>

                    </div>

                  </div>

                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow">

                    <Quote
                      size={24}
                      className="text-red-500"
                    />

                  </div>

                </div>

                {/* STARS */}

                <div className="flex items-center gap-1 mb-6 text-yellow-500">

                  {[...Array(item.rating)].map((_, index) => (

                    <Star
                      key={index}
                      size={20}
                      fill="currentColor"
                    />

                  ))}

                </div>

                {/* REVIEW */}

                <p className="text-gray-600 text-lg leading-relaxed">

                  "{item.review}"

                </p>

              </div>

            </div>

          ))}

        </div>

        {/* BOTTOM STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">

          <div className="bg-[#16325B] rounded-[30px] p-8 text-center">

            <h3 className="text-4xl font-bold text-white mb-3">
              15K+
            </h3>

            <p className="text-gray-300">
              Happy Customers
            </p>

          </div>

          <div className="bg-[#16325B] rounded-[30px] p-8 text-center">

            <h3 className="text-4xl font-bold text-white mb-3">
              4.9★
            </h3>

            <p className="text-gray-300">
              Customer Rating
            </p>

          </div>

          <div className="bg-[#16325B] rounded-[30px] p-8 text-center">

            <h3 className="text-4xl font-bold text-white mb-3">
              500+
            </h3>

            <p className="text-gray-300">
              Premium Products
            </p>

          </div>

          <div className="bg-[#16325B] rounded-[30px] p-8 text-center">

            <h3 className="text-4xl font-bold text-white mb-3">
              24/7
            </h3>

            <p className="text-gray-300">
              Customer Support
            </p>

          </div>

        </div>

      </div>

    </section>

  )
}

export default TestimonialsSection