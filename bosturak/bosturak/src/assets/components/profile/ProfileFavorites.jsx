
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  CircleParking,
  RefreshCw,
  ArrowRight,
  Wallet,
  CarFront,
} from "lucide-react";

import { useFavorites } from "../../../hooks/useFavorites";
import { useParkings } from "../../../context/ParkingsContext";

import ParkingDetailsModal from "../parking/ParkingDetailsModal";

function ProfileFavorites() {
  const {
    favorites,
    favoritesError,
    favoritesLoading,
    favoritesSaving,
    toggleFavorite,
    refreshFavorites,
  } = useFavorites();

  const {
    parkings,
    loading: parkingsLoading,
    loadError,
    reloadParkings,
  } = useParkings();

  const [selectedParkingId, setSelectedParkingId] = useState(null);

  const favoriteParkings = useMemo(() => {
    const favoriteIds = new Set(favorites.map(String));

    return parkings.filter((parking) =>
      favoriteIds.has(String(parking.id))
    );
  }, [favorites, parkings]);

  const selectedParking = useMemo(
    () =>
      parkings.find(
        (parking) =>
          String(parking.id) === String(selectedParkingId)
      ) ?? null,
    [parkings, selectedParkingId]
  );

  const loading = favoritesLoading || parkingsLoading;
  const hasError = Boolean(favoritesError || loadError);

  function handleRefresh() {
    if (loading || favoritesSaving) return;

    refreshFavorites();

    if (!parkingsLoading && !loadError) {
      reloadParkings();
    }
  }

  async function handleRemoveFavorite(id) {
    await toggleFavorite(id);
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Таңдаулы тұрақтар
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Сақталған тұрақтарыңызды бір жерден басқарыңыз.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || favoritesSaving}
          className="
            inline-flex items-center gap-2
            rounded-xl border border-slate-200
            bg-white px-4 py-2.5 text-sm font-medium
            text-slate-700 transition hover:bg-slate-50
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-slate-700 dark:bg-slate-800
            dark:text-white dark:hover:bg-slate-700
          "
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Жаңарту
        </button>
      </div>

      {/* Error */}
      {hasError && (
        <div
          role="alert"
          className="
            rounded-2xl border border-red-200
            bg-red-50 p-4 text-sm text-red-700
            dark:border-red-900 dark:bg-red-950/30
            dark:text-red-300
          "
        >
          {favoritesError || loadError}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div
          role="status"
          className="
            rounded-[22px] border border-slate-100
            bg-white p-12 text-center text-sm
            text-slate-500 dark:border-slate-700
            dark:bg-slate-900 dark:text-slate-400
          "
        >
          Таңдаулы тұрақтар жүктелуде...
        </div>
      ) : !hasError && favoriteParkings.length === 0 ? (
        /* Empty state */
        <div
          className="
            rounded-[22px] border border-dashed
            border-slate-200 bg-white px-6 py-14
            text-center dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <div
            className="
              mx-auto flex h-16 w-16
              items-center justify-center rounded-2xl
              bg-emerald-50 text-emerald-600
              dark:bg-emerald-950 dark:text-emerald-400
            "
          >
            <Heart size={28} />
          </div>

          <h3 className="mt-5 text-lg font-bold dark:text-white">
            Таңдаулы тұрақтар жоқ
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            Ұнаған тұрақтарыңызды таңдаулыларға қосыңыз.
            Олар осы бөлімде көрсетіледі.
          </p>

          <Link
            to="/parkings"
            className="
              mt-6 inline-flex items-center gap-2
              rounded-xl bg-emerald-600 px-5 py-3
              text-sm font-semibold text-white
              transition hover:bg-emerald-700
            "
          >
            Тұрақтарды қарау
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        /* Favorite parking cards */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favoriteParkings.map((parking) => {
            const hasAvailability = parking.freeSpaces != null;
            const hasFreeSpaces =
              hasAvailability && parking.freeSpaces > 0;

            const price =
              parking.price == null
                ? "Белгісіз"
                : Number(parking.price) === 0
                  ? "Тегін"
                  : `${parking.price} ₸/сағ`;

            return (
              <article
                key={parking.id}
                className="
                  flex flex-col overflow-hidden
                  rounded-[22px] border border-slate-100
                  bg-white shadow-sm transition
                  hover:-translate-y-1 hover:shadow-md
                  dark:border-slate-700 dark:bg-slate-900
                "
              >
                {/* Card top */}
                <div className="flex items-start justify-between gap-3 p-5">
                  <div
                    className="
                      flex h-12 w-12 items-center
                      justify-center rounded-2xl
                      bg-emerald-50 text-emerald-600
                      dark:bg-emerald-950 dark:text-emerald-400
                    "
                  >
                    <CircleParking size={25} />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFavorite(parking.id)
                    }
                    disabled={favoritesSaving}
                    title="Таңдаулылардан алып тастау"
                    aria-label={`${parking.name} тұрақтарын таңдаулылардан алып тастау`}
                    className="
                      rounded-xl bg-red-50 p-2.5
                      text-red-500 transition hover:bg-red-100
                      disabled:cursor-not-allowed disabled:opacity-50
                      dark:bg-red-950/30 dark:hover:bg-red-950/50
                    "
                  >
                    <Heart size={19} fill="currentColor" />
                  </button>
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col px-5 pb-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {parking.name}
                  </h3>

                  <p
                    className="
                      mt-2 flex items-start gap-2
                      text-sm text-slate-500 dark:text-slate-400
                    "
                  >
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      {parking.address || "Мекенжай көрсетілмеген"}
                    </span>
                  </p>

                  {/* Availability badge */}
                  <div className="mt-4">
                    <span
                      className={`
                        inline-flex rounded-full
                        px-3 py-1.5 text-xs font-semibold
                        ${
                          !hasAvailability
                            ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            : hasFreeSpaces
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }
                      `}
                    >
                      {!hasAvailability
                        ? "Қолжетімділік белгісіз"
                        : hasFreeSpaces
                          ? "Бос орын бар"
                          : "Бос орын жоқ"}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Wallet size={15} />
                        <span className="text-xs">Бағасы</span>
                      </div>

                      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                        {price}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CarFront size={15} />
                        <span className="text-xs">Бос орын</span>
                      </div>

                      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                        {hasAvailability
                          ? `${parking.freeSpaces}${
                              parking.capacity != null
                                ? ` / ${parking.capacity}`
                                : ""
                            }`
                          : "Белгісіз"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedParkingId(parking.id)
                    }
                    className="
                      mt-5 w-full rounded-xl
                      bg-emerald-600 px-4 py-3
                      text-sm font-semibold text-white
                      transition hover:bg-emerald-700
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-emerald-600
                    "
                  >
                    Толығырақ
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Existing reusable modal */}
      {selectedParking && (
        <ParkingDetailsModal
          parking={selectedParking}
          onClose={() => setSelectedParkingId(null)}
        />
      )}
    </section>
  );
}

export default ProfileFavorites;
