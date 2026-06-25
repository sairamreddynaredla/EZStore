import { Link } from 'react-router-dom'

import { products } from '../../data/products'
import {
  resolveProductImage,
  resolveProductImageFallback,
} from '../../utils/productImage'

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
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6'>

        {featuredProducts.map((product) => {

          const firstVariant =
            product.variants?.[0] ?? product

          return (

            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className='group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-slate-300 hover:shadow-lg'
                <div className='aspect-square w-full overflow-hidden rounded-[20px] bg-white'>
                  <img
                    src={resolveProductImage(product)}
                    alt={product.name}
                    className='h-full w-full object-contain transition-transform duration-300 group-hover:scale-105'
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      const fallback = resolveProductImageFallback(product)
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback
                      }
                    }}
                  />
                </div>

                {product.pet && (
                  <div className='absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm'>
                    {product.pet}
                  </div>
                )}

                {firstVariant?.originalPrice > firstVariant?.price && (
                  <div className='absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white'>
                    Sale
                  </div>
                )}
              </div>

              <div className='flex flex-1 flex-col gap-3 p-5 text-sm text-slate-700'>
                <p className='text-[11px] uppercase tracking-[0.24em] text-slate-400'>
                  {product.brand}
                </p>

                <h3 className='text-lg font-semibold text-slate-900 overflow-hidden' style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {product.name}
                </h3>

                <p className='text-sm text-slate-500 line-clamp-2'>
                  {product.description}
                </p>

                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-2xl font-semibold text-slate-900'>
                      ${firstVariant?.price}
                    </p>
                    {firstVariant?.originalPrice > firstVariant?.price && (
                      <p className='text-sm text-slate-400 line-through'>
                        ${firstVariant?.originalPrice}
                      </p>
                    )}
                  </div>
                  <div className='text-yellow-500 font-semibold'>
                    ★ {product.rating}
                  </div>
                </div>

                <button className='mt-auto inline-flex h-11 w-full items-center justify-center rounded-lg bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600'>
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