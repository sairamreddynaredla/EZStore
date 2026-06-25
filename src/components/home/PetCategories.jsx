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

        <p className="text-gray-500 mt-3">Find food collections for every pet</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-6 hide-scrollbar">
        {categories.map((item) => (
          <Link
            key={item.id}
            to={`/category/${item.slug}`}
            className="group bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 min-w-[300px] w-[300px] flex-shrink-0 md:w-auto md:min-w-0"
          >
            {/* IMAGE */}
            <div className="h-[300px] overflow-hidden bg-[#f7c66b]">
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
        ))}
      </div>
    </section>
  );
};

export default PetCategories;
