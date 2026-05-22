import { Link } from 'react-router-dom'

import { products } from '../../data/products'

const FeaturedProducts = () => {

  // SHOW ONLY FEATURED PRODUCTS
  const featuredProducts = products.slice(0, 8)

  return (
    <section className='px-6 md:px-10 py-20 bg-white'>

      {/* TOP */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-12'>

        <div>

          <h2 className='text-4xl md:text-5xl font-bold mb-3'>
            Featured Products
          </h2>

          <p className='text-gray-500 text-lg'>
            Best selling nutrition for your pets
          </p>

        </div>

        {/* BUTTON */}
        <Link
          to='/shop'
          className='bg-orange-500 hover:bg-orange-600 transition text-white px-8 py-4 rounded-full font-semibold w-fit'
        >
          View All Products
        </Link>

      </div>

      {/* PRODUCTS GRID */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>

        {featuredProducts.map((product) => {

          const firstVariant =
            product.variants?.[0]

          return (

            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className='group bg-[#f8f8f8] rounded-[35px] overflow-hidden hover:shadow-2xl transition duration-500'
            >

              {/* IMAGE */}
              <div className='relative overflow-hidden h-[280px]'>

                <img
                  src={product.image}
                  alt={product.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition duration-700'
                />

                {/* CATEGORY */}
                <div className='absolute top-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-semibold shadow'>

                  {product.pet}

                </div>

                {/* DISCOUNT */}
                <div className='absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold'>

                  SALE

                </div>

              </div>

              {/* CONTENT */}
              <div className='p-6'>

                {/* BRAND */}
                <p className='text-gray-400 text-sm mb-2'>
                  {product.brand}
                </p>

                {/* NAME */}
                <h3 className='text-2xl font-bold mb-3 line-clamp-2'>

                  {product.name}

                </h3>

                {/* DESCRIPTION */}
                <p className='text-gray-500 text-sm mb-5 line-clamp-2'>

                  {product.description}

                </p>

                {/* DETAILS */}
                <div className='space-y-2 text-sm text-gray-500 mb-6'>

                  <p>
                    Flavor:
                    {' '}
                    {product.flavor}
                  </p>

                  <p>
                    Weight:
                    {' '}
                    {firstVariant?.weight}
                  </p>

                </div>

                {/* PRICE */}
                <div className='flex items-center justify-between mb-6'>

                  <div>

                    <div className='text-3xl font-bold text-[#0B2B6A]'>

                      ${firstVariant?.price}

                    </div>

                    <div className='text-gray-400 line-through text-sm'>

                      ₹{firstVariant?.originalPrice}

                    </div>

                  </div>

                  {/* RATING */}
                  <div className='text-yellow-500 font-bold'>

                    ⭐ {product.rating}

                  </div>

                </div>

                {/* BUTTON */}
                <button className='w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-full text-lg font-semibold'>

                  View Product

                </button>

              </div>

            </Link>
          )
        })}
      </div>

    </section>
  )
}

export default FeaturedProducts