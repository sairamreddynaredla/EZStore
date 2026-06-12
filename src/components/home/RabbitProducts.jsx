import { Link } from 'react-router-dom'
import ProductGrid from '../products/ProductGrid'
import { rabbitFood } from '../../data/rabbit'

const RabbitProducts = () => {
  const products = rabbitFood.slice(0, 8)

  return (
    <section className="px-6 md:px-10 py-20 bg-white">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-12">

        <div>

          <h2 className="text-4xl md:text-5xl font-bold mb-3">Rabbit Essentials</h2>

          <p className="text-gray-500 text-lg">Top rabbit foods and supplies</p>

        </div>

        <Link
          to="/shop?pet=Rabbit"
          className="bg-orange-500 hover:bg-orange-600 transition text-white px-8 py-4 rounded-full font-semibold w-fit"
        >
          View All Rabbit Products
        </Link>

      </div>

      <ProductGrid products={products} />

    </section>
  )
}

export default RabbitProducts
