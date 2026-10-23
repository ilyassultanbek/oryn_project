
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchOccupancy,
  updateOccupancy,
} from "../../../services/occupancyService";

function getStatusInfo(status) {
  switch (status) {
    case "full":
      return {
        label: "Толған",
        className: "bg-red-50 text-red-700",
      };

    case "available":
      return {
        label: "Бос орын бар",
        className: "bg-emerald-50 text-emerald-700",
      };

    default:
      return {
        label: "Белгісіз",
        className: "bg-slate-100 text-slate-600",
      };
  }
}

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function OccupancyBar({ percent }) {
  if (percent === null) {
    return (
      <span className="text-sm text-slate-400">
        Ақпарат жоқ
      </span>
    );
  }

  const safePercent = Math.max(
    0,
    Math.min(100, percent)
  );

  return (
    <div className="min-w-36">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          Толған
        </span>

        <span className="text-sm font-semibold text-slate-800">
          {safePercent}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${
            safePercent >= 90
              ? "bg-red-500"
              : safePercent >= 70
                ? "bg-amber-500"
                : "bg-emerald-500"
          }`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

function ParkingRow({ parking, saving, onSave }) {
  const [value, setValue] = useState(
    parking.freeSpaces === null
      ? ""
      : String(parking.freeSpaces)
  );

  const [unknown, setUnknown] = useState(
    parking.freeSpaces === null
  );

  useEffect(() => {
    setValue(
      parking.freeSpaces === null
        ? ""
        : String(parking.freeSpaces)
    );

    setUnknown(parking.freeSpaces === null);
  }, [parking.id, parking.freeSpaces]);

  const status = getStatusInfo(parking.status);

  const nextValue = unknown
    ? null
    : value.trim() === ""
      ? NaN
      : Number(value);

  const valid =
    unknown ||
    (
      Number.isInteger(nextValue) &&
      nextValue >= 0 &&
      nextValue <= parking.capacity
    );

  const changed =
    nextValue !== parking.freeSpaces;

  function handleSubmit(event) {
    event.preventDefault();

    if (!valid || !changed || saving) return;

    onSave(parking.id, nextValue);
  }

  return (
    <tr className="border-t border-slate-100 align-middle">
      <td className="px-5 py-5">
        <p className="font-medium text-slate-900">
          {parking.name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {parking.district}
        </p>
      </td>

      <td className="px-5 py-5 text-slate-700">
        {parking.capacity}
      </td>

      <td className="px-5 py-5">
        {parking.freeSpaces === null
          ? "Ақпарат жоқ"
          : parking.freeSpaces}
      </td>

      <td className="px-5 py-5">
        {parking.occupiedSpaces === null
          ? "Ақпарат жоқ"
          : parking.occupiedSpaces}
      </td>

      <td className="px-5 py-5">
        <OccupancyBar
          percent={parking.occupancyPercent}
        />
      </td>

      <td className="px-5 py-5">
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </td>

      <td className="px-5 py-5">
        <form
          onSubmit={handleSubmit}
          className="flex min-w-48 flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={parking.capacity}
              step="1"
              value={value}
              disabled={saving || unknown}
              onChange={(event) =>
                setValue(event.target.value)
              }
              aria-label={`${parking.name} бос орын саны`}
              className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 disabled:bg-slate-100"
            />

            <button
              type="submit"
              disabled={saving || !valid || !changed}
              className="rounded-xl bg-[#123d32] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1b5545] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "..." : "Сақтау"}
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={unknown}
              disabled={saving}
              onChange={(event) =>
                setUnknown(event.target.checked)
              }
              className="accent-emerald-700"
            />
            Ақпарат белгісіз
          </label>

          {!valid && (
            <p className="text-xs text-red-600">
              0–{parking.capacity} аралығында сан енгізіңіз.
            </p>
          )}
        </form>
      </td>
    </tr>
  );
}

function AdminOccupancyPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = useCallback(async (signal) => {
    try {
      setError("");

      const result = await fetchOccupancy({ signal });

      if (!signal?.aborted) {
        setData(result);
      }
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) {
        setError(err.message);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadData(controller.signal);

    return () => controller.abort();
  }, [loadData, refreshKey]);

  const parkings = useMemo(() => {
    if (!data) return [];

    const query = search.trim().toLocaleLowerCase();

    return data.parkings.filter((parking) => {
      const matchesSearch =
        parking.name.toLocaleLowerCase().includes(query) ||
        parking.district.toLocaleLowerCase().includes(query) ||
        parking.address.toLocaleLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || parking.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [data, search, filter]);

  async function handleSave(id, freeSpaces) {
    if (savingId !== null) return;

    setSavingId(id);
    setError("");
    setNotice("");

    try {
      await updateOccupancy(id, freeSpaces);
      await loadData();

      setNotice("Бос орын саны сәтті жаңартылды.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  function handleRefresh() {
    if (savingId !== null) return;

    setLoading(true);
    setNotice("");
    setRefreshKey((value) => value + 1);
  }

  if (loading && !data) {
    return (
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        Бос орындар туралы деректер жүктелуде...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8">
        <p role="alert" className="text-sm text-red-600">
          {error || "Деректерді жүктеу мүмкін болмады."}
        </p>

        <button
          type="button"
          onClick={handleRefresh}
          className="mt-4 rounded-xl bg-[#123d32] px-4 py-2 text-sm text-white"
        >
          Қайта жүктеу
        </button>
      </div>
    );
  }

  const { summary } = data;

  const stats = [
    {
      label: "Барлық тұрақтар",
      value: summary.totalParkings,
    },
    {
      label: "Жалпы сыйымдылық",
      value: summary.totalCapacity,
    },
    {
      label: "Белгілі бос орындар",
      value: summary.knownParkings > 0
        ? summary.freeSpaces
        : "Ақпарат жоқ",
      description: "Тек дерегі белгілі тұрақтар",
    },
    {
      label: "Белгілі толған орындар",
      value: summary.knownParkings > 0
        ? summary.occupiedSpaces
        : "Ақпарат жоқ",
      description: "Тек дерегі белгілі тұрақтар",
    },
    {
      label: "Толу деңгейі",
      value: summary.occupancyPercent === null
        ? "Ақпарат жоқ"
        : `${summary.occupancyPercent}%`,
      description: "Дерегі белгілі тұрақтар бойынша",
    },
    {
      label: "Дерегі белгісіз тұрақтар",
      value: summary.unknownParkings,
    },
  ];

  return (
    <div className="mt-6 space-y-6">
      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Тұрақтардың ағымдағы соңғы белгілі деректері
        </p>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={savingId !== null || loading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Жүктелуде..." : "Жаңарту"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Тұрақтардың толу жағдайы
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Бос орындар санын өзгертіп, PostgreSQL базасына сақтаңыз.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Тұрақты іздеу..."
              aria-label="Тұрақты іздеу"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-600"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Тұрақ күйін сүзу"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
            >
              <option value="all">Барлық күйлер</option>
              <option value="available">Бос орын бар</option>
              <option value="full">Толған</option>
              <option value="unknown">Белгісіз</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">Тұрақ</th>
                <th className="px-5 py-4 font-medium">Сыйымдылық</th>
                <th className="px-5 py-4 font-medium">Бос</th>
                <th className="px-5 py-4 font-medium">Толған</th>
                <th className="px-5 py-4 font-medium">Толу деңгейі</th>
                <th className="px-5 py-4 font-medium">Күйі</th>
                <th className="px-5 py-4 font-medium">Өзгерту</th>
              </tr>
            </thead>

            <tbody>
              {parkings.map((parking) => (
                <ParkingRow
                  key={parking.id}
                  parking={parking}
                  saving={savingId !== null}
                  onSave={handleSave}
                />
              ))}

              {parkings.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Сүзгіге сәйкес тұрақ табылмады.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminOccupancyPanel;
