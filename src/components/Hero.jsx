const heroCat = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop"
const heroDog = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop"

function Hero() {
  return (
    <section className='grid grid-cols-1 lg:grid-cols-2 gap-6 px-10 mt-10'>
      <div className='bg-black rounded-[40px] overflow-hidden relative min-h-[420px]'>
        <img
          src={heroCat}
          className='absolute inset-0 w-full h-full object-cover opacity-80'
          alt='cat'
        />
        <div className='relative z-10 p-10 text-white max-w-md'>
          <h1 className='text-5xl font-bold leading-tight'>
            Your One Stop Shop For Quality Pet Foods
          </h1>
          <p className='mt-5 text-gray-200'>
            Discover premium healthy food for your pets.
          </p>
          <button className='mt-8 bg-orange-500 px-8 py-3 rounded-full'>
            Shop Now
          </button>
        </div>
      </div>

      <div className='bg-sky-100 rounded-[40px] overflow-hidden relative min-h-[420px]'>
        <img
          src={heroDog}
          className='absolute inset-0 w-full h-full object-cover'
          alt='dog'
        />
        <div className='relative z-10 p-10 max-w-md'>
          <h1 className='text-5xl font-bold leading-tight'>
            Delicious Meals For Your Dogs
          </h1>
          <button className='mt-8 bg-orange-500 text-white px-8 py-3 rounded-full'>
            Shop Now
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero