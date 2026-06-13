// src/components/breeds/BreedDetailsLayout.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dogBreedsDetails from "../../data/dogBreedsDetails";

const sections = [
  "overview",
  "nutrition",
  "training",
  "puppy-care",
  "lifestyle",
  "faq",
];

const BreedDetailsLayout = () => {
  const { slug } = useParams();

  const breed = dogBreedsDetails.find(
    (item) => item.slug === slug
  );

  const [activeSection, setActiveSection] =
    useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      sections.forEach((section) => {
        const el =
          document.getElementById(section);

        if (el) {
          const top =
            el.offsetTop - 150;

          const bottom =
            top + el.offsetHeight;

          if (
            window.scrollY >= top &&
            window.scrollY <= bottom
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  if (!breed) {
    return (
      <div className="h-screen flex items-center justify-center text-5xl font-bold">
        Breed Not Found
      </div>
    );
  }

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <div className="w-full bg-[#f7f4ef] overflow-x-hidden">

      {/* TOP SLIDER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-10 py-5 flex justify-center gap-10 overflow-x-auto">

        {sections.map((section) => (
          <div
            key={section}
            onClick={() =>
              scrollToSection(section)
            }
            className="flex flex-col items-center cursor-pointer min-w-fit"
          >
            <div
              className={`w-4 h-4 rounded-full mb-2 transition-all duration-300 ${
                activeSection === section
                  ? "bg-orange-500 scale-110"
                  : "bg-gray-300"
              }`}
            />

            <span
              className={`text-xs font-semibold uppercase ${
                activeSection === section
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
            >
              {section.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>

      {/* HERO */}
      <section className="w-[88%] mx-auto mt-14 bg-[#f5e7d7] rounded-2xl p-12 flex flex-col lg:flex-row gap-16 items-center">

        <div className="flex-1">
          <img
            src={breed.banner.image}
            alt={breed.slug}
            className="w-full rounded-3xl object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-[#1d1d1d]">
            {breed.banner.title}
          </h1>

          <h3 className="text-2xl text-orange-500 mt-5 font-semibold">
            {breed.banner.subtitle}
          </h3>

          <div className="flex flex-wrap gap-4 mt-8">
            {breed.banner.traits.map(
              (trait, index) => (
                <span
                  key={index}
                  className="px-5 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold"
                >
                  {trait}
                </span>
              )
            )}
          </div>

          <p className="mt-8 text-[17px] leading-9 text-gray-700">
            {breed.banner.description}
          </p>
        </div>
      </section>

      {/* OVERVIEW IMAGE SECTION */}

<section
  id="overview"
  className="w-[88%] mx-auto mt-20"
>

  <div className="overflow-hidden rounded-[40px]">

    <img
      src={breed.overview.image}
      alt={breed.name}
      className="w-full object-cover"
      loading="lazy"
    />

  </div>

</section>

      {/* CONTENT */}
      {breed.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="w-[88%] mx-auto mt-28"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#222] mb-10">
            {section.title}
          </h2>

          <div className="overflow-hidden rounded-[30px]">
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-130 object-cover hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          </div>

          <div className="mt-10">
            <p className="text-[17px] leading-9 text-gray-700 mb-8">
              {section.content.text}
            </p>

            {section.content.list && (
              <ul className="pl-5 space-y-4 list-disc">
                {section.content.list.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="text-gray-700 leading-8"
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            )}

            {section.content.table && (
              <div className="overflow-x-auto mt-10 rounded-3xl">
                <table className="w-full bg-white overflow-hidden">

                  <thead className="bg-orange-500 text-white">
                    <tr>
                      {section.content.table.headers.map(
                        (
                          header,
                          index
                        ) => (
                          <th
                            key={index}
                            className="p-5 text-left"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {section.content.table.rows.map(
                      (row, index) => (
                        <tr
                          key={index}
                          className="border-b"
                        >
                          {row.map(
                            (
                              cell,
                              cellIndex
                            ) => (
                              <td
                                key={cellIndex}
                                className="p-5 text-gray-700"
                              >
                                {cell}
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* FUN FACTS */}
      <section className="w-[88%] mx-auto mt-28">
        <h2 className="text-5xl font-bold mb-10">
          Fun Trivia: Did You Know?
        </h2>

        <div className="space-y-5">
          {breed.trivia.map(
            (fact, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 flex gap-6"
              >
                <span className="text-3xl font-bold text-orange-500">
                  0{index + 1}
                </span>

                <p className="text-gray-700 leading-8 text-lg">
                  {fact}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="w-[88%] mx-auto mt-28"
      >
        <h2 className="text-5xl font-bold mb-10">
          FAQs
        </h2>

        <div className="space-y-5">
          {breed.faqs.map((faq, index) => (
            <details
              key={index}
              className="bg-white rounded-3xl p-7"
            >
              <summary className="cursor-pointer text-lg font-semibold">
                {faq.q}
              </summary>

              <p className="mt-5 text-gray-700 leading-8">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* RELATED */}
      <section className="w-[88%] mx-auto mt-28 pb-24">
        <h2 className="text-5xl font-bold mb-10">
          Related Breeds
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

          {breed.breedsList.map(
            (item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-55 object-cover"
                  loading="lazy"
                />

                <h4 className="p-5 text-lg font-semibold">
                  {item.name}
                </h4>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default BreedDetailsLayout;