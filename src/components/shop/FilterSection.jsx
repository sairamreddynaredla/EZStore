import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-semibold text-[18px]"
      >
        {title}

        <ChevronDown
          size={20}
          className={`transition duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;