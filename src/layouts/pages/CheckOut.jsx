import Navbar from '../../components/Navbar'
import useCart from "../../hooks/usecart"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, totalPrice, clearCart } = useCart()

  // ─── STEP & NAVIGATION ───
  const [currentStep, setCurrentStep] = useState(1)
  const steps = [
    { step: 1, label: 'Address', icon: '📍' },
    { step: 2, label: 'Shipping', icon: '🚚' },
    { step: 3, label: 'Payment', icon: '💳' },
    { step: 4, label: 'Confirmation', icon: '✓' }
  ]

  // ─── FORM VALIDATION ───
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // ─── USER & ADDRESS ───
  const [isGuest, setIsGuest] = useState(true)
  const [email, setEmail] = useState('john.doe@email.com')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [fullName, setFullName] = useState('John Doe')
  const [streetAddress, setStreetAddress] = useState('123 Green Park Street')
  const [apartment, setApartment] = useState('Apt 4B, Green Park Residency')
  const [city, setCity] = useState('Bengaluru')
  const [state, setState] = useState('Karnataka')
  const [pincode, setPincode] = useState('560001')
  
  // ─── BILLING ADDRESS ───
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [billingName, setBillingName] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingPincode, setBillingPincode] = useState('')

  // ─── DELIVERY & PAYMENT ───
  const [selectedDelivery, setSelectedDelivery] = useState('standard')
  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [selectedDeliveryInstruction, setSelectedDeliveryInstruction] = useState('ring-bell')
  const [expandDeliveryInstructions, setExpandDeliveryInstructions] = useState(false)
  
  // ─── COUPON ───
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const coupons = {
    'WELCOME10': { discount: 200, description: '10% off on your first order' },
    'SAVE20': { discount: 300, description: '20% off on orders above $500' },
    'FREESHIP': { discount: 99, description: 'Free shipping on any order' }
  }

  // ─── ORDER ITEMS & PRICING ───
  const [cartQuantities, setCartQuantities] = useState(cartItems.reduce((acc, item, idx) => ({...acc, [idx]: item.quantity}), {}))
  const TAX_RATE = 0.1
  const discount = appliedCoupon ? coupons[appliedCoupon].discount : 0
  const shipping = selectedDelivery === 'express' ? 99 : 0
  const subtotal = totalPrice
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.max(0, subtotal + tax - discount + shipping)

  // ─── ADDITIONAL SERVICES ───
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [smsUpdates, setSmsUpdates] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // ─── MODALS ───
  const [showTermsModal, setShowTermsModal] = useState(false)

  // ─── VALIDATION ───
  const validateField = (field, value) => {
    const newErrors = { ...errors }
    switch (field) {
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Valid email is required'
        } else delete newErrors.email
        break
      case 'phone':
        if (!value || !/^\+?\d{10,}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone = 'Valid phone number is required'
        } else delete newErrors.phone
        break
      case 'fullName':
        if (!value || !/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.fullName = 'Full name must contain only letters and spaces'
        } else delete newErrors.fullName
        break
      case 'streetAddress':
        if (!value) newErrors.streetAddress = 'Street address is required'
        else delete newErrors.streetAddress
        break
      case 'city':
        if (!value) newErrors.city = 'City is required'
        else delete newErrors.city
        break
      case 'pincode':
        if (!value || !/^\d{5,6}$/.test(value)) {
          newErrors.pincode = 'Valid pincode is required'
        } else delete newErrors.pincode
        break
      case 'billingName':
        if (!sameAsShipping && (!value || !/^[a-zA-Z\s]+$/.test(value))) {
          newErrors.billingName = 'Billing name must contain only letters and spaces'
        } else delete newErrors.billingName
        break
      case 'billingAddress':
        if (!sameAsShipping && !value) newErrors.billingAddress = 'Billing address is required'
        else delete newErrors.billingAddress
        break
      case 'billingCity':
        if (!sameAsShipping && !value) newErrors.billingCity = 'Billing city is required'
        else delete newErrors.billingCity
        break
      case 'billingPincode':
        if (!sameAsShipping && (!value || !/^\d{5,6}$/.test(value))) {
          newErrors.billingPincode = 'Valid pincode is required'
        } else delete newErrors.billingPincode
        break
      default:
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── COUPON HANDLER ───
  const handleApplyCoupon = () => {
    setCouponError('')
    if (!coupon.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    if (coupons[coupon.toUpperCase()]) {
      setAppliedCoupon(coupon.toUpperCase())
      setCoupon('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  // ─── QUANTITY HANDLER ───
  const handleQuantityChange = (idx, qty) => {
    if (qty >= 1) {
      setCartQuantities({...cartQuantities, [idx]: qty})
    }
  }

  const handlePlaceOrder = () => {
    if (!agreeTerms) {
      alert('Please accept terms and conditions')
      return
    }
    clearCart()
    navigate('/order-success')
  }

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '/assets/icons/upi.png', details: 'Transfer money instantly using UPI' },
    { id: 'card', name: 'Credit / Debit Card', icon: '/assets/icons/card.png', details: 'Visa, MasterCard, American Express' },
    { id: 'phonepe', name: 'PhonePe', icon: '/assets/icons/phonepe.png', details: 'Pay using PhonePe wallet' },
    { id: 'paytm', name: 'Paytm', icon: '/assets/icons/paytm.png', details: 'Pay using Paytm wallet' },
    { id: 'netbanking', name: 'Net Banking', icon: '/assets/icons/net banking.png', details: 'Bank transfer via net banking' },
    { id: 'cod', name: 'Cash on Delivery', icon: '/assets/icons/cod.png', details: 'Pay when you receive your order' },
  ]

  // ─── STEP VALIDATION ───
  const canProceedToStep2 = !errors.email && !errors.phone && !errors.fullName && !errors.streetAddress && !errors.city && !errors.pincode
  const canProceedToStep3 = true
  const canProceedToStep4 = agreeTerms

  return (
    <div className='bg-white min-h-screen'>
      <Navbar />

      {/* ─── PROGRESS STEPPER ─── */}
      <div className='bg-gray-50 border-b border-gray-200 sticky top-20 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            {steps.map((s, idx) => (
              <div key={s.step} className='flex items-center flex-1'>
                <div 
                  onClick={() => currentStep > s.step && setCurrentStep(s.step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all ${
                    currentStep >= s.step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > s.step ? '✓' : s.step}
                </div>
                <div className='ml-3'>
                  <div className='text-xs font-semibold'>{s.label}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 ml-3 ${currentStep > s.step ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12'>
        <div className='flex flex-col lg:flex-row gap-8'>

          {/* ─── LEFT: FORM ─── */}
          <div className='flex-1 space-y-6'>

            {/* ─── STEP 1: ADDRESS ─── */}
            {currentStep === 1 && (
              <>
                {/* Contact Information */}
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Contact Information</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='text-xs font-semibold text-gray-700'>Email Address *</label>
                      <input 
                        type='email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => validateField('email', email)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder='john.doe@email.com'
                      />
                      {errors.email && <p className='text-xs text-red-500 mt-1'>{errors.email}</p>}
                    </div>
                    <div>
                      <label className='text-xs font-semibold text-gray-700'>Phone Number *</label>
                      <input 
                        type='tel' 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => validateField('phone', phone)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder='+91 98765 43210'
                      />
                      {errors.phone && <p className='text-xs text-red-500 mt-1'>{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Shipping Address</h3>
                  <div className='space-y-3'>
                    <div>
                      <label className='text-xs font-semibold text-gray-700'>Full Name *</label>
                      <input 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => validateField('fullName', fullName)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder='Full Name'
                      />
                      {errors.fullName && <p className='text-xs text-red-500 mt-1'>{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className='text-xs font-semibold text-gray-700'>Street Address *</label>
                      <input 
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        onBlur={() => validateField('streetAddress', streetAddress)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder='123 Green Park Street'
                      />
                      {errors.streetAddress && <p className='text-xs text-red-500 mt-1'>{errors.streetAddress}</p>}
                    </div>
                    <div>
                      <label className='text-xs font-semibold text-gray-700'>Apartment, suite, building (Optional)</label>
                      <input 
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className='w-full border border-gray-300 rounded-lg p-3 text-sm mt-1'
                        placeholder='Apt 4B'
                      />
                    </div>
                    <div className='grid grid-cols-3 gap-3'>
                      <div>
                        <label className='text-xs font-semibold text-gray-700'>City *</label>
                        <input 
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          onBlur={() => validateField('city', city)}
                          className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder='Bengaluru'
                        />
                        {errors.city && <p className='text-xs text-red-500 mt-1'>{errors.city}</p>}
                      </div>
                      <div>
                        <label className='text-xs font-semibold text-gray-700'>State *</label>
                        <select value={state} onChange={(e) => setState(e.target.value)} className='w-full border border-gray-300 rounded-lg p-3 text-sm mt-1'>
                          <option>Karnataka</option>
                          <option>Delhi</option>
                          <option>Mumbai</option>
                          <option>Bangalore</option>
                        </select>
                      </div>
                      <div>
                        <label className='text-xs font-semibold text-gray-700'>Pincode *</label>
                        <input 
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          onBlur={() => validateField('pincode', pincode)}
                          className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder='560001'
                        />
                        {errors.pincode && <p className='text-xs text-red-500 mt-1'>{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Billing Address</h3>
                  <div className='flex items-center gap-3 mb-4'>
                    <input 
                      type='checkbox' 
                      checked={sameAsShipping} 
                      onChange={() => setSameAsShipping(!sameAsShipping)}
                      className='w-4 h-4'
                    />
                    <label className='text-sm font-semibold'>Same as shipping address</label>
                  </div>
                  {!sameAsShipping && (
                    <div className='space-y-3'>
                      <div>
                        <input 
                          placeholder='Billing Name' 
                          className={`w-full border rounded-lg p-3 text-sm ${errors.billingName ? 'border-red-500' : 'border-gray-300'}`} 
                          value={billingName} 
                          onChange={(e) => setBillingName(e.target.value)}
                          onBlur={() => validateField('billingName', billingName)}
                        />
                        {errors.billingName && <p className='text-xs text-red-500 mt-1'>{errors.billingName}</p>}
                      </div>
                      <div>
                        <input 
                          placeholder='Billing Address' 
                          className={`w-full border rounded-lg p-3 text-sm ${errors.billingAddress ? 'border-red-500' : 'border-gray-300'}`} 
                          value={billingAddress} 
                          onChange={(e) => setBillingAddress(e.target.value)}
                          onBlur={() => validateField('billingAddress', billingAddress)}
                        />
                        {errors.billingAddress && <p className='text-xs text-red-500 mt-1'>{errors.billingAddress}</p>}
                      </div>
                      <div className='grid grid-cols-3 gap-3'>
                        <div>
                          <input 
                            placeholder='City' 
                            className={`w-full border rounded-lg p-3 text-sm ${errors.billingCity ? 'border-red-500' : 'border-gray-300'}`} 
                            value={billingCity} 
                            onChange={(e) => setBillingCity(e.target.value)}
                            onBlur={() => validateField('billingCity', billingCity)}
                          />
                          {errors.billingCity && <p className='text-xs text-red-500 mt-1'>{errors.billingCity}</p>}
                        </div>
                        <input placeholder='State' className='w-full border border-gray-300 rounded-lg p-3 text-sm' value={billingState} onChange={(e) => setBillingState(e.target.value)} />
                        <div>
                          <input 
                            placeholder='Pincode' 
                            className={`w-full border rounded-lg p-3 text-sm ${errors.billingPincode ? 'border-red-500' : 'border-gray-300'}`} 
                            value={billingPincode} 
                            onChange={(e) => setBillingPincode(e.target.value)}
                            onBlur={() => validateField('billingPincode', billingPincode)}
                          />
                          {errors.billingPincode && <p className='text-xs text-red-500 mt-1'>{errors.billingPincode}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    validateField('email', email)
                    validateField('phone', phone)
                    validateField('fullName', fullName)
                    validateField('streetAddress', streetAddress)
                    validateField('city', city)
                    validateField('pincode', pincode)
                    if (canProceedToStep2) setCurrentStep(2)
                  }}
                  className='w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600'
                >
                  Continue to Shipping
                </button>
              </>
            )}

            {/* ─── STEP 2: SHIPPING ─── */}
            {currentStep === 2 && (
              <>
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Delivery Options</h3>
                  <div className='space-y-3'>
                    <label className='flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50'>
                      <input type='radio' name='delivery' checked={selectedDelivery === 'standard'} onChange={() => setSelectedDelivery('standard')} />
                      <div className='flex-1'>
                        <div className='font-semibold'>Standard Delivery (3-5 Days)</div>
                        <div className='text-xs text-gray-500'>Tue, 28 May – Thu, 30 May</div>
                      </div>
                      <div className='text-green-600 font-bold'>FREE</div>
                    </label>
                    <label className='flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50'>
                      <input type='radio' name='delivery' checked={selectedDelivery === 'express'} onChange={() => setSelectedDelivery('express')} />
                      <div className='flex-1'>
                        <div className='font-semibold'>Express Delivery (1-2 Days)</div>
                        <div className='text-xs text-gray-500'>Sat, 25 May – Mon, 27 May</div>
                      </div>
                      <div className='font-bold'>$99</div>
                    </label>
                  </div>
                  {!selectedDelivery && <p className='text-xs text-red-500 mt-3'>Please select a delivery option</p>}
                </div>

                {/* ─── DELIVERY INSTRUCTIONS ─── */}
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <button
                    onClick={() => setExpandDeliveryInstructions(!expandDeliveryInstructions)}
                    className='w-full flex items-center justify-between mb-4 text-left'
                  >
                    <h3 className='font-semibold text-gray-800'>Delivery Instructions</h3>
                    <svg 
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${expandDeliveryInstructions ? 'rotate-180' : ''}`} 
                      fill='none' 
                      stroke='currentColor' 
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                    </svg>
                  </button>
                  
                  {expandDeliveryInstructions && (
                    <div className='space-y-2'>
                      <label className='flex items-center gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-green-50'>
                        <input type='radio' name='instruction' checked={selectedDeliveryInstruction === 'ring-bell'} onChange={() => setSelectedDeliveryInstruction('ring-bell')} />
                        <span className='text-sm font-medium'>Ring bell before delivery</span>
                      </label>
                      <label className='flex items-center gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-green-50'>
                        <input type='radio' name='instruction' checked={selectedDeliveryInstruction === 'leave-door'} onChange={() => setSelectedDeliveryInstruction('leave-door')} />
                        <span className='text-sm font-medium'>Leave at door</span>
                      </label>
                      <label className='flex items-center gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-green-50'>
                        <input type='radio' name='instruction' checked={selectedDeliveryInstruction === 'call-first'} onChange={() => setSelectedDeliveryInstruction('call-first')} />
                        <span className='text-sm font-medium'>Call me before delivery</span>
                      </label>
                      <label className='flex items-center gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-green-50'>
                        <input type='radio' name='instruction' checked={selectedDeliveryInstruction === 'signature'} onChange={() => setSelectedDeliveryInstruction('signature')} />
                        <span className='text-sm font-medium'>Require signature</span>
                      </label>
                      <label className='flex items-center gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-green-50'>
                        <input type='radio' name='instruction' checked={selectedDeliveryInstruction === 'neighbor'} onChange={() => setSelectedDeliveryInstruction('neighbor')} />
                        <span className='text-sm font-medium'>Leave with neighbor</span>
                      </label>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setCurrentStep(3)}
                  className='w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600'
                >
                  Continue to Payment
                </button>
              </>
            )}

            {/* ─── STEP 3: PAYMENT ─── */}
            {currentStep === 3 && (
              <>
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Payment Method</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {paymentMethods.map((method) => (
                      <label key={method.id} className={`flex items-center gap-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === method.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}>
                        <input 
                          type='radio' 
                          name='payment' 
                          checked={selectedPayment === method.id} 
                          onChange={() => setSelectedPayment(method.id)}
                        />
                        <img src={method.icon} alt={method.name} className='w-10 h-10 object-contain' />
                        <div className='flex-1'>
                          <div className='font-semibold text-sm'>{method.name}</div>
                          <div className='text-xs text-gray-500'>{method.details}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {!selectedPayment && <p className='text-xs text-red-500 mt-3'>Please select a payment method</p>}
                  <div className='mt-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-3'>
                    <div className='font-semibold text-green-800 text-sm'>🔒 100% Secure Payment Gateway</div>
                    <div className='text-xs text-green-700 mt-1'>256-bit SSL encrypted. PCI DSS Compliant.</div>
                  </div>
                </div>

                {/* Coupon */}
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Apply Coupon</h3>
                  {!appliedCoupon ? (
                    <div className='space-y-2'>
                      <div className='flex gap-2'>
                        <input 
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          placeholder='Enter coupon code (Try: WELCOME10)'
                          className='flex-1 border border-gray-300 rounded-lg p-3 text-sm'
                        />
                        <button onClick={handleApplyCoupon} className='px-6 bg-green-500 text-white rounded-lg font-bold'>Apply</button>
                      </div>
                      {couponError && <p className='text-xs text-red-500'>{couponError}</p>}
                      <div className='text-xs text-gray-500'>Available: WELCOME10, SAVE20, FREESHIP</div>
                    </div>
                  ) : (
                    <div className='bg-green-50 border border-green-300 rounded-lg p-3 text-center'>
                      <div className='font-bold text-green-800'>{appliedCoupon} Applied! ✓</div>
                      <div className='text-sm text-green-700'>You saved ${discount}</div>
                      <button onClick={() => {setAppliedCoupon(null); setCoupon('')}} className='text-xs text-green-600 mt-2 underline'>Change</button>
                    </div>
                  )}
                </div>

                {/* Communication Preferences */}
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Communication</h3>
                  <div className='space-y-3'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                      <input type='checkbox' checked={smsUpdates} onChange={() => setSmsUpdates(!smsUpdates)} />
                      <span>Get SMS updates on order status</span>
                    </label>
                    <label className='flex items-center gap-3 cursor-pointer'>
                      <input type='checkbox' checked={newsletter} onChange={() => setNewsletter(!newsletter)} />
                      <span>Subscribe to our newsletter for deals & updates</span>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentStep(4)}
                  className='w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600'
                >
                  Confirm Order
                </button>
              </>
            )}

            {/* ─── STEP 4: CONFIRMATION ─── */}
            {currentStep === 4 && (
              <>
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Order Confirmation</h3>
                  <div className='space-y-4 text-sm'>
                    <div className='pb-3 border-b border-gray-200'>
                      <div className='font-semibold text-gray-700'>Delivery To</div>
                      <div className='text-gray-600'>{fullName}, {streetAddress}, {city} - {pincode}</div>
                    </div>
                    <div className='pb-3 border-b border-gray-200'>
                      <div className='font-semibold text-gray-700'>Delivery Method</div>
                      <div className='text-gray-600'>{selectedDelivery === 'express' ? 'Express (1-2 Days) - $99' : 'Standard (3-5 Days) - FREE'}</div>
                    </div>
                    <div className='pb-3 border-b border-gray-200'>
                      <div className='font-semibold text-gray-700'>Payment Method</div>
                      <div className='text-gray-600'>{paymentMethods.find(m => m.id === selectedPayment)?.name}</div>
                    </div>
                    <div className='pb-3 border-b border-gray-200'>
                      <div className='font-semibold text-gray-700'>Delivery Instructions</div>
                      <div className='text-gray-600'>
                        {selectedDeliveryInstruction === 'ring-bell' && 'Ring bell before delivery'}
                        {selectedDeliveryInstruction === 'leave-door' && 'Leave at door'}
                        {selectedDeliveryInstruction === 'call-first' && 'Call me before delivery'}
                        {selectedDeliveryInstruction === 'signature' && 'Require signature'}
                        {selectedDeliveryInstruction === 'neighbor' && 'Leave with neighbor'}
                      </div>
                    </div>
                    {appliedCoupon && (
                      <div className='pb-3 border-b border-gray-200'>
                        <div className='font-semibold text-gray-700'>Coupon Applied</div>
                        <div className='text-green-600'>{appliedCoupon} - Save ${discount}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                  <label className='flex items-start gap-3 cursor-pointer'>
                    <input 
                      type='checkbox' 
                      checked={agreeTerms} 
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className='mt-1'
                    />
                    <div className='flex-1'>
                      <span className='text-sm'>I agree to the </span>
                      <button 
                        onClick={() => setShowTermsModal(true)}
                        className='text-green-600 underline'
                      >
                        Terms of Service
                      </button>
                      <span className='text-sm'> and </span>
                      <button 
                        onClick={() => setShowTermsModal(true)}
                        className='text-green-600 underline'
                      >
                        Privacy Policy
                      </button>
                    </div>
                  </label>
                  {!agreeTerms && <p className='text-xs text-red-500 mt-3'>Please accept the terms and conditions</p>}
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={!agreeTerms}
                  className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Place the Order
                </button>
              </>
            )}

          </div>

          {/* ─── RIGHT: ORDER SUMMARY ─── */}
          <aside className='w-full lg:w-96 h-fit'>
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-48'>
              <h2 className='text-lg font-bold text-gray-800 mb-4'>Order Summary</h2>

              {/* Items */}
              <div className='space-y-3 border-b border-gray-200 pb-4 max-h-96 overflow-y-auto'>
                {cartItems.filter(i => i && i.selectedVariant).map((item, idx) => (
                  <div key={idx} className='flex items-center gap-3'>
                    <img src={item.image} alt={item.name} className='w-16 h-16 object-contain rounded' />
                    <div className='flex-1'>
                      <div className='font-semibold text-sm'>{item.name}</div>
                      <div className='text-xs text-gray-500 mb-1'>Qty: {cartQuantities[idx]}</div>
                      <div className='flex gap-1'>
                        <button onClick={() => handleQuantityChange(idx, cartQuantities[idx] - 1)} className='px-2 py-1 bg-gray-200 text-xs rounded'>−</button>
                        <button onClick={() => handleQuantityChange(idx, cartQuantities[idx] + 1)} className='px-2 py-1 bg-gray-200 text-xs rounded'>+</button>
                        <button className='ml-auto text-xs text-red-600 hover:underline'>Remove</button>
                      </div>
                    </div>
                    <div className='font-bold text-sm'>${((item.selectedVariant?.price ?? 0) * cartQuantities[idx]).toFixed(0)}</div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className='mt-4 space-y-2 text-sm border-b border-gray-200 pb-4'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(0)}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(0)}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className='flex justify-between text-green-600 font-semibold'>
                    <span>Discount ({appliedCoupon})</span>
                    <span>-${discount}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className='mt-4 pt-4 flex justify-between items-center text-lg font-bold'>
                <span>Total</span>
                <span className='text-2xl text-green-600'>${total.toFixed(0)}</span>
              </div>

              {/* Trust Badges */}
              <div className='mt-6 space-y-3 pt-4 border-t border-gray-200'>
                <div className='flex items-start gap-3 text-xs'>
                  <img src='/assets/icons/secure-payment.png' alt='Secure' className='w-8 h-8 flex-shrink-0' />
                  <div>
                    <div className='font-semibold'>100% Secure</div>
                    <div className='text-gray-500'>SSL Encrypted</div>
                  </div>
                </div>
                <div className='flex items-start gap-3 text-xs'>
                  <img src='/assets/icons/easy-returns.png' alt='Returns' className='w-8 h-8 flex-shrink-0' />
                  <div>
                    <div className='font-semibold'>Easy Returns</div>
                    <div className='text-gray-500'>7 days hassle-free</div>
                  </div>
                </div>
                <div className='flex items-start gap-3 text-xs'>
                  <img src='/assets/icons/fast-delivery.png' alt='Delivery' className='w-8 h-8 flex-shrink-0' />
                  <div>
                    <div className='font-semibold'>Fast Delivery</div>
                    <div className='text-gray-500'>On-time guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* ─── TERMS MODAL ─── */}
      {showTermsModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto'>
            <div className='p-6'>
              <h2 className='text-2xl font-bold mb-4'>Terms & Conditions</h2>
              <div className='space-y-4 text-sm text-gray-700'>
                <p><strong>1. Order Acceptance:</strong> We reserve the right to accept or reject any order at our discretion.</p>
                <p><strong>2. Pricing:</strong> All prices include applicable taxes unless stated otherwise.</p>
                <p><strong>3. Delivery:</strong> Delivery dates are estimates and not guaranteed. We will use our best efforts to deliver within the specified timeframe.</p>
                <p><strong>4. Returns & Refunds:</strong> Items can be returned within 7 days of delivery in original condition for a full refund.</p>
                <p><strong>5. Payment:</strong> We accept all major payment methods. Your payment information is secure and encrypted.</p>
                <p><strong>6. Liability:</strong> We are not liable for any indirect or consequential damages.</p>
                <p><strong>7. Privacy:</strong> Your personal information will be kept confidential and used only for order fulfillment.</p>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className='mt-6 w-full bg-green-500 text-white py-2 rounded-lg font-bold'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Checkout
