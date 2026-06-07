import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  HeartHandshake,
  PawPrint,
  ChevronRight,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const trustFeatures = [

  {
    id: 1,
    icon: <ShieldCheck size={34} />,
    title: "100% Genuine Products",
    description:
      "We carefully source authentic pet food and essentials from trusted global brands.",
  },

  {
    id: 2,
    icon: <Truck size={34} />,
    title: "Fast & Secure Delivery",
    description:
      "Premium packaging and quick shipping designed for safe doorstep delivery.",
  },

  {
    id: 3,
    icon: <BadgeCheck size={34} />,
    title: "Vet Recommended Choices",
    description:
      "Curated nutrition and wellness products recommended for healthy pets.",
  },

  {
    id: 4,
    icon: <HeartHandshake size={34} />,
    title: "Trusted Pet Community",
    description:
      "Thousands of pet parents trust eZSTORE for quality products and care.",
  },

]

const TrustSection = () => {

  const navigate = useNavigate()

  return (

    <section className="py-24 bg-[#f8f8f8] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        {/* TOP */}

        <div className="text-center mb-20">

          <div className="flex justify-center mb-5">

            <div className="bg-red-100 text-red-500 w-16 h-16 rounded-full flex items-center justify-center">

              <PawPrint size={30} />

            </div>

          </div>

          <p className="text-red-500 uppercase tracking-[4px] font-semibold mb-4">

            Why Pet Parents Trust Us

          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">

            Trusted Pet Care,
            Delivered With Love

          </h2>

          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">

            eZSTORE brings together premium pet nutrition,
            trusted care essentials, and a modern shopping
            experience designed for pet parents.

          </p>

        </div>

        {/* TRUST GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">

          {trustFeatures.map((item) => (

            <div
              key={item.id}
              className="group bg-white rounded-[34px] p-8 border border-gray-100 hover:shadow-2xl transition duration-500"
            >

              {/* ICON */}

              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mb-7 group-hover:scale-110 transition">

                {item.icon}

              </div>

              {/* TITLE */}

              <h3 className="text-2xl font-bold text-gray-900 mb-5 leading-snug">

                {item.title}

              </h3>

              {/* DESCRIPTION */}

              <p className="text-gray-600 leading-relaxed text-lg">

                {item.description}

              </p>

            </div>

          ))}

        </div>

        {/* BOTTOM BANNER */}

        <div className="relative bg-[#16325B] rounded-[42px] overflow-hidden px-8 md:px-14 py-14">

          {/* GLOW */}

          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>

          {/* CONTENT */}

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

            {/* LEFT */}

            <div className="max-w-2xl">

              <p className="text-red-400 uppercase tracking-[4px] font-semibold mb-4">

                eZSTORE Community

              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">

                Building A Better
                Experience For Pet Parents

              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">

                From premium food to trusted care essentials,
                eZSTORE is focused on making pet parenting
                simpler, healthier, and more joyful.

              </p>

            </div>

            {/* RIGHT */}

            <div className="flex flex-col sm:flex-row gap-5">

                <button
                type="button"
                onClick={() => navigate('/shop')}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-5 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
              >
                Explore Products
                <ChevronRight size={20} />
              </button>

              <Link to="/" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-5 rounded-2xl font-semibold transition">

                Learn More

              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>

  )
}

export default TrustSection