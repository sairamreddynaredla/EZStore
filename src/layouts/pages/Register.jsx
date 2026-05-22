import Navbar from '../../components/Navbar'

import {
  User,
  Mail,

  Lock,
  PawPrint,
} from 'lucide-react'

import { Link } from 'react-router-dom'

const Register = () => {

  return (
    <div className='min-h-screen bg-[#f8f8f8]'>

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <div className='max-w-7xl mx-auto px-5 md:px-10 py-16'>

        <div className='grid lg:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-lg'>

          {/* LEFT SIDE */}
          <div className='hidden lg:flex flex-col justify-center bg-orange-500 text-white p-16'>

            <div className='max-w-md'>

              <div className='flex items-center gap-4 mb-8'>

                <div className='bg-white/20 p-4 rounded-full'>
                  <PawPrint size={40} />
                </div>

                <h1 className='text-5xl font-bold'>
                  Pet Store
                </h1>

              </div>

              <h2 className='text-6xl font-bold leading-[75px] mb-8'>
                Create Your Pet Care Account
              </h2>

              <p className='text-xl leading-[40px] text-orange-100'>
                Join thousands of pet lovers
                shopping premium nutrition,
                treats, toys, and healthcare
                products for their pets.
              </p>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className='p-8 md:p-16 flex flex-col justify-center'>

            {/* TITLE */}
            <div className='mb-10'>

              <h1 className='text-5xl font-bold mb-4'>
                Create Account
              </h1>

              <p className='text-gray-500 text-lg'>
                Start shopping premium products for your pets.
              </p>

            </div>

            {/* FORM */}
            <div className='space-y-6'>

              {/* FULL NAME */}
              <div className='relative'>

                <User
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400'
                  size={22}
                />

                <input
                  type='text'
                  placeholder='Full Name'
                  className='w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg'
                />

              </div>

              {/* EMAIL */}
              <div className='relative'>

                <Mail
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400'
                  size={22}
                />

                <input
                  type='email'
                  placeholder='Email Address'
                  className='w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg'
                />

              </div>

              {/* PASSWORD */}
              <div className='relative'>

                <Lock
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400'
                  size={22}
                />

                <input
                  type='password'
                  placeholder='Password'
                  className='w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg'
                />

              </div>

              {/* CONFIRM PASSWORD */}
              <div className='relative'>

                <Lock
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400'
                  size={22}
                />

                <input
                  type='password'
                  placeholder='Confirm Password'
                  className='w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg'
                />

              </div>

              {/* TERMS */}
              <label className='flex items-start gap-3 text-gray-600 text-sm leading-7'>

                <input
                  type='checkbox'
                  className='mt-1'
                />

                I agree to the Terms &
                Conditions and Privacy Policy.

              </label>

              {/* REGISTER BUTTON */}
              <button className='w-full bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-2xl text-xl font-bold'>

                Create Account

              </button>

              {/* DIVIDER */}
              <div className='flex items-center gap-4 py-2'>

                <div className='flex-1 h-[1px] bg-gray-200'></div>

                <span className='text-gray-400'>
                  OR
                </span>

                <div className='flex-1 h-[1px] bg-gray-200'></div>

              </div>

              {/* GOOGLE SIGNUP */}
              <button className='w-full border border-gray-300 hover:border-orange-500 transition py-5 rounded-2xl text-lg font-semibold'>

                Continue With Google

              </button>

              {/* LOGIN */}
              <p className='text-center text-gray-500 text-lg'>

                Already have an account?

                <Link
                  to='/login'
                  className='text-orange-500 font-semibold ml-2'
                >
                  Login
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register