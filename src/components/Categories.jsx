import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

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
    title: "Dog",
    image: dog,
    color: "bg-blue-100",
    slug: "dog-food",
  },
  {
    title: "Cat",
    image: cat,
    color: "bg-orange-100",
    slug: "cat-food",
  },
  {
    title: "Bird",
    image: bird,
    color: "bg-yellow-100",
    slug: "bird-food",
  },
  {
    title: "Fish",
    image: fish,
    color: "bg-pink-100",
    slug: "fish-food",
  },
  {
    title: "Rabbit",
    image: rabbit,
    color: "bg-green-100",
    slug: "rabbit-food",
  },
  {
    title: "Hamster",
    image: hamster,
    color: "bg-red-100",
    slug: "hamster-food",
  },
]


function Categories() {
  const scrollRef = useRef(null)

  return (

    <section className="py-20 bg-[#f8f8f8] overflow-hidden">

      {/* Heading */}
      <div className="text-center mb-16">

        <h2 className="text-5xl md:text-6xl font-bold">
          Browse by Exclusive Category
        </h2>

      </div>


      {/* Main Slider */}
      <div className="w-full flex flex-col items-center justify-center">
        {/* Slider Wrapper */}
        <div className="w-full max-w-[1400px] overflow-x-visible flex flex-col items-center">
          {/* Cards */}
          <div
            ref={scrollRef}
            className="
              flex
              items-center
              gap-6
              overflow-x-auto
              scroll-smooth
              px-0 md:px-20
              py-4
              snap-x
              snap-mandatory
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              justify-center
            "
            style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          >
            {categories.map((item, index) => (
              <Link
                key={index}
                to={`/category/${item.slug}`}
                className={`${item.color}
                  min-w-[220px]
                  max-w-[220px]
                  h-[340px]
                  rounded-[40px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  shadow-md
                  hover:shadow-2xl
                  hover:-translate-y-2
                  hover:scale-105
                  duration-300
                  snap-center
                  flex-shrink-0
                  transition-all
                  `}
              >
                {/* Centered Image */}
                <div className="flex items-center justify-center w-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-36 h-36 rounded-full object-cover border-[6px] border-white shadow-lg"
                  />
                </div>
                {/* Title (only pet name) */}
                <h3 className="mt-8 text-3xl font-bold text-gray-800">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
        {/* Arrows below cards, visually separated */}
        <div className="flex flex-row items-center justify-center gap-8 mt-12 mb-2 w-full">
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({
                  left: -240, // scroll by one card width
                  behavior: "smooth",
                });
              }
            }}
            className="bg-white shadow-xl w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={30} />
          </button>
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({
                  left: 240, // scroll by one card width
                  behavior: "smooth",
                });
              }
            }}
            className="bg-white shadow-xl w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Categories