
import { Star } from "lucide-react";

function ParkingCard({
  parking,
  rating,
  isFavorite = false,
  onToggleFavorite,
  favoriteDisabled = false,
  onOpenDetails,
}) {
  // =====================================
  // RATING
  // =====================================

  const averageRating = Number(rating?.averageRating ?? 0);
  const reviewCount = Number(rating?.reviewCount ?? 0);

  const hasReviews = reviewCount > 0;

  // =====================================
  // AVAILABILITY
  // =====================================

  const hasData = parking.freeSpaces != null;

  const hasFreeSpaces =
    hasData && Number(parking.freeSpaces) > 0;

  const freePercent =
    hasData && Number(parking.capacity) > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (Number(parking.freeSpaces) /
              Number(parking.capacity)) *
              100
          )
        )
      : 0;

  const statusColor = !hasData
    ? "bg-gray-400"
    : hasFreeSpaces
      ? "bg-green-500"
      : "bg-red-500";

  // =====================================
  // GOOGLE MAPS
  // =====================================

  const hasCoordinates =
    parking.lat != null &&
    parking.lng != null &&
    Number.isFinite(Number(parking.lat)) &&
    Number.isFinite(Number(parking.lng));

  const routeUrl = hasCoordinates
    ? "https://www.google.com/maps/dir/?api=1" +
      `&destination=${encodeURIComponent(
        `${parking.lat},${parking.lng}`
      )}&travelmode=driving`
    : null;

  // =====================================
  // PRICE
  // =====================================

  const price = Number(parking.price);

  const priceLabel =
    parking.price == null || !Number.isFinite(price)
      ? "Бағасы белгісіз"
      : price === 0
        ? "Тегін"
        : `${price} ₸ / сағ`;

  // =====================================
  // FEATURES
  // =====================================

  const features = Array.isArray(parking.features)
    ? [...new Set(parking.features)]
    : [];

  return (
    <article
      className="
        flex h-full flex-col rounded-2xl
        border border-gray-200 bg-white p-5
        text-slate-900 shadow-sm
        transition-shadow hover:shadow-md
        dark:border-blue-700
        dark:bg-blue-900 dark:text-white
      "
    >
      {/* =====================================
          TITLE & FAVORITES
      ===================================== */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-xl font-semibold">
            {parking.name}
          </h2>

          <p className="mt-2 break-words text-sm text-gray-600 dark:text-gray-300">
            {parking.address}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
            {parking.district} ауданы
          </p>
        </div>

        {typeof onToggleFavorite === "function" && (
          <button
            type="button"
            disabled={favoriteDisabled}
            onClick={() => onToggleFavorite(parking.id)}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `${parking.name}: таңдаулылардан алып тастау`
                : `${parking.name}: таңдаулыларға қосу`
            }
            className={`
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-lg text-2xl
              transition-colors
              enabled:hover:bg-gray-100
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-violet-600
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:enabled:hover:bg-blue-800
              ${
                isFavorite
                  ? "text-amber-500"
                  : "text-gray-400"
              }
            `}
          >
            <span aria-hidden="true">
              {isFavorite ? "★" : "☆"}
            </span>
          </button>
        )}
      </div>

      {/* =====================================
          RATING
      ===================================== */}

      <div className="mt-4 flex items-center gap-2">
        <Star
          size={18}
          className={
            hasReviews
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300 dark:text-gray-500"
          }
          aria-hidden="true"
        />

        {hasReviews ? (
          <>
            <span className="text-sm font-semibold">
              {averageRating.toFixed(1)}
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-300">
              ({reviewCount} пікір)
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-300">
            Әзірге бағаланбаған
          </span>
        )}
      </div>

      {/* =====================================
          PARKING TYPE
      ===================================== */}

      <p className="mt-3 text-sm">
        {parking.price == null
          ? "Түрі белгісіз"
          : price > 0
            ? "Ақылы"
            : "Тегін"}
        {" · "}
        {parking.isCovered ? "Жабық" : "Ашық"}
      </p>

      {/* =====================================
          AVAILABILITY
      ===================================== */}

      <div className="mt-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-3 w-3 shrink-0 rounded-full ${statusColor}`}
        />

        <span className="text-sm">
          {!hasData
            ? "Бос орын туралы ақпарат жоқ"
            : hasFreeSpaces
              ? `Бос орын: ${parking.freeSpaces}`
              : "Бос орын жоқ"}
        </span>
      </div>

      {/* Availability progress */}

      <div
        aria-hidden="true"
        className="
          mt-3 h-2 overflow-hidden
          rounded-full bg-gray-200
          dark:bg-blue-800
        "
      >
        <div
          className={`h-full rounded-full ${statusColor}`}
          style={{
            width: `${freePercent}%`,
          }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
        Жалпы орын: {parking.capacity ?? "Белгісіз"}
      </p>

      {/* =====================================
          FEATURES
      ===================================== */}

      {features.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="
                rounded-lg bg-gray-100 px-2 py-1
                text-xs text-gray-600
                dark:bg-blue-800
                dark:text-gray-200
              "
            >
              {feature}
            </span>
          ))}
        </div>
      )}

      {/* =====================================
          PRICE
      ===================================== */}

      <div className="mt-auto pt-6">
        <p className="text-lg font-semibold">
          {priceLabel}
        </p>
      </div>

      {/* =====================================
          ACTIONS
      ===================================== */}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onOpenDetails?.(parking)}
          disabled={typeof onOpenDetails !== "function"}
          className="
            inline-flex items-center justify-center
            rounded-xl border border-violet-600
            px-4 py-2.5 text-sm font-medium
            text-violet-700 transition-colors
            hover:bg-violet-50
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-violet-600
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:border-violet-400
            dark:text-violet-300
            dark:hover:bg-blue-800
          "
        >
          Толық ақпарат
        </button>

        {routeUrl ? (
          <a
            href={routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              rounded-xl bg-violet-600
              px-4 py-2.5 text-sm
              font-medium text-white
              transition-colors
              hover:bg-violet-700
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-violet-600
            "
          >
            Бағыт құру →
          </a>
        ) : (
          <span
            className="
              inline-flex items-center justify-center
              rounded-xl bg-gray-100
              px-4 py-2.5 text-sm
              text-gray-500
              dark:bg-blue-800
              dark:text-gray-300
            "
          >
            Бағыт қолжетімсіз
          </span>
        )}
      </div>
    </article>
  );
}

export default ParkingCard;
