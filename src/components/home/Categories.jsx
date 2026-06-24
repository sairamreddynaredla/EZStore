import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import dogExclusiveImage from "../../assets/Exclusive Category/dog exclusive.webp";
import catExclusiveImage from "../../assets/Exclusive Category/cat-exclusive.webp";
import birdExclusiveImage from "../../assets/Exclusive Category/bird-exclusive.webp";
import fishExclusiveImage from "../../assets/Exclusive Category/fish-exclusive.webp";
import hamsterExclusiveImage from "../../assets/Exclusive Category/hamster-exclusive.webp";
import rabbitImage from "../../assets/categories/rabbit.webp";

const dog = dogExclusiveImage;
const cat = catExclusiveImage;
const bird = birdExclusiveImage;
const fish = fishExclusiveImage;
const rabbit = rabbitImage;
const hamster = hamsterExclusiveImage;

const categories = [
  {
    title: "Dog",
    image: dog,
    color: "bg-blue-100",
    slug: "dog",
  },

  {
    title: "Cat",
    image: cat,
    color: "bg-orange-100",
    slug: "cat",
  },

  {
    title: "Bird",
    image: bird,
    color: "bg-yellow-100",
    slug: "bird",
  },

  {
    title: "Fish",
    image: fish,
    color: "bg-pink-100",
    slug: "fish",
  },

  {
    title: "Rabbit",
    image: rabbit,
    color: "bg-green-100",
    slug: "rabbit",
  },

  {
    title: "Hamster",
    image: hamster,
    color: "bg-red-100",
    slug: "hamster",
  },
];

function Categories({ selectedPet, setSelectedPet }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollDelta = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({
      left: scrollDelta,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-4 md:px-10 pt-4 md:pt-12 pb-10 bg-[#f9f9f9]">
      {/* HEADING */}
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-lg sm:text-4xl md:text-5xl font-bold text-center whitespace-nowrap sm:whitespace-normal">Browse by Exclusive Category</h2>
        <p className="text-gray-500 max-w-2xl text-center mt-1">
          Scroll through all pet categories with navigation arrows for faster browsing.
        </p>
      </div>

      {/* HORIZONTAL CATEGORY SCROLLER */}
      <div className="mt-12 relative overflow-visible">
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-4 px-2 md:px-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((item, index) => (
            <CategoryCard
              key={index}
              item={item}
              index={index}
              selectedPet={selectedPet}
              setSelectedPet={setSelectedPet}
            />
          ))}
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-[-28px] md:left-[-40px] flex items-center">
          <button
            onClick={() => handleScroll("left")}
            className="bg-white shadow-xl w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 z-50"
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={16} className="md:w-[20px]" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-[-28px] md:right-[-40px] flex items-center">
          <button
            onClick={() => handleScroll("right")}
            className="bg-white shadow-xl w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 z-50"
            aria-label="Scroll categories right"
          >
            <ChevronRight size={16} className="md:w-[20px]" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ item, selectedPet, setSelectedPet }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const pets = ["dog", "cat", "bird", "fish", "rabbit", "hamster"];
    if (setSelectedPet && pets.includes(item.slug)) {
      setSelectedPet(item.slug);
      return;
    }

    // fallback for other categories
    navigate(`/category/${item.slug}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`${item.color} rounded-[26px] p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:scale-105 duration-300 cursor-pointer shadow-sm hover:shadow-xl snap-center shrink-0 w-[140px] sm:w-[180px] md:w-[240px] ${selectedPet === item.slug ? "ring-4 ring-orange-200" : ""}`}
    >
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <h3 className="mt-3 sm:mt-4 font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
        {item.title}
      </h3>
    </button>
  );
}

export default Categories;
