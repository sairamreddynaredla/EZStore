import { Link } from 'react-router-dom'

import {
  FaHeart,
  FaShoppingCart,
} from 'react-icons/fa'

import { useCart } from '../../context/CartContext'

const ProductGrid = ({ products }) => {

  const { addToCart } = useCart()

  return (

    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4'>

      {products.map((product) => {

        const activeVariant =
          product?.variants?.[0]

        const discountPercentage =
          Math.round(

            (
              (
                activeVariant.originalPrice -
                activeVariant.price
              )
              /
              activeVariant.originalPrice
            ) * 100
          )

        return (

          <div
            key={product.id}
            className='
              group
              bg-white
              rounded-[22px]
              overflow-hidden
              border
              border-gray-200
              hover:shadow-xl
              transition-all
              duration-300
              flex
              flex-col
            '
          >

            {/* IMAGE */}

            <div className='relative bg-[#fafafa] h-[220px] overflow-hidden p-4'>

              {/* DISCOUNT */}

              <div className='absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-bold'>

                {discountPercentage}% OFF

              </div>

              {/* WISHLIST */}

              <button
                className='
                  absolute
                  top-3
                  right-3
                  z-10
                  bg-white
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  hover:bg-red-500
                  hover:text-white
                  transition-all
                '
              >

                <FaHeart size={12} />

              </button>

              {/* IMAGE */}

              <Link
                to={`/product/${product.id}`}
                className='block w-full h-full'
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className='
                    w-full
                    h-full
                    object-contain
                    group-hover:scale-105
                    transition-transform
                    duration-300
                  '
                />

              </Link>

            </div>

            {/* CONTENT */}

            <div className='flex flex-col flex-1 p-4'>

              {/* BRAND */}

              <p className='text-[11px] uppercase tracking-wide text-gray-400 mb-1'>

                {product.brand}

              </p>

              {/* TITLE */}

              <Link
                to={`/product/${product.id}`}
                className='block'
              >

                <h2
                  className='
                    text-sm
                    font-semibold
                    text-black
                    leading-6
                    line-clamp-2
                    min-h-[48px]
                    hover:text-red-500
                    transition-all
                  '
                >

                  {product.name}

                </h2>

              </Link>

              {/* RATING */}

              <div className='flex items-center gap-2 mt-2'>

                <span className='text-yellow-500 text-sm'>
                  ★
                </span>

                <span className='font-medium text-sm'>

                  {product.rating}

                </span>

                <span className='text-gray-400 text-xs'>

                  ({product.reviews})

                </span>

              </div>

              {/* PRICE */}

              <div className='flex items-center gap-2 mt-3 flex-wrap'>

                <h3 className='text-lg font-bold text-black'>

                  ${activeVariant.price}

                </h3>

                <span className='text-gray-400 line-through text-sm'>

                  ${activeVariant.originalPrice}

                </span>

              </div>

              {/* BUTTON */}

              <button
                onClick={() =>
                  addToCart({
                    ...product,
                    selectedVariant:
                      activeVariant,
                    quantity: 1,
                  })
                }
                className='
                  mt-4
                  w-full
                  bg-black
                  hover:bg-[#0D2B5C]
                  text-white
                  py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-all
                '
              >

                <FaShoppingCart size={13} />

                Add

              </button>

            </div>

          </div>

        )
      })}

    </div>
  )
}

export default ProductGrid