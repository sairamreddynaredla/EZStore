import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import AddToCartButton from '../products/AddToCartButton'
import useCart from '../../hooks/usecart'
import { useWishlist } from '../../context/usewishlist'
import { resolveProductImage, resolveProductImageFallback } from '../../utils/productImage'

const ProductGrid = ({ products }) => {

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4'>
      {products.map((product) => {
        const activeVariant = product?.variants?.[0] ?? product;
        const discountPercentage = activeVariant?.originalPrice
          ? Math.round(((activeVariant.originalPrice - activeVariant.price) / activeVariant.originalPrice) * 100)
          : 0;

        return (
          <div
            key={product.id}
            className='group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-xl'
          >
            <div className='relative bg-slate-50 overflow-hidden p-4'>
              {discountPercentage > 0 && (
                <div className='absolute left-4 top-4 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white'>
                  {discountPercentage}% OFF
                </div>
              )}
              <button
                onClick={(e) => { e.preventDefault(); isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product) }}
                className={`absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition hover:bg-orange-500 hover:text-white ${isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}
                aria-label='Add to wishlist'
              >
                <FaHeart size={12} />
              </button>
              <Link to={`/product/${product.id}`} className='block'>
                <div className='aspect-square w-full overflow-hidden rounded-[20px] bg-white'>
                  <img
                    src={resolveProductImage(product)}
                    alt={product.name}
                    className='h-full w-full object-contain transition-transform duration-300 group-hover:scale-105'
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const fallbackImage = resolveProductImageFallback(product);
                      if (e.currentTarget.src !== fallbackImage) {
                        e.currentTarget.src = fallbackImage;
                      }
                    }}
                  />
                </div>
              </Link>
            </div>

            <div className='flex flex-1 flex-col gap-3 p-4 text-sm text-slate-700'>
              <p className='text-[10px] uppercase tracking-[0.2em] text-slate-400'>
                {product.brand}
              </p>
              <Link to={`/product/${product.id}`} className='block'>
                <h2 className='line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-slate-900 transition-colors duration-300 group-hover:text-orange-600'>
                  {product.name}
                </h2>
              </Link>
              <div className='flex items-center gap-2 text-xs text-slate-500'>
                <span className='text-yellow-500'>★</span>
                <span className='font-semibold text-slate-900'>{product.rating ?? 0}</span>
                <span className='text-gray-400'>({product.reviews ?? 0})</span>
              </div>
              <div className='flex items-center gap-3'>
                <p className='text-lg font-bold text-slate-900'>${activeVariant.price}</p>
                {activeVariant.originalPrice > activeVariant.price && (
                  <span className='text-sm text-slate-400 line-through'>${activeVariant.originalPrice}</span>
                )}
              </div>
              <div className='flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                {discountPercentage > 0 && (
                  <span className='rounded-full bg-red-50 px-2 py-1 text-red-600'>Save {discountPercentage}%</span>
                )}
                {product.fastDelivery && <span className='rounded-full bg-slate-100 px-2 py-1'>Fast delivery</span>}
              </div>
              <AddToCartButton
                product={{ ...product, selectedVariant: activeVariant }}
                isOutOfStock={product.stock <= 0}
                onAddToCart={(prod, quantity) =>
                  addToCart({ ...prod, quantity })
                }
                quantity={1}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductGrid