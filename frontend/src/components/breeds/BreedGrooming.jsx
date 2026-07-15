const BreedGrooming = ({ breed }) => {
  return (
    <section className="mt-14 px-6">
      <div className="bg-[#f6df9f] rounded-[30px] p-10">
        <h2 className="text-4xl font-bold mb-10">{breed?.grooming?.title}</h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* IMAGE */}

          <div>
            <img
              src={breed?.grooming?.image}
              alt={breed?.name}
              className="w-full rounded-3xl object-cover"
              loading="lazy"
            />
          </div>

          {/* TIPS */}

          <div className="space-y-4">
            {breed?.grooming?.tips?.map((item, index) => (
              <div key={index} className="bg-white rounded-[20px] p-5 border">
                <h3 className="font-semibold text-lg">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreedGrooming;
