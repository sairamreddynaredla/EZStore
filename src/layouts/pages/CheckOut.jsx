import Navbar from '../../components/Navbar'
import useCart from "../../hooks/usecart";
import { useNavigate } from 'react-router-dom'

const Checkout = () => {

  const navigate = useNavigate()

  const {
    cartItems,
    totalPrice,
  } = useCart()

  return (

    <div className='bg-[#f8f8f8] min-h-screen'>

      <Navbar />

      <div className='max-w-7xl mx-auto px-5 md:px-10 pt-40 pb-16'>

        {/* TITLE */}
        <h1 className='text-5xl md:text-6xl font-bold mb-12 leading-tight'>

          Secure Checkout

        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>

          {/* LEFT SIDE */}
          <div className='lg:col-span-2 space-y-8'>

            {/* CONTACT INFORMATION */}
            <div className='bg-white p-8 rounded-[35px] shadow-sm'>

              <h2 className='text-3xl font-bold mb-8'>

                Contact Information

              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                <input
                  type='text'
                  placeholder='First Name'
                  className='border p-4 rounded-2xl outline-none'
                />

                <input
                  type='text'
                  placeholder='Last Name'
                  className='border p-4 rounded-2xl outline-none'
                />

                <input
                  type='email'
                  placeholder='Email Address'
                  className='border p-4 rounded-2xl outline-none md:col-span-2'
                />

                <input
                  type='text'
                  placeholder='Phone Number'
                  className='border p-4 rounded-2xl outline-none md:col-span-2'
                />

              </div>

            </div>

            {/* SHIPPING ADDRESS */}
            <div className='bg-white p-8 rounded-[35px] shadow-sm'>

              <h2 className='text-3xl font-bold mb-8'>

                Shipping Address

              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                <input
                  type='text'
                  placeholder='Country'
                  className='border p-4 rounded-2xl outline-none'
                />

                <input
                  type='text'
                  placeholder='City'
                  className='border p-4 rounded-2xl outline-none'
                />

                <input
                  type='text'
                  placeholder='State'
                  className='border p-4 rounded-2xl outline-none'
                />

                <input
                  type='text'
                  placeholder='ZIP Code'
                  className='border p-4 rounded-2xl outline-none'
                />

                <input
                  type='text'
                  placeholder='Street Address'
                  className='border p-4 rounded-2xl outline-none md:col-span-2'
                />

              </div>

            </div>

            {/* PAYMENT METHOD */}
            <div className='bg-white p-8 rounded-[35px] shadow-sm'>

              <h2 className='text-3xl font-bold mb-8'>

                Payment Method

              </h2>

              <div className='space-y-5'>

                <label className='flex items-center gap-4 border rounded-2xl p-5 cursor-pointer'>

                  <input
                    type='radio'
                    name='payment'
                    defaultChecked
                  />

                  <span className='font-semibold'>

                    Credit / Debit Card

                  </span>

                </label>

                <label className='flex items-center gap-4 border rounded-2xl p-5 cursor-pointer'>

                  <input
                    type='radio'
                    name='payment'
                  />

                  <span className='font-semibold'>

                    PayPal

                  </span>

                </label>

                <label className='flex items-center gap-4 border rounded-2xl p-5 cursor-pointer'>

                  <input
                    type='radio'
                    name='payment'
                  />

                  <span className='font-semibold'>

                    Cash On Delivery

                  </span>

                </label>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className='bg-white rounded-[35px] p-8 shadow-sm sticky top-24'>

              <h2 className='text-3xl font-bold mb-8'>

                Order Summary

              </h2>

              <div className='space-y-6 mb-8'>

                {cartItems.map((item, index) => (

                  <div
                    key={index}
                    className='flex items-center gap-4'
                  >

                    {/* IMAGE */}
                    <div className='w-20 h-20 bg-gray-100 rounded-2xl p-2'>

                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-full h-full object-contain'
                      />

                    </div>

                    {/* CONTENT */}
                    <div className='flex-1'>

                      <h3 className='font-semibold line-clamp-2'>

                        {item.name}

                      </h3>

                      <p className='text-sm text-gray-500 mt-1'>

                        {item.selectedVariant.weight}
                        {' • '}
                        Qty:
                        {' '}
                        {item.quantity}

                      </p>

                    </div>

                    {/* PRICE */}
                    <p className='font-bold text-green-600'>

                      $
                      {(
                        item.selectedVariant.price *
                        item.quantity
                      ).toFixed(2)}

                    </p>

                  </div>

                ))}

              </div>

              {/* TOTALS */}
              <div className='space-y-4 border-t pt-6'>

                <div className='flex justify-between text-gray-600'>

                  <span>Subtotal</span>

                  <span>

                    ${totalPrice.toFixed(2)}

                  </span>

                </div>

                <div className='flex justify-between text-gray-600'>

                  <span>Shipping</span>

                  <span>

                    $5.00

                  </span>

                </div>

                <div className='flex justify-between text-gray-600'>

                  <span>Tax</span>

                  <span>

                    $3.00

                  </span>

                </div>

                <div className='border-t pt-5 flex justify-between text-3xl font-bold'>

                  <span>

                    Total

                  </span>

                  <span className='text-orange-500'>

                    ${(totalPrice + 5 + 3).toFixed(2)}

                  </span>

                </div>

              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                onClick={() => navigate('/order-success')}
                className='
                  w-full
                  mt-10
                  bg-black
                  hover:bg-gray-900
                  transition-all
                  text-white
                  py-5
                  rounded-2xl
                  text-xl
                  font-semibold
                '
              >

                Place Order

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Checkout