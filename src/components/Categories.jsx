import { Link } from 'react-router-dom'

const dog =
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&auto=format&fit=crop"

const cat =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop"

const bird =
  "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&auto=format&fit=crop"

const fish =
  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&auto=format&fit=crop"

const rabbit =
  "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&auto=format&fit=crop"

const hamster =
  "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&auto=format&fit=crop"

const categories = [
  {
    title: 'Dog Food',
    image: dog,
    color: 'bg-blue-100',
    slug: 'dog-food',
  },

  {
    title: 'Cat Food',
    image: cat,
    color: 'bg-orange-100',
    slug: 'cat-food',
  },

  {
    title: 'Bird Food',
    image: bird,
    color: 'bg-yellow-100',
    slug: 'bird-food',
  },

  {
    title: 'Fish Food',
    image: fish,
    color: 'bg-pink-100',
    slug: 'fish-food',
  },

  {
    title: 'Rabbit Food',
    image: rabbit,
    color: 'bg-green-100',
    slug: 'rabbit-food',
  },

  {
    title: 'Hamster Food',
    image: hamster,
    color: 'bg-red-100',
    slug: 'hamster-food',
  },
]

function Categories() {
  return (
    <section className='px-6 md:px-10 py-20 bg-[#f8f8f8]'>

      <div className='text-center mb-14'>

        <h2 className='text-4xl md:text-5xl font-bold'>
          Browse by Pet Category
        </h2>

        <p className='text-gray-500 mt-4 text-lg'>
          Explore foods for all your lovely pets
        </p>

      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8'>

        {categories.map((item, index) => (

          <Link
            key={index}
            to={`/category/${item.slug}`}
            className={`${item.color}
            rounded-[30px]
            p-6
            text-center
            hover:scale-105
            duration-300
            cursor-pointer
            shadow-sm
            hover:shadow-xl`}
          >

            <div className='overflow-hidden rounded-[20px]'>

              <img
                src={item.image}
                alt='category'
                className='w-full h-40 object-cover mx-auto hover:scale-110 duration-500'
              />

            </div>

            <h3 className='mt-5 font-bold text-xl'>
              {item.title}
            </h3>

          </Link>

        ))}

      </div>

    </section>
  )
}

export default Categories