import Navbar from '../../components/Navbar'
import useCart from "../../hooks/usecart"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {

  const navigate = useNavigate()

  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart()

  // FORM DATA
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    state: '',
    zip: '',
    address: '',
    payment: 'card',
  })

  // ERRORS
  const [errors, setErrors] = useState({})

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // REAL-TIME ERROR REMOVE
    setErrors({
      ...errors,
      [name]: '',
    })
  }

  // VALIDATE FORM
  const validateForm = () => {

    let newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email required'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone required'
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Invalid phone number'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State required'
    }

    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // PLACE ORDER
  const handlePlaceOrder = () => {

    const isValid = validateForm()

    if (!isValid) return

    clearCart()
    navigate('/order-success')
  }

  return (

    <div className='bg-[#f8f8f8] min-h-screen'>

      <Navbar />

<div className='max-w-7xl mx-auto px-4 sm:px-5 md:px-10 pt-10 pb-16'>

        {/* TITLE */}
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-12 leading-tight'>

          Secure Checkout

        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10'>

          {/* LEFT SIDE */}
          <div className='lg:col-span-2 space-y-8'>

            {/* CONTACT INFORMATION */}
            <div className='bg-white p-8 rounded-[35px] shadow-sm'>

              <h2 className='text-3xl font-bold mb-8'>

                Contact Information

              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                {/* FIRST NAME */}
                <div>
                  <input
                    type='text'
                    name='firstName'
                    placeholder='First Name'
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.firstName
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.firstName && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* LAST NAME */}
                <div>
                  <input
                    type='text'
                    name='lastName'
                    placeholder='Last Name'
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.lastName
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.lastName && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div className='md:col-span-2'>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email Address'
                    value={formData.email}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PHONE */}
                <div className='md:col-span-2'>
                  <input
                    type='text'
                    name='phone'
                    placeholder='Phone Number'
                    value={formData.phone}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.phone
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.phone && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.phone}
                    </p>
                  )}
                </div>

              </div>

            </div>

            {/* SHIPPING ADDRESS */}
            <div className='bg-white p-8 rounded-[35px] shadow-sm'>

              <h2 className='text-3xl font-bold mb-8'>

                Shipping Address

              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                {/* COUNTRY */}
                <div>
                  <input
                    type='text'
                    name='country'
                    placeholder='Country'
                    value={formData.country}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.country
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.country && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* CITY */}
                <div>
                  <input
                    type='text'
                    name='city'
                    placeholder='City'
                    value={formData.city}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.city
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.city && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* STATE */}
                <div>
                  <input
                    type='text'
                    name='state'
                    placeholder='State'
                    value={formData.state}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.state
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.state && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* ZIP */}
                <div>
                  <input
                    type='text'
                    name='zip'
                    placeholder='ZIP Code'
                    value={formData.zip}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.zip
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.zip && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.zip}
                    </p>
                  )}
                </div>

                {/* ADDRESS */}
                <div className='md:col-span-2'>
                  <input
                    type='text'
                    name='address'
                    placeholder='Street Address'
                    value={formData.address}
                    onChange={handleChange}
                    className={`border p-4 rounded-2xl outline-none w-full transition-all ${
                      errors.address
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />

                  {errors.address && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.address}
                    </p>
                  )}
                </div>

              </div>

            </div>

            {/* PAYMENT METHOD */}
            <div className='bg-white p-8 rounded-[35px] shadow-sm'>

              <h2 className='text-3xl font-bold mb-8'>

                Payment Method

              </h2>

              <div className='space-y-5'>

                <label className='flex items-center gap-4 border rounded-2xl p-5 cursor-pointer hover:border-black transition-all'>

                  <input
                    type='radio'
                    name='payment'
                    value='card'
                    checked={formData.payment === 'card'}
                    onChange={handleChange}
                  />

                  <span className='font-semibold'>
                    Credit / Debit Card
                  </span>

                </label>

                <label className='flex items-center gap-4 border rounded-2xl p-5 cursor-pointer hover:border-black transition-all'>

                  <input
                    type='radio'
                    name='payment'
                    value='paypal'
                    checked={formData.payment === 'paypal'}
                    onChange={handleChange}
                  />

                  <span className='font-semibold'>
                    PayPal
                  </span>

                </label>

                <label className='flex items-center gap-4 border rounded-2xl p-5 cursor-pointer hover:border-black transition-all'>

                  <input
                    type='radio'
                    name='payment'
                    value='cod'
                    checked={formData.payment === 'cod'}
                    onChange={handleChange}
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

            <div className='bg-white rounded-[35px] p-8 shadow-sm lg:sticky lg:top-24'>

              <h2 className='text-3xl font-bold mb-8'>
                Order Summary
              </h2>

              <div className='space-y-6 mb-8'>

                {cartItems.filter(item => item && item.selectedVariant).map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-4'
                  >

                    <div className='w-20 h-20 bg-gray-100 rounded-2xl p-2'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-full h-full object-contain'
                      />
                    </div>

                    <div className='flex-1'>
                      <h3 className='font-semibold line-clamp-2'>
                        {item.name}
                      </h3>

                      <p className='text-sm text-gray-500 mt-1'>
                        {item.selectedVariant?.weight ?? 'N/A'}
                        {' • '}
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className='font-bold text-green-600'>
                      $
                      {(
                        (item.selectedVariant?.price ?? 0) * item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>
                ))}

              </div>

              {/* TOTALS */}
              <div className='space-y-4 border-t pt-6'>

                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>

                <div className='flex justify-between text-gray-600'>
                  <span>Tax</span>
                  <span>$3.00</span>
                </div>

                <div className='border-t pt-5 flex justify-between text-3xl font-bold'>

                  <span>Total</span>

                  <span className='text-orange-500'>
                    ${(totalPrice + 5 + 3).toFixed(2)}
                  </span>

                </div>

              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                onClick={handlePlaceOrder}
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