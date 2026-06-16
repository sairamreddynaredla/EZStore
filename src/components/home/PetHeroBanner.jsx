import { useNavigate } from "react-router-dom"

const PetHeroBanner = ({ image, title, subtitle, pet }) => {
  const navigate = useNavigate()

  return (
    <section className="px-6 md:px-10 mt-12">
      <div className="rounded-2xl overflow-hidden bg-white shadow-md flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-gray-600">{subtitle}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/shop')}
              className="bg-orange-500 text-white px-6 py-3 rounded-full shadow hover:opacity-95"
            >
              Shop for {pet}
            </button>
          </div>
        </div>

        <div className="md:w-1/2 w-full">
          <img src={image} alt={`${pet} banner`} className="w-full h-56 md:h-72 object-cover" />
        </div>
      </div>
    </section>
  )
}

export default PetHeroBanner
