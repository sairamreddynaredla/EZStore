import { Link } from "react-router-dom"

import { Star } from "lucide-react"

const ProductCard = ({ product }) => {

  // GET FIRST VARIANT

  const firstVariant = product.variants?.[0]

  const currentPrice = firstVariant?.price || 0

  const originalPrice = firstVariant?.originalPrice || 0

  // DISCOUNT %

  const discountPercentage =
    originalPrice > 0
      ? Math.round(
          ((originalPrice - currentPrice) /
            originalPrice) *
            100
        )
      : 0

  return (

   <Link
  to={`/product/${product.id}`}
  className="group w-full bg-white border border-gray-200 rounded-[28px] overflow-hidden hover:shadow-2xl transition duration-300"
>

      {/* IMAGE */}

      <div className="relative bg-[#fafafa] h-[260px] flex items-center justify-center overflow-hidden">

        {/* BADGES */}

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">

          {product.sales > 200 && (

            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">

              Bestseller

            </span>

          )}

          {product.stock < 10 && (

            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">

              Low Stock

            </span>

          )}

        </div>

        {/* DISCOUNT */}

        {originalPrice > 0 && (

          <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">

            {discountPercentage}% OFF

          </div>

        )}

        {/* PRODUCT IMAGE */}

        <img

          src={product.image || product.images?.[0]}

          alt={product.name}

          className="w-full h-full object-contain p-6 group-hover:scale-105 transition duration-300"

        />

      </div>

      {/* CONTENT */}

      <div className="p-5">

        {/* BRAND */}

        <p className="text-sm uppercase tracking-wide text-gray-400 font-medium mb-2">

          {product.brand}

        </p>

        {/* PRODUCT NAME */}

        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[56px]">

          {product.name}

        </h3>

        {/* RATING */}

        <div className="flex items-center gap-2 mt-4">

          <div className="flex items-center gap-1">

            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

            <span className="font-semibold text-sm">

              {product.rating}

            </span>

          </div>

          <span className="text-gray-400 text-sm">

            ({product.reviews})

          </span>

        </div>

        {/* PRICE */}

        <div className="mt-5 flex items-end gap-3">

          <p className="text-2xl font-bold text-black">

            ${currentPrice.toFixed(2)}

          </p>

          {originalPrice > 0 && (

            <p className="text-gray-400 line-through text-lg">

              ${originalPrice.toFixed(2)}

            </p>

          )}

        </div>

      </div>

    </Link>

  )
}

export default ProductCard