
import { Star } from "lucide-react";

function RatingStars({
  value = 0,
  count,
  size = 18,
}) {
  const numericValue = Number(value) || 0;
  const rounded = Math.round(numericValue);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        aria-label={`Баға: 5-тен ${numericValue.toFixed(1)}`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={size}
            className={
              index < rounded
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300 dark:text-slate-500"
            }
          />
        ))}
      </div>

      <span className="text-sm font-semibold">
        {numericValue > 0
          ? numericValue.toFixed(1)
          : "Бағаланбаған"}
      </span>

      {count != null && (
        <span className="text-xs text-slate-500 dark:text-slate-300">
          ({count} пікір)
        </span>
      )}
    </div>
  );
}

export default RatingStars;
