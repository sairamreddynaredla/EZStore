import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function SearchBelowHero() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/pets?search=${encodeURIComponent(q.trim())}`);
      setQ("");
    }
  };

  return (
    <div className="w-full sm:hidden mt-0 mb-0">
      <div className="w-full bg-[#e6f0fb]">
        <div className="max-w-7xl mx-auto px-3 md:px-8 py-0">
            <div className="rounded-t-lg px-3 py-2 border border-[#d0e2fb] border-b-0">
              <form onSubmit={handleSearch} className="flex items-center bg-white border border-[#c7ddfb] rounded-full px-3 py-3 gap-2 shadow-sm max-w-lg mx-auto">
            <FaSearch className="text-[#4B5563] text-sm flex-shrink-0" />
            <input
              type="search"
              placeholder="Search for products, brands or categories"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-transparent text-[#1A1A1A] placeholder-[#9AA6B8] text-sm outline-none w-full"
            />
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
