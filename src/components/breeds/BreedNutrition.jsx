const BreedNutrition = ({ breed }) => {

  if (!breed?.nutrition) return null;

  return (
    <section className="mt-12 px-6">

      <div className="bg-[#c9e7c2] rounded-[30px] p-10">

        <h2 className="text-4xl font-bold mb-6">
          {breed.nutrition.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* IMAGE */}
          <div>
            <img
              src={breed.nutrition.image}
              alt={breed.nutrition.title}
              className="w-full rounded-3xl object-cover"
              loading="lazy"
            />
          </div>

          {/* CONTENT */}
          <div>

            <div className="space-y-4 mb-10">

              {Array.isArray(breed.nutrition.description) ? (
                breed.nutrition.description.map((item, index) => (

                  <div
                    key={index}
                    className="bg-white rounded-[20px] p-5 border"
                  >
                    <h3 className="font-semibold text-lg">
                      {item}
                    </h3>
                  </div>

                ))
              ) : (

                <div className="bg-white rounded-[20px] p-5 border">
                  <h3 className="font-semibold text-lg">
                    {breed.nutrition.description}
                  </h3>
                </div>

              )}

            </div>

            {/* FEEDING TABLE */}
            <div className="overflow-x-auto">

              <table className="w-full border border-gray-300 rounded-2xl overflow-hidden">

                <thead className="bg-[#f4c267]">
                  <tr>
                    <th className="p-4 text-left">Age</th>
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Meals</th>
                    <th className="p-4 text-left">Tip</th>
                  </tr>
                </thead>

                <tbody>

                  {breed.nutrition.feedingTable?.map((item, index) => (

                    <tr
                      key={index}
                      className="border-t border-gray-200 bg-white"
                    >
                      <td className="p-4">{item.age}</td>
                      <td className="p-4">{item.quantity}</td>
                      <td className="p-4">{item.meals}</td>
                      <td className="p-4">{item.tip}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default BreedNutrition;