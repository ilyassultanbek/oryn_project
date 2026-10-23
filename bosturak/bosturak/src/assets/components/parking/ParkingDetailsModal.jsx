
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import {
  X,
  MapPin,
  CarFront,
  Wallet,
  Warehouse,
  Navigation,
} from "lucide-react";

import ParkingReviews from "./ParkingReviews";

// Reusable information card
function DetailItem({ icon: Icon, label, value }) {
  return (
    <div
      className="
        rounded-2xl bg-slate-50 p-4
        dark:bg-blue-800
      "
    >
      <div
        className="
          flex items-center gap-2
          text-slate-500 dark:text-slate-300
        "
      >
        <Icon size={17} aria-hidden="true" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}

function ParkingDetailsModal({ parking, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  const parkingId = parking?.id;

  // Modal keyboard handling and scroll locking
  useEffect(() => {
    if (parkingId == null) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements =
        dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [parkingId, onClose]);

  // No selected parking
  if (!parking) return null;

  // Parking availability
  const hasAvailability = parking.freeSpaces != null;

  const hasFreeSpaces =
    hasAvailability && parking.freeSpaces > 0;

  const freePercent =
    hasAvailability && parking.capacity > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (parking.freeSpaces / parking.capacity) * 100
          )
        )
      : 0;

  // Parking coordinates
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

  // Parking status
  const availabilityStatus = !hasAvailability
    ? "Қолжетімділік белгісіз"
    : hasFreeSpaces
      ? "Бос орын бар"
      : "Бос орын жоқ";

  const availabilityColor = !hasAvailability
    ? "bg-slate-100 text-slate-600 dark:bg-blue-800 dark:text-slate-200"
    : hasFreeSpaces
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";

  return createPortal(
    <div
      className="
        fixed inset-0 z-[1000]
        flex items-center justify-center
        bg-slate-950/65 p-0
        backdrop-blur-sm sm:p-5
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="parking-modal-title"
        className="
          flex h-full w-full max-w-3xl
          flex-col overflow-hidden
          bg-white text-slate-900 shadow-2xl
          dark:bg-blue-900 dark:text-white
          sm:h-auto sm:max-h-[90vh] sm:rounded-3xl
        "
      >
        {/* Modal header */}
        <header
          className="
            flex shrink-0 items-center
            justify-between gap-4
            border-b border-slate-100
            px-6 py-5
            dark:border-blue-800
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-xs font-semibold uppercase
                tracking-widest text-violet-600
                dark:text-violet-300
              "
            >
              ORYN · ТҰРАҚ ТУРАЛЫ
            </p>

            <h2
              id="parking-modal-title"
              className="
                mt-1 break-words
                text-xl font-bold
                sm:text-2xl
              "
            >
              {parking.name}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Терезені жабу"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl text-slate-500
              transition-colors
              hover:bg-slate-100
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-violet-600
              dark:text-slate-200
              dark:hover:bg-blue-800
              motion-reduce:transition-none
            "
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        {/* Scrollable modal content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Location */}
          <div
            className="
              flex items-start gap-3
              text-sm text-slate-500
              dark:text-slate-300
            "
          >
            <MapPin
              size={19}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <div>
              <p className="break-words">
                {parking.address}
              </p>

              <p className="mt-1">
                {parking.district} ауданы
              </p>
            </div>
          </div>

          {/* Parking status */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`
                rounded-full px-3 py-1.5
                text-xs font-semibold
                ${availabilityColor}
              `}
            >
              {availabilityStatus}
            </span>

            <span
              className="
                rounded-full bg-violet-50
                px-3 py-1.5 text-xs
                font-semibold text-violet-700
                dark:bg-violet-900
                dark:text-violet-100
              "
            >
              {parking.isCovered
                ? "Жабық тұрақ"
                : "Ашық тұрақ"}
            </span>
          </div>

          {/* Parking statistics */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <DetailItem
              icon={CarFront}
              label="Бос орындар"
              value={
                hasAvailability
                  ? `${parking.freeSpaces} / ${parking.capacity}`
                  : "Ақпарат жоқ"
              }
            />

            <DetailItem
              icon={Wallet}
              label="Бағасы"
              value={
                parking.price === 0
                  ? "Тегін"
                  : `${parking.price} ₸/сағ`
              }
            />

            <DetailItem
              icon={Warehouse}
              label="Тұрақ түрі"
              value={
                parking.isCovered
                  ? "Жабық"
                  : "Ашық"
              }
            />
          </div>

          {/* Availability progress */}
          {hasAvailability && parking.capacity > 0 && (
            <section
              aria-label="Бос орындардың үлесі"
              className="
                mt-6 rounded-2xl
                border border-slate-200 p-5
                dark:border-blue-700
              "
            >
              <div
                className="
                  flex items-center
                  justify-between gap-3
                  text-sm
                "
              >
                <span className="font-medium">
                  Бос орындардың үлесі
                </span>

                <span
                  className="
                    text-slate-500
                    dark:text-slate-300
                  "
                >
                  {Math.round(freePercent)}%
                </span>
              </div>

              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(freePercent)}
                aria-label="Бос орындардың пайызы"
                className="
                  mt-3 h-2.5 overflow-hidden
                  rounded-full bg-slate-100
                  dark:bg-blue-800
                "
              >
                <div
                  className={`
                    h-full rounded-full
                    transition-[width] duration-300
                    motion-reduce:transition-none
                    ${
                      hasFreeSpaces
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }
                  `}
                  style={{
                    width: `${freePercent}%`,
                  }}
                />
              </div>
            </section>
          )}

          {/* Parking features */}
          <section className="mt-8">
            <h3 className="text-lg font-semibold">
              Тұрақ ерекшеліктері
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {(parking.features ?? []).length > 0 ? (
                [...new Set(parking.features)].map(
                  (feature) => (
                    <span
                      key={feature}
                      className="
                        rounded-xl bg-slate-100
                        px-3 py-2 text-xs
                        text-slate-600
                        dark:bg-blue-800
                        dark:text-slate-200
                      "
                    >
                      {feature}
                    </span>
                  )
                )
              ) : (
                <p
                  className="
                    text-sm text-slate-500
                    dark:text-slate-300
                  "
                >
                  Қосымша ерекшеліктер көрсетілмеген.
                </p>
              )}
            </div>
          </section>

          {/* Reviews and ratings */}
          <section
            className="
              mt-8 border-t border-slate-100
              pt-6 dark:border-blue-800
            "
          >
            <ParkingReviews
              key={parking.id}
              parkingId={parking.id}
            />
          </section>
        </div>

        {/* Modal footer */}
        <footer
          className="
            flex shrink-0 flex-wrap
            items-center justify-end gap-3
            border-t border-slate-100
            bg-white px-6 py-4
            dark:border-blue-800
            dark:bg-blue-900
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl border border-slate-200
              px-5 py-3 text-sm font-medium
              transition-colors
              hover:bg-slate-50
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-violet-600
              dark:border-blue-700
              dark:hover:bg-blue-800
            "
          >
            Жабу
          </button>

          {routeUrl && (
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center
                justify-center gap-2
                rounded-xl bg-violet-600
                px-5 py-3 text-sm
                font-medium text-white
                transition-colors
                hover:bg-violet-700
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-violet-600
                motion-reduce:transition-none
              "
            >
              <Navigation
                size={17}
                aria-hidden="true"
              />

              Бағыт құру
            </a>
          )}
        </footer>
      </div>
    </div>,
    document.body
  );
}

export default ParkingDetailsModal;
