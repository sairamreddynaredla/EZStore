import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

import useCart from "../../hooks/usecart";

const Cart = () => {

  const {
    cartItems,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const visibleItems = cartItems.filter(item => item && item.selectedVariant);
  const shipping = 5;
  const tax = 3;
  const total = totalPrice + shipping + tax;

  return (
    <>
      <Navbar />

      <div className='bg-[#eef1f7] min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-12'>

          <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='text-sm uppercase tracking-[0.3em] text-gray-500 mb-1'>Cart overview</p>
              <h1 className='text-3xl md:text-4xl font-semibold text-[#0B2B6A]'>Shopping Cart</h1>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-500'>Quick glance</p>
              <p className='text-lg md:text-xl font-semibold text-[#0B2B6A]'>{visibleItems.length} item{visibleItems.length === 1 ? '' : 's'}</p>
            </div>
          </div>

          {visibleItems.length === 0 ? (
            <div className='mt-10 bg-white rounded-[28px] p-12 text-center shadow-sm border border-gray-200'>
              <h2 className='text-2xl font-semibold mb-3'>Your cart is empty</h2>
              <p className='text-gray-500 mb-8'>Add pet food products and return here to complete your order.</p>
              <Link
                to='/'
                className='inline-block bg-orange-500 hover:bg-orange-600 transition text-white px-8 py-3 rounded-full text-sm font-semibold'
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6 mt-8'>
              <div className='space-y-4'>
                {visibleItems.map((item) => (
                  <article
                    key={`${item.id}-${item.selectedVariant.weight}`}
                    className='bg-white border border-gray-200 rounded-[28px] p-4 md:p-5 shadow-sm'
                  >
                    <div className='flex flex-col gap-4 md:flex-row md:items-start'>
                      <div className='w-24 h-24 rounded-[22px] bg-gray-100 overflow-hidden flex items-center justify-center'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-full h-full object-contain'
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <p className='text-xs uppercase tracking-[0.25em] text-gray-400 mb-1 truncate'>{item.brand}</p>
                        <h2 className='text-lg md:text-xl font-semibold mb-2 truncate'>{item.name}</h2>
                        <div className='grid grid-cols-2 gap-3 text-sm text-gray-500 mb-4'>
                          <span className='truncate'>Weight: {item.selectedVariant?.weight ?? 'N/A'}</span>
                          <span className='truncate'>Flavor: {item.flavor || 'Standard'}</span>
                        </div>
                      </div>

                      <div className='min-w-30 text-right'>
                        <p className='text-lg md:text-xl font-semibold text-[#0B2B6A]'>${((item.selectedVariant?.price ?? 0) * item.quantity).toFixed(2)}</p>
                        <p className='text-xs text-gray-500 mt-1'>Unit ${item.selectedVariant?.price?.toFixed(2) ?? '0.00'}</p>
                      </div>
                    </div>

                    <div className='mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='inline-flex items-center rounded-full border border-gray-200 overflow-hidden'>
                        <button
                          onClick={() => decreaseQuantity(item.id, item.selectedVariant?.weight)}
                          className='w-10 h-10 bg-white text-gray-600 hover:bg-gray-50 transition'
                        >
                          -
                        </button>
                        <span className='w-12 text-center text-sm font-semibold bg-gray-50'>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id, item.selectedVariant?.weight)}
                          className='w-10 h-10 bg-white text-gray-600 hover:bg-gray-50 transition'
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.selectedVariant?.weight)}
                        className='text-sm font-semibold text-red-500 hover:text-red-700 transition'
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className='lg:sticky lg:top-6'>
                <div className='bg-white border border-gray-200 rounded-[28px] p-5 md:p-6 shadow-sm'>
                  <p className='text-sm uppercase tracking-[0.3em] text-gray-500 mb-3'>Summary</p>
                  <h2 className='text-2xl font-semibold mb-5'>Order summary</h2>

                  <div className='space-y-4 text-sm text-gray-600'>
                    <div className='flex justify-between'>
                      <span>Items</span>
                      <span>{visibleItems.length}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Estimated tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className='border-t border-gray-200 pt-5 mt-5 flex justify-between items-center text-xl font-semibold'>
                    <span>Total</span>
                    <span className='text-orange-500'>${total.toFixed(2)}</span>
                  </div>

                  <div className='space-y-3 mt-6'>
                    <Link
                      to='/checkout'
                      className='block text-center bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full text-sm font-semibold transition'
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      to='/'
                      className='block text-center border border-gray-300 hover:border-gray-400 text-gray-700 py-4 rounded-full text-sm font-semibold transition'
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;