import royalcanin from "../../assets/brands/royal-canin.jpeg"
import purina from "../../assets/brands/purina.jpeg"
import farmina from "../../assets/brands/farmina.jpeg"
import orijen from "../../assets/brands/orijen.jpeg"
import drools from "../../assets/brands/drools.jpeg"
import meo from "../../assets/brands/meo.jpeg"
import kennelkitchen from "../../assets/brands/kennel-kitchen.jpeg"
import whiskas from "../../assets/brands/whiskas.jpeg"
import sheba from "../../assets/brands/sheba.jpeg"
import caninecreek from "../../assets/brands/canine-creek.jpeg"
import bellotta from "../../assets/brands/bellotta.jpeg"
import hikari from "../../assets/brands/hikari.jpeg"
import kaytee from "../../assets/brands/kaytee.jpeg"
import rio from "../../assets/brands/rio.jpeg"
import tetra from "../../assets/brands/tetra.jpeg"
import vitapol from "../../assets/brands/vitapol.jpeg"
import zupreem from "../../assets/brands/zupreem.jpeg"
import taiyo from "../../assets/brands/taiyo.jpeg"

const topBrands = [
  royalcanin,
  purina,
  farmina,
  orijen,
  drools,
  meo,
  kennelkitchen,
  whiskas,
  sheba,
]

const bottomBrands = [
  caninecreek,
  bellotta,
  hikari,
  kaytee,
  rio,
  tetra,
  vitapol,
  zupreem,
  taiyo,
]

const BrandsSection = () => {
  return (
    <section className="py-20 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Trusted Pet Brands
          </h2>

          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            Premium food & care brands trusted by pet parents worldwide
          </p>
        </div>

        {/* TOP ROW */}
        <div className="mb-8 overflow-hidden">
          <div className="flex gap-6 w-max animate-left">
            {[...topBrands, ...topBrands].map((logo, index) => (
              <div
                key={index}
                className="
                  min-w-[240px]
                  h-[130px]
                  bg-white
                  rounded-3xl
                  border border-gray-200
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  p-6
                  hover:-translate-y-1
                "
              >
                <img
                  src={logo}
                  alt="brand"
                  className="
                    max-w-full
                    max-h-full
                    object-contain
                    transition-transform
                    duration-300
                    hover:scale-105
                  "
                />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="overflow-hidden">
          <div className="flex gap-6 w-max animate-right">
            {[...bottomBrands, ...bottomBrands].map((logo, index) => (
              <div
                key={index}
                className="
                  min-w-[240px]
                  h-[130px]
                  bg-white
                  rounded-3xl
                  border border-gray-200
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  p-6
                  hover:-translate-y-1
                "
              >
                <img
                  src={logo}
                  alt="brand"
                  className="
                    max-w-full
                    max-h-full
                    object-contain
                    transition-transform
                    duration-300
                    hover:scale-105
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes scrollLeft {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes scrollRight {
            0% {
              transform: translateX(-50%);
            }

            100% {
              transform: translateX(0);
            }
          }

          .animate-left {
            animation: scrollLeft 28s linear infinite;
          }

          .animate-right {
            animation: scrollRight 28s linear infinite;
          }

          .animate-left:hover,
          .animate-right:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  )
}

export default BrandsSection