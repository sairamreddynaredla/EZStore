const BreedInfo = ({ breed }) => {
  return (
    <section className="bg-white rounded-[30px] p-10 mt-10 border">

      <h2 className="text-3xl font-bold mb-10">
        At A Glance
      </h2>

      <div className="grid md:grid-cols-4 gap-8">

        <div>
          <p className="text-gray-500 mb-2">Size</p>
          <h3 className="font-bold text-xl">{breed.size}</h3>
        </div>

        <div>
          <p className="text-gray-500 mb-2">Lifespan</p>
          <h3 className="font-bold text-xl">{breed.lifespan}</h3>
        </div>

        <div>
          <p className="text-gray-500 mb-2">Weight</p>
          <h3 className="font-bold text-xl">{breed.weight}</h3>
        </div>

        <div>
          <p className="text-gray-500 mb-2">Grooming</p>
          <h3 className="font-bold text-xl">{breed.grooming}</h3>
        </div>

      </div>

    </section>
  );
};

export default BreedInfo;