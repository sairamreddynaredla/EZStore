import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import MegaMenu from "./MegaMenu";

const NavbarDropdown = () => {
  const [activeMenu, setActiveMenu] = useState(null); // 'Dogs' | 'Cats' | 'Brands' | null
  const timerRef = useRef(null);
  const OPEN_DELAY = 100; // ms
  const CLOSE_DELAY = 150; // ms

  const openMenu = (name) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActiveMenu(name), OPEN_DELAY);
  };

  const closeMenu = (name) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!name || activeMenu === name) setActiveMenu(null);
    }, CLOSE_DELAY);
  };

  const handleBrandSelect = () => setActiveMenu(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        setActiveMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-2">
      <div onMouseEnter={() => openMenu("Dogs")} onMouseLeave={() => closeMenu("Dogs")}>
        <MegaMenu
          label="Dogs"
          isOpen={activeMenu === "Dogs"}
          onOpen={() => openMenu("Dogs")}
          onClose={() => closeMenu("Dogs")}
        />
      </div>
      <div onMouseEnter={() => openMenu("Cats")} onMouseLeave={() => closeMenu("Cats")}>
        <MegaMenu
          label="Cats"
          isOpen={activeMenu === "Cats"}
          onOpen={() => openMenu("Cats")}
          onClose={() => closeMenu("Cats")}
        />
      </div>
      <div onMouseEnter={() => openMenu("Brands")} onMouseLeave={() => closeMenu("Brands")}>
        <MegaMenu
          label="Brands"
          isOpen={activeMenu === "Brands"}
          onOpen={() => openMenu("Brands")}
          onClose={() => closeMenu("Brands")}
        />
      </div>
    </div>
  );
};

export default NavbarDropdown;
