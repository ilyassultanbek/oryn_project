
import { ArrowDownUp } from "lucide-react";
import { parkingSortOptions } from "../../../utils/sortParkings";

function ParkingSort({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label
        htmlFor="parking-sort"
        className="
          flex items-center gap-2
          text-sm font-medium
          text-slate-700 dark:text-slate-200
        "
      >
        <ArrowDownUp size={17} aria-hidden="true" />
        Сұрыптау
      </label>

      <select
        id="parking-sort"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="
          min-w-48 rounded-xl
          border border-slate-300
          bg-white px-4 py-2.5
          text-sm text-slate-900
          outline-none
          transition-colors
          focus:border-violet-600
          focus:ring-2 focus:ring-violet-200
          disabled:cursor-not-allowed
          disabled:opacity-50
          dark:border-blue-700
          dark:bg-blue-900
          dark:text-white
          dark:focus:ring-violet-800
        "
      >
        {parkingSortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ParkingSort;
