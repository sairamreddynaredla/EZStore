import { ChevronLeft, ChevronRight } from "lucide-react";
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
    title: "Dog",
    image: dogExclusiveImage,
    color: "bg-blue-100",
    slug: "dog",
  },
  {
    title: "Cat",
    image: catExclusiveImage,
    color: "bg-orange-100",
    slug: "cat",
  },
  {
    title: "Bird",
    image: birdExclusiveImage,
    color: "bg-yellow-100",
    slug: "bird",
  },
  {
    title: "Fish",
    image: fishExclusiveImage,
    color: "bg-pink-100",
    slug: "fish",
  },
  {
    title: "Rabbit",
    image: rabbitImage,
    color: "bg-green-100",
    slug: "rabbit",
  },
  {
    title: "Hamster",
    image: hamsterExclusiveImage,
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
      <div className="mt-12 relative">
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

        <div className="absolute inset-y-0 -left-4 md:-left-10 flex items-center">
          <button
            onClick={() => handleScroll("left")}
            className="bg-white border border-slate-200 shadow-md w-12 h-12 rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform duration-200"
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="absolute inset-y-0 -right-4 md:-right-10 flex items-center">
          <button
            onClick={() => handleScroll("right")}
            className="bg-white border border-slate-200 shadow-md w-12 h-12 rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform duration-200"
            aria-label="Scroll categories right"
          >
            <ChevronRight size={20} />
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

    navigate(`/category/${item.slug}`);
  };

  return (
    <PetCategoryCard
      title={item.title}
      image={item.image}
      backgroundColor={item.color}
      onClick={handleClick}
      active={selectedPet === item.slug}
      imageAlt={item.title}
    />
  );
}

export default Categories;
