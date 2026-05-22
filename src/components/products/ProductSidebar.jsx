const ProductSidebar = () => {

  return (

    <div className="bg-white border border-gray-200 rounded-[24px] p-6 h-fit sticky top-24">

      <h3 className="text-4xl font-bold mb-8">

        Filter By

      </h3>

      {/* AVAILABILITY */}

      <div className="border-b border-gray-200 pb-6 mb-6">

        <h4 className="text-xl font-bold mb-5">

          Availability

        </h4>

        <label className="flex items-center gap-3 text-gray-700">

          <input type="checkbox" />

          Include Out Of Stock

        </label>

      </div>

      {/* PRICE */}

      <div className="border-b border-gray-200 pb-6 mb-6">

        <h4 className="text-xl font-bold mb-5">

          Price

        </h4>

        <input
          type="range"
          className="w-full"
        />

        <div className="flex justify-between mt-4 text-gray-500">

          <span>$10</span>
          <span>$500</span>

        </div>

        <button className="w-full h-14 bg-[#ffcc00] hover:bg-yellow-400 rounded-full font-semibold mt-6 transition">

          Apply Filters

        </button>

      </div>

      {/* PET TYPE */}

      <div className="border-b border-gray-200 pb-6 mb-6">

        <h4 className="text-xl font-bold mb-5">

          Pet Type

        </h4>

        <div className="space-y-4">

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Dog
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Cat
          </label>

        </div>

      </div>

      {/* BRANDS */}

      <div>

        <h4 className="text-xl font-bold mb-5">

          Brands

        </h4>

        <div className="space-y-4">

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Royal Canin
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Drools
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Pedigree
          </label>

        </div>

      </div>

    </div>

  )
}

export default ProductSidebar