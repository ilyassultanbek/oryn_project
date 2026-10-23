
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Search,
  RefreshCw,
  Pencil,
  CarFront,
} from "lucide-react";

import { useParkings } from "../../../context/ParkingsContext";

const ALMATY_CENTER = [43.2389, 76.8897];

function getStatus(parking) {
  if (parking.freeSpaces == null) {
    return {
      label: "Ақпарат жоқ",
      color: "#9ca3af",
    };
  }

  if (parking.freeSpaces > 0) {
    return {
      label: "Бос орын бар",
      color: "#22c55e",
    };
  }

  return {
    label: "Орын жоқ",
    color: "#ef4444",
  };
}

function hasCoordinates(parking) {
  return (
    Number.isFinite(parking.lat) &&
    Number.isFinite(parking.lng) &&
    parking.lat >= -90 &&
    parking.lat <= 90 &&
    parking.lng >= -180 &&
    parking.lng <= 180
  );
}

function AdminMapPanel({ onEditParking }) {
  const {
    parkings,
    loading,
    saving,
    loadError,
    reloadParkings,
  } = useParkings();

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const selectedIdRef = useRef(null);
  const initialBoundsSet = useRef(false);

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const districts = useMemo(
    () =>
      [...new Set(parkings.map((p) => p.district))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "kk")),
    [parkings]
  );

  const filteredParkings = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("kk-KZ");

    return parkings.filter((parking) => {
      const matchesDistrict =
        district === "all" || parking.district === district;

      const text = [
        parking.name,
        parking.address,
        parking.district,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("kk-KZ");

      return matchesDistrict && text.includes(query);
    });
  }, [parkings, search, district]);

  const selectedParking =
    parkings.find((parking) => parking.id === selectedId) ??
    null;

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView(
      ALMATY_CENTER,
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

  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;

    if (!map || !markers) return;

    markers.clearLayers();

    const bounds = [];

    filteredParkings.forEach((parking) => {
      if (!hasCoordinates(parking)) return;

      const position = [parking.lat, parking.lng];
      bounds.push(position);

      const status = getStatus(parking);

      const marker = L.circleMarker(position, {
        radius:
          selectedIdRef.current === parking.id ? 15 : 11,
        color: "#ffffff",
        weight: 3,
        fillColor: status.color,
        fillOpacity: 1,
      }).addTo(markers);

      const tooltip = document.createElement("span");
      tooltip.textContent = parking.name;
      marker.bindTooltip(tooltip);

      marker.on("click", () => {
        setSelectedId(parking.id);
        map.flyTo(position, 15, {
          animate: !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches,
        });
      });
    });

    if (!initialBoundsSet.current && bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 14,
        animate: false,
      });

      initialBoundsSet.current = true;
    }
  }, [filteredParkings, selectedId]);

  function focusParking(parking) {
    setSelectedId(parking.id);

    if (!hasCoordinates(parking) || !mapRef.current) return;

    mapRef.current.flyTo(
      [parking.lat, parking.lng],
      15,
      {
        animate: !window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches,
      }
    );
  }

  const mappedCount = filteredParkings.filter(
    hasCoordinates
  ).length;

  return (
    <section className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Барлық тұрақ",
            value: parkings.length,
          },
          {
            label: "Картадағы тұрақ",
            value: mappedCount,
          },
          {
            label: "Координатсыз тұрақ",
            value: filteredParkings.length - mappedCount,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {loadError ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Тұрақ іздеу..."
            aria-label="Картадан тұрақ іздеу"
            className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={district}
          onChange={(event) => setDistrict(event.target.value)}
          aria-label="Аудан бойынша сүзу"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <option value="all">Барлық аудандар</option>
          {districts.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={reloadParkings}
          disabled={loading || saving}
          className="flex items-center gap-2 rounded-xl bg-[#182523] px-4 py-3 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Жаңарту
        </button>
      </div>

      {loadError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          Деректерді жүктеу қатесі: {loadError}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-sm">
          <div
            ref={containerRef}
            role="region"
            aria-label="Әкімшілік тұрақтар картасы"
            className="relative z-0 h-[480px] w-full lg:h-[620px]"
          />
        </div>

        <aside className="rounded-3xl border border-white bg-white/90 p-5 shadow-sm">
          <h2 className="text-lg font-semibold">
            Тұрақтар тізімі
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredParkings.length} тұрақ табылды
          </p>

          <div className="mt-5 max-h-[530px] space-y-3 overflow-y-auto">
            {filteredParkings.map((parking) => {
              const status = getStatus(parking);
              const active = parking.id === selectedId;

              return (
                <button
                  key={parking.id}
                  type="button"
                  onClick={() => focusParking(parking)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                    active
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold">
                        {parking.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {parking.address}
                      </p>

                      <p
                        className="mt-2 text-xs font-medium"
                        style={{ color: status.color }}
                      >
                        {status.label}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredParkings.length === 0 && (
              <p className="text-sm text-slate-500">
                Тұрақтар табылмады.
              </p>
            )}
          </div>
        </aside>
      </div>

      {selectedParking && (
        <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedParking.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedParking.address}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onEditParking(selectedParking)}
              className="flex items-center gap-2 rounded-xl bg-[#182523] px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900"
            >
              <Pencil size={16} />
              Тұрақты өңдеу
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <CarFront size={18} />
              Бос орын:{" "}
              {selectedParking.freeSpaces ?? "Белгісіз"}
            </span>

            <span>
              Сыйымдылығы: {selectedParking.capacity}
            </span>

            <span>
              Бағасы: {selectedParking.price} ₸
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminMapPanel;
