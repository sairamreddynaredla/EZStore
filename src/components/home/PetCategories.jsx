import { Link } from "react-router-dom";

import dog from "../../assets/categories/dog.webp";
import cat from "../../assets/categories/cat.webp";
import bird from "../../assets/categories/bird.webp";
import fish from "../../assets/categories/fish.webp";
import rabbit from "../../assets/categories/rabbit.webp";
import hamster from "../../assets/categories/hamster.webp";

const categories = [
  {
    id: 1,
    name: "Dog Food",
    slug: "dog-food",
    image: dog,
  },

  {
    id: 2,
    name: "Cat Food",
    slug: "cat-food",
    image: cat,
  },

  {
    id: 3,
    name: "Fish Food",
    slug: "fish-food",
    image: fish,
  },

  {
    id: 4,
    name: "Rabbit Food",
    slug: "rabbit-food",
    image: rabbit,
  },

  {
    id: 5,
    name: "Bird Food",
    slug: "bird-food",
    image: bird,
  },

  {
    id: 6,
    name: "Hamster Food",
    slug: "hamster-food",
    image: hamster,
  },
];

const PetCategories = () => {
  return (
    <section className="px-6 md:px-10 py-20 bg-[#f8f6f2]">
      <div className="mb-10">
        <h2 className="text-xl sm:text-4xl font-bold whitespace-nowrap">Shop By Pet Food</h2>

        <p className="text-gray-500 mt-3">Browse by Exclusive Category</p>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-6 hide-scrollbar">
        {categories.map((item) => (
          <div key={item.id} className="shrink-0 min-w-[calc(50vw-1rem)] max-w-[calc(50vw-1rem)] snap-start sm:min-w-60 sm:max-w-none md:min-w-0 md:w-auto">
            <Link
              to={`/category/${item.slug}`}
              className="group bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full"
            >
              {/* IMAGE */}
              <div className="h-75 overflow-hidden bg-[#f7c66b]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* TEXT */}
              <div className="py-6 text-center">
                <h3 className="text-lg font-semibold">{item.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PetCategories;
