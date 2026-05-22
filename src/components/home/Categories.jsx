import { Link } from "react-router-dom"

const dog =
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&auto=format&fit=crop"

const cat =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop"

const bird =
  "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&auto=format&fit=crop"

const fish =
  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&auto=format&fit=crop"

const rabbit =
  "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&auto=format&fit=crop"

const hamster =
  "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&auto=format&fit=crop"

const categories = [
  {
    title: "Dog Food",
    image: dog,
    color: "bg-blue-100",
    link: "/breeds/dog",
  },

  {
    title: "Cat Food",
    image: cat,
    color: "bg-orange-100",
    link: "/breeds/cat",
  },

  {
    title: "Bird Food",
    image: bird,
    color: "bg-yellow-100",
    link: "/breeds/bird",
  },

  {
    title: "Fish Food",
    image: fish,
    color: "bg-pink-100",
    link: "/breeds/fish",
  },

  {
    title: "Rabbit Food",
    image: rabbit,
    color: "bg-green-100",
    link: "/breeds/rabbit",
  },

  {
    title: "Hamster Food",
    image: hamster,
    color: "bg-red-100",
    link: "/breeds/hamster",
  },
]

function Categories() {

  return (

    <section className="px-6 md:px-10 py-20 bg-[#f9f9f9]">

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">

        Browse by Exclusive Category

      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

        {categories.map((item, index) => (

          <Link
            to={item.link}
            key={index}
            className={`${item.color} rounded-[35px] p-8 text-center hover:scale-105 duration-300 cursor-pointer shadow-sm hover:shadow-xl`}
          >

            {/* IMAGE */}
            <div className="w-32 h-32 md:w-36 md:h-36 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />

            </div>

            {/* TITLE */}
            <h3 className="mt-6 font-bold text-xl md:text-2xl text-gray-900">

              {item.title}

            </h3>

          </Link>

        ))}

      </div>

    </section>

  )
}

export default Categories