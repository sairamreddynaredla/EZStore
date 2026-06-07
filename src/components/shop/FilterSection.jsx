import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-semibold text-[15px] text-gray-800 hover:text-black transition-colors"
        type="button"
      >
        <span>{title}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 text-gray-500 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2.5">{children}</div>
      </div>
    </div>
  );
};

export default FilterSection;
