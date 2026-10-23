import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ParkingCard from "../components/ParkingCard";
import { useParkings } from "../../context/ParkingsContext";

function hasValidCoordinates(parking) {
  return (
    Number.isFinite(parking.lat) &&
    Number.isFinite(parking.lng) &&
    parking.lat >= -90 &&
    parking.lat <= 90 &&
    parking.lng >= -180 &&
    parking.lng <= 180
  );
}

function MapPage() {
  const {
    parkings,
    loading,
    saving,
    loadError,
    reloadParkings,
  } = useParkings();

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const initialBoundsSet = useRef(false);

  const [selectedParkingId, setSelectedParkingId] = useState(null);

  const selectedParking =
    parkings.find((parking) => parking.id === selectedParkingId) ??
    null;

  // Картаны бет ашылғанда ғана құрамыз.
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = L.map(mapContainer.current).setView(
      [43.2389, 76.8897],
      12
    );

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    const markers = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersRef.current = markers;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
      initialBoundsSet.current = false;
    };
  }, []);

  // Деректер өзгергенде тек белгілерді жаңартамыз.
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;

    if (!map || !markers) return;

    markers.clearLayers();

    const bounds = [];

    parkings.forEach((parking) => {
      if (!hasValidCoordinates(parking)) return;

      const position = [parking.lat, parking.lng];
      bounds.push(position);

      const color =
        parking.freeSpaces == null
          ? "#9ca3af"
          : parking.freeSpaces > 0
            ? "#22c55e"
            : "#ef4444";

      const marker = L.circleMarker(position, {
        radius: 12,
        color: "#ffffff",
        weight: 3,
        fillColor: color,
        fillOpacity: 1,
      }).addTo(markers);

      const tooltip = document.createElement("span");
      tooltip.textContent = parking.name;
      marker.bindTooltip(tooltip);

      marker.on("click", () => {
        setSelectedParkingId(parking.id);

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) {
          map.setView(position, 15, { animate: false });
        } else {
          map.flyTo(position, 15);
        }
      });
    });

    // Алғашқы деректер келгенде тұрақтарды экранға сыйғызамыз.
    if (!initialBoundsSet.current && bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 14,
        animate: false,
      });

      initialBoundsSet.current = true;
    }
  }, [parkings]);

  const busy = loading || saving;

  return (
    <div
      className="flex min-h-screen flex-col
        dark:bg-blue-950 dark:text-white"
    >
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Тұрақтар картасы
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              Картадағы белгіге басып, тұрақ ақпаратын көріңіз.
            </p>
          </div>

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

        <div className="my-5 flex flex-wrap gap-5 text-sm">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-green-500"
            />
            Бос орын бар
          </span>

          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-red-500"
            />
            Орын жоқ
          </span>

          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-gray-400"
            />
            Ақпарат жоқ
          </span>
        </div>

        <div aria-live="polite" className="mb-4 text-sm">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-300">
              Тұрақ деректері жүктелуде...
            </p>
          ) : loadError ? (
            <p className="text-red-700 dark:text-red-300">
              Деректер жаңартылмады. «Деректерді жаңарту»
              батырмасымен қайталап көріңіз. Картада бұрын
              жүктелген ақпарат қалуы мүмкін.
            </p>
          ) : (
            <p className="text-slate-500 dark:text-slate-300">
              Барлығы: {parkings.length} тұрақ.
              Ақпаратты жаңарту үшін жоғарыдағы батырманы басыңыз.
            </p>
          )}
        </div>

        <div
          className="relative z-0 overflow-hidden
            rounded-3xl border border-gray-200
            dark:border-blue-700"
        >
          <div
            ref={mapContainer}
            role="region"
            aria-label="Алматыдағы тұрақтар картасы"
            className="h-[450px] w-full md:h-[600px]"
          />
        </div>

        {selectedParking ? (
          <section
            aria-labelledby="selected-parking-title"
            className="mt-6 max-w-lg"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2
                id="selected-parking-title"
                className="text-lg font-semibold"
              >
                Таңдалған тұрақ
              </h2>

              <button
                type="button"
                onClick={() => setSelectedParkingId(null)}
                className="rounded text-sm text-violet-600
                  hover:underline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-violet-600
                  dark:text-violet-300"
              >
                Жабу ✕
              </button>
            </div>

            <ParkingCard parking={selectedParking} />
          </section>
        ) : (
          !loading &&
          !loadError && (
            <p className="mt-5 text-sm text-gray-500 dark:text-gray-300">
              {parkings.length === 0
                ? "Тұрақтар әзірге жоқ."
                : "Ақпаратты көру үшін картадан тұрақ таңдаңыз."}
            </p>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MapPage;