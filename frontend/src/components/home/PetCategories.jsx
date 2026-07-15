import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import dogExclusiveImage from "../../assets/Exclusive Category/dog exclusive.webp";
import catExclusiveImage from "../../assets/Exclusive Category/cat-exclusive.webp";
import birdExclusiveImage from "../../assets/Exclusive Category/bird-exclusive.webp";
import fishExclusiveImage from "../../assets/Exclusive Category/fish-exclusive.webp";
import hamsterExclusiveImage from "../../assets/Exclusive Category/hamster-exclusive.webp";
import rabbitImage from "../../assets/categories/rabbit.webp";
import PetCategoryCard from "./PetCategoryCard";

const categories = [
  {
    title: "Dog Food",
    image: dogExclusiveImage,
    color: "bg-blue-100",
    slug: "dog",
  },
  {
    title: "Cat Food",
    image: catExclusiveImage,
    color: "bg-orange-100",
    slug: "cat",
  },
  {
    title: "Bird Food",
    image: birdExclusiveImage,
    color: "bg-yellow-100",
    slug: "bird",
  },
  {
    title: "Fish Food",
    image: fishExclusiveImage,
    color: "bg-pink-100",
    slug: "fish",
  },
  {
    title: "Rabbit Food",
    image: rabbitImage,
    color: "bg-green-100",
    slug: "rabbit",
  },
  {
    title: "Hamster Food",
    image: hamsterExclusiveImage,
    color: "bg-red-100",
    slug: "hamster",
  },
];

const PetCategories = ({ selectedPet, setSelectedPet }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollDelta = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({
      left: scrollDelta,
      behavior: "smooth",
    });
  };

  const handleCardClick = (slug) => {
    if (setSelectedPet) {
      setSelectedPet(slug);
    }

    navigate(`/category/${slug}-food`);
  };

  return (
    <section className="px-4 md:px-10 pt-4 md:pt-12 pb-10 bg-[#f8f6f2]">
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-lg sm:text-4xl md:text-5xl font-bold text-center whitespace-nowrap sm:whitespace-normal">
          Shop By Pet Food
        </h2>
        <p className="text-gray-500 max-w-2xl text-center mt-1">
          Browse by Exclusive Category
        </p>
      </div>

      <div className="mt-12 relative">
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-4 px-2 md:px-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((item) => (
            <PetCategoryCard
              key={item.slug}
              title={item.title}
              image={item.image}
              backgroundColor={item.color}
              onClick={() => handleCardClick(item.slug)}
              active={selectedPet === item.slug}
              imageAlt={item.title}
            />
          ))}
        </div>

        <div className="absolute inset-y-0 -left-4 md:-left-10 flex items-center">
          <button
            onClick={() => handleScroll("left")}
            className="bg-white border border-slate-200 shadow-md w-12 h-12 rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform duration-200"
            aria-label="Scroll pet categories left"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="absolute inset-y-0 -right-4 md:-right-10 flex items-center">
          <button
            onClick={() => handleScroll("right")}
            className="bg-white border border-slate-200 shadow-md w-12 h-12 rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform duration-200"
            aria-label="Scroll pet categories right"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PetCategories;
