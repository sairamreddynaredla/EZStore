const DeliveryBox = () => {
  return (

    <div className="bg-[#f8f8f8] border border-gray-200 rounded-[28px] p-6">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-xl font-bold text-gray-900">
            Fast Delivery Available 🚚
          </h3>

          <p className="text-gray-500 mt-1">
            Delivery within 2-4 business days
          </p>

        </div>

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          Free Shipping
        </div>

      </div>

    </div>

  )
}

export default DeliveryBox