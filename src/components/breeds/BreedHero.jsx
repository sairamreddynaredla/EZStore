const BreedHero = ({ breed }) => {
  return (
    <section className="bg-[#f4c267] rounded-[40px] overflow-hidden min-h-[650px]">
      
      <div className="grid lg:grid-cols-2 items-stretch h-full">

        {/* LEFT CONTENT */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">

          <p className="text-sm font-semibold text-gray-700 mb-4">
            Meet the Breed
          </p>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-black mb-6">
            {breed.name}
          </h1>

          <p className="text-lg leading-8 text-gray-800 mb-8 max-w-xl">
            {breed.description}
          </p>

          <div className="flex gap-4 flex-wrap">
            {breed?.traits?.map((item, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-white rounded-full font-semibold shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="h-full min-h-[650px]">
          <img
            src={breed.image}
            alt={breed.name}
            className="w-full h-full object-cover"
          />
        </div>

      </div>

    </section>
  );
};

export default BreedHero;