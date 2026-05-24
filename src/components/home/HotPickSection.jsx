import {
  Flame,
  Star,
  Heart,
} from "lucide-react"
import AddToCartButton from '../products/AddToCartButton'
import useCart from '../../hooks/usecart'

const hotPicks = [

  {
    id: 1,
    title: "Vet Recommended",
    subtitle: "Healthy nutrition for daily wellness",
    image: "/images/hotpicks/vet.png",
    products: 24,
  },

  {
    id: 2,
    title: "Puppy Essentials",
    subtitle: "Everything your puppy needs",
    image: "/images/hotpicks/puppy.png",
    products: 18,
  },

  {
    id: 3,
    title: "Indoor Cat Favorites",
    subtitle: "Comfort meals & care products",
    image: "/images/hotpicks/cat.png",
    products: 16,
  },

  {
    id: 4,
    title: "High Protein Picks",
    subtitle: "Boost strength & active lifestyle",
    image: "/images/hotpicks/protein.png",
    products: 30,
  },

]

const featuredProducts = [

  {
    id: 1,
    name: "Orijen Original Dog Food",
    image: "/images/products/dog-food-5.png",
    price: 129,
    oldPrice: 159,
    rating: 4.9,
  },

  {
    id: 2,
    name: "Farmina N&D Pumpkin Formula",
    image: "/images/products/cat-food-2.png",
    price: 94,
    oldPrice: 110,
    rating: 4.8,
  },

  {
    id: 3,
    name: "Royal Canin Mini Puppy Food",
    image: "/images/products/dog-food-1.png",
    price: 78,
    oldPrice: 99,
    rating: 5.0,
  },

]

const HotPickSection = () => {
  const { addToCart } = useCart()

  return (

    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* TOP */}

        <div className="mb-16 text-center">

          <div className="flex justify-center mb-4">

            <div className="bg-red-100 text-red-500 w-16 h-16 rounded-full flex items-center justify-center">

              <Flame size={30} />

            </div>

          </div>

          <p className="text-red-500 uppercase tracking-[4px] font-semibold mb-4">
            Curated For Pet Parents
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hot Picks For Your Pets
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Discover premium nutrition, care essentials, and trending
            products handpicked for every stage of your pet’s journey.
          </p>

        </div>

        {/* HOT PICK CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">

          {hotPicks.map((item) => (

            <div
              key={item.id}
              className="group bg-[#f8f8f8] rounded-[32px] overflow-hidden hover:shadow-2xl transition duration-500"
            >

              {/* IMAGE */}

              <div className="h-64 overflow-hidden">

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

              </div>

              {/* CONTENT */}

              <div className="p-8">

                <h3 className="text-2xl font-bold text-gray-900 mb-3">

                  {item.title}

                </h3>

                <p className="text-gray-600 leading-relaxed mb-5">

                  {item.subtitle}

                </p>

                <div className="flex items-center justify-between">

                  <span className="text-red-500 font-semibold">

                    {item.products}+ Products

                  </span>

                  <button className="bg-[#16325B] hover:bg-[#0d2240] text-white px-5 py-3 rounded-xl transition">

                    Explore

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* FEATURED PRODUCTS */}

        <div className="bg-[#16325B] rounded-[40px] p-10 md:p-14 overflow-hidden">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

            {/* LEFT */}

            <div className="max-w-xl">

              <p className="text-red-400 uppercase tracking-[4px] font-semibold mb-4">
                Featured Collection
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Nutrition Pets Will Love
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Premium quality food designed for healthy digestion,
                strong immunity, and happier pets.
              </p>

              <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition">

                Shop Collection

              </button>

            </div>

            {/* RIGHT PRODUCTS */}

            <div className="grid sm:grid-cols-3 gap-6 w-full">

              {featuredProducts.map((product) => (

                <div
                  key={product.id}
                  className="bg-white rounded-[28px] p-6 hover:scale-105 transition duration-300"
                >

                  {/* TOP */}

                  <div className="flex justify-between items-start mb-5">

                    <button className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">

                      <Heart size={18} />

                    </button>

                    <div className="flex items-center gap-1 text-yellow-500">

                      <Star
                        size={16}
                        fill="currentColor"
                      />

                      <span className="text-sm font-semibold text-gray-900">
                        {product.rating}
                      </span>

                    </div>

                  </div>

                  {/* IMAGE */}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-44 w-full object-contain mb-6"
                  />

                  {/* NAME */}

                  <h3 className="text-lg font-bold text-gray-900 leading-snug mb-4 min-h-[60px]">

                    {product.name}

                  </h3>

                  {/* PRICE */}

                  <div className="flex items-center gap-3 mb-6">

                    <span className="text-2xl font-bold text-black">

                      ${product.price}

                    </span>

                    <span className="text-gray-400 line-through">

                      ${product.oldPrice}

                    </span>

                  </div>

                  {/* BUTTON */}

                  <AddToCartButton
                    product={product}
                    isOutOfStock={false}
                    onAddToCart={(prod, quantity) => addToCart({ ...prod, quantity })}
                    quantity={1}
                  />

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </section>

  )
}

export default HotPickSection