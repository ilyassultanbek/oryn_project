import { useState } from "react";
import { Link } from "react-router-dom";
import { districts } from "../../data/districts";

function DistrictDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className="relative"
      onBlur={(event) => {
        // Фокус мәзірден шыққанда жабылады
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
          event.currentTarget.querySelector("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="district-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 transition-colors hover:text-amber-600"
      >
        Аудандар
        <span aria-hidden="true">{isOpen ? "▴" : "▾"}</span>
      </button>

      {isOpen && (
        <ul
          id="district-dropdown"
          className="absolute left-0 top-full z-50 mt-3 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-blue-700 dark:bg-blue-900"
        >
          {districts.map((district) => (
            <li key={district.id}>
              <Link
                to={`/districts/${district.id}`}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-200 dark:hover:bg-blue-800 dark:focus-visible:bg-blue-800"
              >
                {district.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default DistrictDropdown;