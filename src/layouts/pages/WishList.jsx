import Navbar from '../../components/Navbar'

import { Link } from 'react-router-dom'

import { FaHeart } from 'react-icons/fa'
import AddToCartButton from '../../components/products/AddToCartButton'

import {
  useWishlist,
} from '../../context/WishListContext'

import useCart from '../../hooks/usecart'

const WishList = () => {

  const {
    wishlist: wishlistItems,
    removeFromWishlist,
  } = useWishlist()

  const { addToCart } = useCart()

  const handleAddToCart = (product, quantity) => {
    addToCart({ ...product, quantity })
    removeFromWishlist(product.id)
  }

  return (

    <div className='bg-[#f8f8f8] min-h-screen'>

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div className='max-w-[1440px] mx-auto px-5 md:px-10 py-16'>

        {/* TITLE */}
        <div className='flex items-center justify-between mb-12 flex-wrap gap-5'>

          <div>

            <h1 className='text-5xl font-bold text-[#0D2B5C] mb-3'>

              My Wishlist

            </h1>

            <p className='text-gray-500 text-lg'>

              Save your favorite pet products for later.

            </p>

          </div>

          <div className='bg-white px-6 py-4 rounded-2xl shadow-sm'>

            <span className='text-lg font-semibold text-[#0D2B5C]'>

              {wishlistItems.length}
              {' '}
              Items

            </span>

          </div>

        </div>

        {/* EMPTY WISHLIST */}
        {wishlistItems.length === 0 ? (

          <div className='bg-white rounded-[35px] p-20 text-center shadow-sm'>

            <div className='flex justify-center mb-6'>

              <div className='w-24 h-24 rounded-full bg-red-100 flex items-center justify-center'>

                <FaHeart
                  className='text-red-500'
                  size={40}
                />

              </div>

            </div>

            <h2 className='text-4xl font-bold mb-5 text-[#0D2B5C]'>

              Your Wishlist Is Empty

            </h2>

            <p className='text-gray-500 text-lg mb-10 max-w-xl mx-auto'>

              Save products you love and easily find them later.

            </p>

            <Link
              to='/shop'
              className='inline-block bg-orange-500 hover:bg-orange-600 transition-all text-white px-10 py-5 rounded-full text-lg font-semibold'
            >

              Explore Products

            </Link>

          </div>

        ) : (

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>

            {wishlistItems.map((product) => {

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
                    rounded-[32px]
                    overflow-hidden
                    shadow-sm
                    hover:shadow-2xl
                    transition-all
                    duration-500
                    border
                    border-gray-100
                    flex
                    flex-col
                  '
                >

                  {/* IMAGE */}
                  <div className='relative bg-[#f8f8f8] h-[320px] overflow-hidden p-6'>

                    {/* DISCOUNT */}
                    <div className='absolute top-5 left-5 z-10 bg-[#F53B3B] text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide'>

                      {discountPercentage}% OFF

                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() =>
                        removeFromWishlist(
                          product.id
                        )
                      }
                      className='
                        absolute
                        top-5
                        right-5
                        z-10
                        bg-white
                        w-11
                        h-11
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shadow-sm
                        hover:bg-red-500
                        hover:text-white
                        transition-all
                        text-red-500
                      '
                    >

                      <FaHeart />

                    </button>

                    {/* PRODUCT IMAGE */}
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
                          group-hover:scale-110
                          transition-transform
                          duration-700
                        '
                      />

                    </Link>

                  </div>

                  {/* CONTENT */}
                  <div className='flex flex-col flex-1 p-6'>

                    {/* BRAND */}
                    <p className='text-sm uppercase tracking-[2px] text-gray-400 mb-3 font-medium'>

                      {product.brand}

                    </p>

                    {/* TITLE */}
                    <Link
                      to={`/product/${product.id}`}
                    >

                      <h2
                        className='
                          text-[20px]
                          font-bold
                          text-[#0D2B5C]
                          leading-8
                          line-clamp-2
                          min-h-[64px]
                          hover:text-[#F53B3B]
                          transition-all
                        '
                      >

                        {product.name}

                      </h2>

                    </Link>

                    {/* RATING */}
                    <div className='flex items-center gap-3 mt-4'>

                      <div className='flex items-center gap-1'>

                        <span className='text-yellow-500'>
                          ★
                        </span>

                        <span className='font-semibold text-sm text-gray-800'>

                          {product.rating}

                        </span>

                      </div>

                      <span className='text-gray-400 text-sm'>

                        ({product.reviews})

                      </span>

                    </div>

                    {/* PRICE */}
                    <div className='flex items-center gap-4 mt-6 flex-wrap'>

                      <h3 className='text-3xl font-bold text-green-600'>

                        ${activeVariant.price}

                      </h3>

                      <span className='text-gray-400 line-through text-lg'>

                        ${activeVariant.originalPrice}

                      </span>

                    </div>

                    {/* BUTTON */}
                    <AddToCartButton
                      product={{
                        ...product,
                        selectedVariant: activeVariant,
                      }}
                      isOutOfStock={product.stock <= 0}
                      onAddToCart={handleAddToCart}
                      quantity={1}
                    />

                  </div>

                </div>

              )
            })}

          </div>

        )}

      </div>

    </div>

  )
}

export default WishList