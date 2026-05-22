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

  return (
    <>
      <Navbar />

      <div className='bg-[#f8f8f8] min-h-screen'>

        <div className='max-w-7xl mx-auto px-5 md:px-10 pt-28 pb-16'>

          {/* TITLE */}
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          {/* EMPTY CART */}
          {cartItems.length === 0 ? (

            <div className='bg-white rounded-[35px] p-20 text-center shadow-sm'>

              <h2 className='text-4xl font-bold mb-5'>

                Your Cart Is Empty

              </h2>

              <p className='text-gray-500 text-lg mb-10'>

                Add pet food products to continue shopping.

              </p>

              <Link
                to='/'
                className='inline-block bg-orange-500 hover:bg-orange-600 transition text-white px-10 py-5 rounded-full text-lg font-semibold'
              >

                Continue Shopping

              </Link>

            </div>

          ) : (

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>

              {/* LEFT SIDE */}
              <div className='lg:col-span-2 space-y-6'>

                {cartItems.map((item) => (

                  <div
                    key={`${item.id}-${item.selectedVariant.weight}`}
                    className='bg-white rounded-[35px] p-6 flex flex-col md:flex-row gap-6 shadow-sm'
                  >

                    {/* IMAGE */}
                    <div className='bg-gray-100 rounded-[25px] p-5'>

                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-40 h-40 object-contain'
                      />

                    </div>

                    {/* CONTENT */}
                    <div className='flex-1'>

                      {/* BRAND */}
                      <p className='text-gray-400 mb-2'>

                        {item.brand}

                      </p>

                      {/* TITLE */}
                      <h2 className='text-3xl font-bold mb-4'>

                        {item.name}

                      </h2>

                      {/* DETAILS */}
                      <div className='space-y-2 text-gray-500 mb-6'>

                        <p>

                          Weight:
                          {' '}
                          {item.selectedVariant.weight}

                        </p>

                        <p>

                          Flavor:
                          {' '}
                          {item.flavor}

                        </p>

                      </div>

                      {/* QUANTITY */}
                      <div className='flex items-center gap-5 mb-6'>

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.selectedVariant.weight
                            )
                          }
                          className='w-12 h-12 rounded-full bg-gray-100 text-2xl hover:bg-gray-200 transition-all'
                        >
                          -
                        </button>

                        <span className='text-2xl font-bold'>

                          {item.quantity}

                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              item.selectedVariant.weight
                            )
                          }
                          className='w-12 h-12 rounded-full bg-gray-100 text-2xl hover:bg-gray-200 transition-all'
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.selectedVariant.weight
                          )
                        }
                        className='text-red-500 hover:text-red-700 transition-all font-semibold'
                      >

                        Remove Item

                      </button>

                    </div>

                    {/* PRICE */}
                    <div className='text-4xl font-bold text-[#0B2B6A]'>

                      $
                      {(
                        item.selectedVariant.price *
                        item.quantity
                      ).toFixed(2)}

                    </div>

                  </div>

                ))}

              </div>

              {/* RIGHT SIDE */}
              <div>

                <div className='bg-white rounded-[35px] p-8 shadow-sm sticky top-24'>

                  <h2 className='text-3xl font-bold mb-8'>

                    Order Summary

                  </h2>

                  <div className='space-y-5 mb-8'>

                    <div className='flex justify-between text-lg'>

                      <span>Items</span>

                      <span>

                        {cartItems.length}

                      </span>

                    </div>

                    <div className='flex justify-between text-lg'>

                      <span>Shipping</span>

                      <span>

                        $5

                      </span>

                    </div>

                    <div className='flex justify-between text-lg'>

                      <span>Tax</span>

                      <span>

                        $3

                      </span>

                    </div>

                  </div>

                  {/* TOTAL */}
                  <div className='border-t pt-6 flex justify-between text-3xl font-bold'>

                    <span>

                      Total

                    </span>

                    <span className='text-orange-500'>

                      ${(totalPrice + 5 + 3).toFixed(2)}

                    </span>

                  </div>

                  {/* CHECKOUT */}
                  <Link
                    to='/checkout'
                    className='block text-center mt-10 bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-full text-xl font-semibold'
                  >

                    Proceed To Checkout

                  </Link>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>
    </>
  );
};

export default Cart;