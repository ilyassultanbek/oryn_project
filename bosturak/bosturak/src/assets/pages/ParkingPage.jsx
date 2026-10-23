
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { parkingTypes } from "../../data/parkingTypes";
import { useParkings } from "../../context/ParkingsContext";
import { useFavorites } from "../../hooks/useFavorites";
import { useParkingRatings } from "../../hooks/useParkingRatings";
import { sortParkings } from "../../utils/sortParkings";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ParkingCard from "../components/ParkingCard";
import ParkingSort from "../components/parking/ParkingSort";
import ParkingDetailsModal from "../components/parking/ParkingDetailsModal";

function ParkingsPage() {
  const [selectedParkingId, setSelectedParkingId] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  const {
    parkings,
    loading,
    saving,
    loadError,
    reloadParkings,
  } = useParkings();

  const {
    favorites,
    favoritesError,
    favoritesLoading,
    favoritesSaving,
    toggleFavorite,
    refreshFavorites,
  } = useFavorites();

  const {
    ratings,
    loading: ratingsLoading,
    error: ratingsError,
    refreshRatings,
  } = useParkingRatings();

  const { typeId } = useParams();
  const selectedType = typeId ?? "all";

  const currentType = parkingTypes.find(
    (type) => type.id === selectedType
  );

  const visibleParkings = useMemo(() => {
    const filtered = parkings.filter((parking) => {
      switch (selectedType) {
        case "free":
          return Number(parking.price) === 0;

        case "paid":
          return Number(parking.price) > 0;

        case "covered":
          return parking.isCovered === true;

        default:
          return true;
      }
    });

    return sortParkings(filtered, sortBy, ratings);
  }, [parkings, selectedType, sortBy, ratings]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map(String)),
    [favorites]
  );

  const selectedParking =
    parkings.find(
      (parking) =>
        String(parking.id) === String(selectedParkingId)
    ) ?? null;

  const busy = loading || saving;
  const favoritesBusy = favoritesLoading || favoritesSaving;
  const ratingSort = sortBy === "rating" || sortBy === "reviews";

  function openParkingDetails(parking) {
    setSelectedParkingId(parking.id);
  }

  function closeParkingDetails() {
    setSelectedParkingId(null);
  }

  async function refreshAll() {
    await Promise.all([
      reloadParkings(),
      refreshRatings(),
    ]);
  }

  return (
    <div className="flex min-h-screen flex-col dark:bg-blue-950 dark:text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {!currentType ? (
          <>
            <h1 className="text-2xl font-bold">
              Тұрақ түрі табылмады
            </h1>

            <Link
              to="/parkings"
              className="mt-4 inline-block text-violet-600 underline dark:text-violet-300"
            >
              Барлық тұрақтарға қайту
            </Link>
          </>
        ) : (
          <>
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">
                {currentType.name}
              </h1>

              <button
                type="button"
                onClick={refreshAll}
                disabled={busy || ratingsLoading}
                className="
                  rounded-xl border border-slate-300
                  bg-white px-4 py-2 text-sm text-slate-700
                  transition-colors hover:bg-slate-50
                  disabled:cursor-not-allowed disabled:opacity-60
                  dark:border-blue-700 dark:bg-blue-900
                  dark:text-white dark:hover:bg-blue-800
                "
              >
                {loading || ratingsLoading
                  ? "Жүктелуде..."
                  : "Деректерді жаңарту"}
              </button>
            </div>

            {/* Status */}
            <div aria-live="polite" className="mt-4 text-sm">
              {loading ? (
                <p className="text-slate-500 dark:text-slate-300">
                  Тұрақ деректері жүктелуде...
                </p>
              ) : loadError ? (
                <p className="text-red-700 dark:text-red-300">
                  Деректерді жүктеу мүмкін болмады.
                  «Деректерді жаңарту» батырмасымен
                  қайталап көріңіз.
                  {visibleParkings.length > 0 &&
                    " Төменде бұрын жүктелген ақпарат көрсетілген."}
                </p>
              ) : (
                <p className="text-slate-500 dark:text-slate-300">
                  Табылған тұрақтар: {visibleParkings.length}
                </p>
              )}
            </div>

            {/* Rating error */}
            {ratingsError && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200"
              >
                Рейтинг деректерін жүктеу мүмкін болмады.
                Қайта жүктеп көріңіз.
              </p>
            )}

            {/* Favorites error */}
            {favoritesError && (
              <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                <p role="alert">{favoritesError}</p>

                <button
                  type="button"
                  onClick={refreshFavorites}
                  disabled={favoritesBusy}
                  className="mt-3 rounded underline disabled:opacity-60"
                >
                  Таңдаулыларды қайта жүктеу
                </button>
              </div>
            )}

            {favoritesBusy && (
              <p
                role="status"
                className="mt-4 text-sm text-slate-500 dark:text-slate-300"
              >
                {favoritesLoading
                  ? "Таңдаулылар жүктелуде..."
                  : "Таңдаулылар сақталуда..."}
              </p>
            )}

            {/* Sorting */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <ParkingSort
                value={sortBy}
                onChange={setSortBy}
                disabled={ratingSort && ratingsLoading}
              />

              {ratingsLoading && (
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Рейтингтер жүктелуде...
                </p>
              )}
            </div>

            {/* Parking cards */}
            <div
              aria-busy={loading}
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleParkings.map((parking) => (
                <ParkingCard
                  key={parking.id}
                  parking={parking}
                  rating={ratings[String(parking.id)]}
                  isFavorite={favoriteIds.has(String(parking.id))}
                  onToggleFavorite={toggleFavorite}
                  favoriteDisabled={favoritesBusy}
                  onOpenDetails={openParkingDetails}
                />
              ))}
            </div>

            {/* Empty state */}
            {!loading &&
              !loadError &&
              visibleParkings.length === 0 && (
                <p className="mt-6 rounded-2xl bg-slate-50 p-6 text-slate-600 dark:bg-blue-900 dark:text-slate-300">
                  Бұл түрдегі тұрақтар әзірге жоқ.
                </p>
              )}
          </>
        )}
      </main>

      <ParkingDetailsModal
        parking={selectedParking}
        onClose={closeParkingDetails}
      />

      <Footer />
    </div>
  );
}

export default ParkingsPage;
