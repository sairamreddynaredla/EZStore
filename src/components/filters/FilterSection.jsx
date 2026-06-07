import { useState } from "react";

import { FiChevronDown } from "react-icons/fi";

function FilterSection({

  title,

  options = [],

  selectedOptions = [],

  setSelectedOptions,

}) {

  const [open, setOpen] =
    useState(true);

  const handleCheckboxChange = (
    option
  ) => {

    if (
      selectedOptions.includes(option)
    ) {

      setSelectedOptions(

        selectedOptions.filter(
          (item) => item !== option
        )
      );

    } else {

      setSelectedOptions([
        ...selectedOptions,
        option,
      ]);
    }
  };

  return (

    <div className="border-b border-gray-200 py-5">

      {/* Header */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="w-full flex items-center justify-between"
      >

        <h3 className="font-semibold text-[#111827]">

          {title}

        </h3>

        <FiChevronDown
          className={`transition duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {/* Options */}
      {open && (

        <div className="mt-4 space-y-3">

          {options.map((option) => (

            <label
              key={option}
              className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-black transition"
            >

              <input
                type="checkbox"

                checked={selectedOptions.includes(
                  option
                )}

                onChange={() =>
                  handleCheckboxChange(
                    option
                  )
                }

                className="w-4 h-4 rounded border-gray-300"
              />

              <span>

                {option}

              </span>

            </label>

          ))}

        </div>

      )}

    </div>
  );
}

export default FilterSection;