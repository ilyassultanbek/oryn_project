
import { Link, useParams } from "react-router-dom";

import { useParkings } from "../../context/ParkingsContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ParkingDetailsPage() {
  const { id } = useParams();

  const {
    parkings,
    loading,
    loadError,
    reloadParkings,
  } = useParkings();

  const parking = parkings.find(
    (item) => String(item.id) === String(id)
  );

  if (loading && !parking) {
    return (
      <>
        <Header />
        <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-12">
          <p role="status">Тұрақ туралы ақпарат жүктелуде...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!parking) {
    return (
      <>
        <Header />
        <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-12">
          <h1 className="text-2xl font-bold">
            {loadError
              ? "Тұрақ деректерін жүктеу мүмкін болмады"
              : "Тұрақ табылмады"}
          </h1>

          {loadError && (
            <button
              type="button"
              onClick={reloadParkings}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-white"
            >
              Қайта жүктеу
            </button>
          )}

          <Link
            to="/parkings"
            className="mt-5 block text-violet-600 underline"
          >
            Барлық тұрақтарға қайту
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const hasAvailability = parking.freeSpaces != null;

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

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-blue-950 dark:text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <Link
          to="/parkings"
          className="text-sm font-medium text-violet-600 dark:text-violet-300"
        >
          ← Барлық тұрақтар
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            {parking.name}
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-300">
            {parking.address}
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            {parking.district} ауданы
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoCard
            label="Бос орындар"
            value={
              hasAvailability
                ? `${parking.freeSpaces} / ${parking.capacity}`
                : "Ақпарат жоқ"
            }
          />

          <InfoCard
            label="Бағасы"
            value={
              parking.price === 0
                ? "Тегін"
                : `${parking.price} ₸ / сағ`
            }
          />

          <InfoCard
            label="Тұрақ түрі"
            value={parking.isCovered ? "Жабық" : "Ашық"}
          />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-blue-700 dark:bg-blue-900">
          <h2 className="text-xl font-semibold">
            Тұрақ туралы
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {(parking.features ?? []).length > 0 ? (
              [...new Set(parking.features)].map((feature) => (
                <span
                  key={feature}
                  className="rounded-lg bg-slate-100 px-3 py-2
                    text-sm dark:bg-blue-800"
                >
                  {feature}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Қосымша ерекшеліктер көрсетілмеген.
              </p>
            )}
          </div>

          {routeUrl && (
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-xl
                bg-violet-600 px-5 py-3 text-sm
                font-medium text-white hover:bg-violet-700"
            >
              Картада бағыт құру →
            </a>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-blue-700 dark:bg-blue-900">
          <h2 className="text-xl font-semibold">
            Пікірлер мен бағалар
          </h2>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            Келесі қадамда осы бөлімге нақты рейтинг,
            қолданушылардың пікірлері және пікір қалдыру
            формасы қосылады.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-blue-700 dark:bg-blue-900">
      <p className="text-sm text-slate-500 dark:text-slate-300">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

export default ParkingDetailsPage;
