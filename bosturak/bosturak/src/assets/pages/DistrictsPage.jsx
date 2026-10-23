import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ParkingCard from "../components/ParkingCard";
import DistrictFilters from "../components/districts/DistrictFilters";
import DistrictStats from "../components/districts/DistrictStats";

import { useParkings } from "../../context/ParkingsContext";
import { useFavorites } from "../../hooks/useFavorites";
import { useDistrictParkings } from "../../hooks/useDistrictParkings";

const districtNames = {
  alatau: "Алатау",
  almaly: "Алмалы",
  auezov: "Әуезов",
  bostandyk: "Бостандық",
  zhetysu: "Жетісу",
  medeu: "Медеу",
  nauryzbay: "Наурызбай",
  turksib: "Түрксіб",
};

function DistrictsPage() {
  const { districtId } = useParams();
  const navigate = useNavigate();

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

  const validDistrict =
    !districtId || Object.hasOwn(districtNames, districtId);

  const selectedDistrict = validDistrict
    ? districtNames[districtId] ?? ""
    : "";

  const filters = useDistrictParkings({
    parkings,
    selectedDistrict,
    validDistrict,
    favorites,
  });

  const busy = loading || saving;

  const favoritesUnavailable =
    filters.onlyFavorites &&
    (favoritesLoading || Boolean(favoritesError));

  function changeDistrict(id) {
    navigate(id ? `/districts/${id}` : "/districts");
  }

  function resetFilters() {
    filters.resetFilters();
    changeDistrict("");
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f7f9fc]
        text-slate-900 dark:bg-blue-950 dark:text-white"
    >
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {!validDistrict ? (
          <div>
            <h1 className="text-2xl font-bold">
              Аудан табылмады
            </h1>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 text-violet-600 underline
                dark:text-violet-300"
            >
              Барлық ауданға қайту
            </button>
          </div>
        ) : (
          <>
            <div
              className="flex flex-wrap items-center
                justify-between gap-4"
            >
              <h1 className="text-3xl font-bold">
                {selectedDistrict
                  ? `${selectedDistrict} ауданының тұрақтары`
                  : "Аудандар бойынша тұрақтар"}
              </h1>

              <button
                type="button"
                onClick={reloadParkings}
                disabled={busy}
                className="rounded-xl border border-slate-300
                  bg-white px-4 py-2 text-sm text-slate-700
                  transition-colors hover:bg-slate-50
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-violet-600
                  disabled:cursor-not-allowed disabled:opacity-60
                  dark:border-blue-700 dark:bg-blue-900
                  dark:text-white dark:hover:bg-blue-800
                  motion-reduce:transition-none"
              >
                {loading ? "Жүктелуде..." : "Деректерді жаңарту"}
              </button>
            </div>

            {loading ? (
              <p
                role="status"
                className="mt-6 rounded-xl bg-white p-6
                  text-slate-500 dark:bg-blue-900
                  dark:text-slate-300"
              >
                Тұрақ деректері жүктелуде...
              </p>
            ) : loadError ? (
              <p
                role="alert"
                className="mt-6 rounded-xl bg-red-50 p-4
                  text-red-800 dark:bg-red-950 dark:text-red-200"
              >
                Тұрақ деректерін жүктеу мүмкін болмады.
                «Деректерді жаңарту» батырмасымен қайталап
                көріңіз.
              </p>
            ) : (
              <>
                <DistrictStats
                  stats={filters.stats}
                  hasPartialData={filters.hasPartialData}
                />

                <DistrictFilters
                  filters={filters}
                  districtId={districtId ?? ""}
                  districtNames={districtNames}
                  onDistrictChange={changeDistrict}
                  onReset={resetFilters}
                />

                {favoritesError && (
                  <div
                    className="mt-5 rounded-xl bg-amber-50 p-4
                      text-sm text-amber-900
                      dark:bg-amber-950 dark:text-amber-200"
                  >
                    <p role="alert">{favoritesError}</p>

                    <button
                      type="button"
                      onClick={refreshFavorites}
                      disabled={favoritesLoading || favoritesSaving}
                      className="mt-3 rounded underline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-amber-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60"
                    >
                      Таңдаулыларды қайта жүктеу
                    </button>
                  </div>
                )}

                {favoritesLoading && !filters.onlyFavorites && (
                  <p role="status" className="mt-4 text-sm">
                    Таңдаулылар жүктелуде...
                  </p>
                )}

                {favoritesSaving && (
                  <p role="status" className="mt-4 text-sm">
                    Таңдаулылар сақталуда...
                  </p>
                )}

                <p
                  aria-live="polite"
                  className="my-5 text-sm text-gray-500
                    dark:text-gray-300"
                >
                  {filters.onlyFavorites && favoritesLoading
                    ? "Таңдаулылар жүктелуде..."
                    : favoritesUnavailable
                      ? "Таңдаулылар тізімі қазір қолжетімсіз."
                      : `Табылған тұрақ: ${filters.visibleParkings.length}`}
                </p>

                {!favoritesUnavailable && (
                  <>
                    <div
                      className="grid grid-cols-1 gap-5
                        md:grid-cols-2 lg:grid-cols-3"
                    >
                      {filters.visibleParkings.map((parking) => (
                        <ParkingCard
                          key={parking.id}
                          parking={parking}
                          isFavorite={favorites.includes(parking.id)}
                          onToggleFavorite={toggleFavorite}
                          favoriteDisabled={favoritesLoading || favoritesSaving}
                        />
                      ))}
                    </div>

                    {filters.visibleParkings.length === 0 && (
                      <div
                        className="rounded-2xl bg-white p-10
                          text-center dark:bg-blue-900"
                      >
                        <p className="font-semibold">
                          Тұрақ табылмады
                        </p>

                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-4 text-violet-600 underline
                            dark:text-violet-300"
                        >
                          Сүзгілерді тазалау
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default DistrictsPage;