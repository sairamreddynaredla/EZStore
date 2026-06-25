import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";

import { useState, useRef, useEffect } from "react";

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
];

const TestimonialsSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const mobileScrollerRef = useRef(null);

  const visibleTestimonials = testimonials.slice(startIndex, startIndex + 3);

  const nextSlide = () => {
    if (startIndex + 3 < testimonials.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Auto-scroll mobile scroller
  useEffect(() => {
    const el = mobileScrollerRef.current;
    if (!el) return;

    let autoId = null;
    const step = () => {
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
      }
    };

    autoId = setInterval(step, 3500);

    const pause = () => autoId && clearInterval(autoId);
    const resume = () => {
      if (autoId) clearInterval(autoId);
      autoId = setInterval(step, 3500);
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause);
    el.addEventListener("touchend", resume);

    return () => {
      clearInterval(autoId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [mobileScrollerRef]);

  return (
    <section className="py-32 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* TOP */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
          <div className="text-center md:text-left">
            <p className="text-red-500 uppercase tracking-[4px] font-semibold mb-4">
              Trusted By Pet Parents
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 mx-auto md:mx-0">
              What Customers Say About eZSTORE
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Thousands of pet parents trust eZSTORE for premium pet nutrition, fast delivery, and
              authentic products.
            </p>
          </div>

          {/* ARROWS (desktop only) */}
          <div className="hidden md:flex items-center gap-4 mt-8 md:mt-0">
            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-full bg-[#16325B] text-white flex items-center justify-center hover:shadow-xl transition"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>

            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:shadow-lg transition"
            >
              <ArrowRight size={20} className="text-[#16325B]" />
            </button>
          </div>
        </div>

        {/* TESTIMONIALS */}

        {/* Mobile: horizontal side-by-side scroller */}
        <div className="md:hidden mb-8">
          <div ref={mobileScrollerRef} className="flex gap-4 overflow-x-auto pb-6 px-4 hide-scrollbar">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="min-w-[320px] min-h-[360px] flex-shrink-0 bg-[#f8f8f8] rounded-[36px] p-10 hover:shadow-2xl transition duration-500 relative overflow-hidden flex flex-col justify-start"
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>

                        <p className="text-gray-500 text-sm">{item.city}</p>
                      </div>
                    </div>

                    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow">
                      <Quote size={20} className="text-red-500" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4 text-yellow-500">
                    {[...Array(item.rating)].map((_, index) => (
                      <Star key={index} size={18} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-gray-600 text-base leading-relaxed max-w-[260px] sm:max-w-full whitespace-normal break-words">"{item.review}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop / Tablet grid (keeps existing behavior and arrows) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {visibleTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#f8f8f8] rounded-[36px] p-8 hover:shadow-2xl transition duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>

                      <p className="text-gray-500">{item.city}</p>
                    </div>
                  </div>

                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow">
                    <Quote size={24} className="text-red-500" />
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-6 text-yellow-500">
                  {[...Array(item.rating)].map((_, index) => (
                    <Star key={index} size={20} fill="currentColor" />
                  ))}
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">"{item.review}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM STATS */}

        <div className="mt-20">
          {/* Mobile-only: 2x2 grid showing all four stat cards (same color) */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-3 px-3">
              <div className="bg-[#16325B] rounded-[20px] p-3 text-center">
                <h3 className="text-lg font-bold text-white">15K+</h3>
                <p className="text-gray-300 text-xs mt-1">Happy Customers</p>
              </div>

              <div className="bg-[#16325B] rounded-[20px] p-3 text-center">
                <h3 className="text-lg font-bold text-white">4.9★</h3>
                <p className="text-gray-300 text-xs mt-1">Customer Rating</p>
              </div>

              <div className="bg-[#16325B] rounded-[20px] p-3 text-center">
                <h3 className="text-lg font-bold text-white">500+</h3>
                <p className="text-gray-300 text-xs mt-1">Premium Products</p>
              </div>

              <div className="bg-[#16325B] rounded-[20px] p-3 text-center">
                <h3 className="text-lg font-bold text-white">24/7</h3>
                <p className="text-gray-300 text-xs mt-1">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Desktop/tablet: restore original 4-column grid (unchanged laptop look) */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#16325B] rounded-[30px] p-8 text-center">
              <h3 className="text-4xl font-bold text-white mb-3">15K+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>

            <div className="bg-[#16325B] rounded-[30px] p-8 text-center">
              <h3 className="text-4xl font-bold text-white mb-3">4.9★</h3>
              <p className="text-gray-300">Customer Rating</p>
            </div>

            <div className="bg-[#16325B] rounded-[30px] p-8 text-center">
              <h3 className="text-4xl font-bold text-white mb-3">500+</h3>
              <p className="text-gray-300">Premium Products</p>
            </div>

            <div className="bg-[#16325B] rounded-[30px] p-8 text-center">
              <h3 className="text-4xl font-bold text-white mb-3">24/7</h3>
              <p className="text-gray-300">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
