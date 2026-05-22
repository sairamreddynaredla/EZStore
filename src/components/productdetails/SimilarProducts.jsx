import { Link } from "react-router-dom"

const SimilarProducts = ({ products }) => {

  return (

    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">

      {products.map((product) => {

        const selectedVariant = product.variants?.[0]

        return (

          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="
              group
              bg-white
              rounded-[20px]
              overflow-hidden
              border
              border-gray-200
              hover:shadow-lg
              transition-all
              duration-300
            "
          >

            {/* IMAGE */}

            <div className="relative bg-[#fafafa] h-[220px] p-4 flex items-center justify-center overflow-hidden">

              {/* BADGE */}

              <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">

                SALE

              </div>

              <img
                src={product.image || product.images?.[0]}
                alt={product.name}
                className="
                  w-full
                  h-full
                  object-contain
                  group-hover:scale-105
                  transition
                  duration-300
                "
              />

            </div>

            {/* CONTENT */}

            <div className="p-4">

              {/* BRAND */}

              <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">

                {product.brand}

              </p>

              {/* NAME */}

              <h2 className="font-semibold text-sm text-black line-clamp-2 min-h-[42px]">

                {product.name}

              </h2>

              {/* RATING */}

              <div className="flex items-center gap-2 mt-2 text-sm">

                <span className="text-yellow-500">

                  ★

                </span>

                <span className="font-medium">

                  {product.rating}

                </span>

                <span className="text-gray-400">

                  ({product.reviews})

                </span>

              </div>

              {/* PRICE */}

              <div className="flex items-center gap-2 mt-3">

                <p className="text-lg font-bold text-black">

                  ${selectedVariant?.price}

                </p>

                <span className="text-sm text-gray-400 line-through">

                  ${selectedVariant?.originalPrice}

                </span>

              </div>

              {/* BUTTON */}

              <button
                className="
                  w-full
                  mt-4
                  bg-black
                  hover:bg-gray-900
                  text-white
                  py-2.5
                  rounded-lg
                  text-sm
                  font-semibold
                  transition
                "
              >

                Add To Cart

              </button>

            </div>

          </Link>

        )
      })}

    </div>

  )
}

export default SimilarProducts