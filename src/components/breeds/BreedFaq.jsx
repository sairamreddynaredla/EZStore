const BreedFAQ = ({ breed }) => {

  return (

    <section className="mt-14 px-6">

      <h2 className="text-4xl font-bold mb-10">

        FAQs

      </h2>

      <div className="space-y-5">

        {breed?.faqs?.map((item, index) => (

          <div
            key={index}
            className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >

            <h3 className="font-bold text-xl mb-3">

              {item.q}

            </h3>

            <p className="text-gray-600 leading-7">

              {item.a}

            </p>

          </div>

        ))}

      </div>

    </section>

  );
};

export default BreedFAQ;