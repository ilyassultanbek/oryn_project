
import { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  CarFront,
  ParkingSquare,
  MessageSquare,
  Star,
  RefreshCw,
  Download,
  TrendingUp,
} from "lucide-react";

import { getAdminAnalytics } from "../../../services/adminAnalyticsService";

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold">
        {value ?? "—"}
      </p>
    </div>
  );
}

function ActivityChart({ activity }) {
  const max = Math.max(
    1,
    ...activity.map(
      (item) => item.users + item.messages + item.reviews
    )
  );

  return (
    <div className={cardClass}>
      <h2 className="text-lg font-semibold">
        Соңғы 14 күндегі белсенділік
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Жаңа қолданушылар, хабарламалар және пікірлер
      </p>

      <div className="mt-8 flex h-56 items-end gap-2">
        {activity.map((item) => {
          const total =
            item.users + item.messages + item.reviews;

          return (
            <div
              key={item.day}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
              title={`${item.day}: ${total} әрекет`}
            >
              <div className="flex h-44 items-end rounded-t-lg bg-slate-100">
                <div
                  className="w-full rounded-t-md bg-emerald-500 transition-all"
                  style={{
                    height: `${(total / max) * 100}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-center text-[10px] text-slate-500">
                {item.day.slice(8)}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Баған биіктігі — сол күнгі жалпы жаңа жазбалар саны.
      </p>
    </div>
  );
}

function DistrictTable({ districts }) {
  return (
    <div className={cardClass}>
      <h2 className="mb-5 text-lg font-semibold">
        Аудандар бойынша статистика
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="pb-4">Аудан</th>
              <th className="pb-4">Тұрақтар</th>
              <th className="pb-4">Сыйымдылық</th>
              <th className="pb-4">Бос</th>
              <th className="pb-4">Толған</th>
            </tr>
          </thead>

          <tbody>
            {districts.map((item) => (
              <tr
                key={item.district}
                className="border-b border-slate-100"
              >
                <td className="py-4 font-medium">
                  {item.district}
                </td>
                <td>{item.parkings}</td>
                <td>{item.capacity}</td>
                <td className="font-semibold text-emerald-600">
                  {item.free_spaces}
                </td>
                <td>
                  {item.capacity - item.free_spaces}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {districts.length === 0 && (
          <p className="py-6 text-center text-slate-500">
            Деректер табылмады.
          </p>
        )}
      </div>
    </div>
  );
}

function downloadCSV(districts) {
  const rows = [
    [
      "Аудан",
      "Тұрақтар",
      "Сыйымдылық",
      "Бос орындар",
      "Толған орындар",
    ],
    ...districts.map((item) => [
      item.district,
      item.parkings,
      item.capacity,
      item.free_spaces,
      item.capacity - item.free_spaces,
    ]),
  ];

  const escapeCell = (value) => {
    let text = String(value ?? "");

    if (/^[\s]*[=+\-@\t\r]/.test(text)) {
      text = "'" + text;
    }

    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = rows
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF", csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "oryn-analytics.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminAnalyticsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      setLoading(true);
      setError("");

      try {
        const result = await getAdminAnalytics();

        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const metrics = data?.metrics;

  return (
    <section className="mt-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-600">
          <BarChart3 size={20} />
          <span className="text-sm">
            PostgreSQL негізіндегі статистика
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => setRefreshKey((v) => v + 1)}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Жаңарту
          </button>

          <button
            type="button"
            disabled={!data}
            onClick={() => downloadCSV(data.districts)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Download size={16} />
            CSV есеп
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
          Статистика жүктелуде...
        </div>
      )}

      {!loading && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Жалпы тұрақтар"
              value={metrics.parkings}
              icon={ParkingSquare}
              color="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Қолданушылар"
              value={metrics.users}
              icon={Users}
              color="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Бос орындар"
              value={metrics.free_spaces}
              icon={CarFront}
              color="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Толған орындар"
              value={metrics.occupied_spaces}
              icon={TrendingUp}
              color="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Хабарламалар"
              value={metrics.messages}
              icon={MessageSquare}
              color="bg-rose-50 text-rose-600"
            />

            <StatCard
              title="Пікірлер"
              value={metrics.reviews}
              icon={Star}
              color="bg-amber-50 text-amber-600"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ActivityChart activity={data.activity} />

            <div className={cardClass}>
              <h2 className="text-lg font-semibold">
                Тұрақтардың толу деңгейі
              </h2>

              <p className="mt-8 text-5xl font-bold">
                {metrics.occupancy_percent == null
                  ? "—"
                  : `${metrics.occupancy_percent}%`}
              </p>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, metrics.occupancy_percent ?? 0)
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-6 flex justify-between text-sm text-slate-500">
                <span>
                  Жалпы орын: {metrics.known_capacity}
                </span>
                <span>
                  Бос: {metrics.free_spaces}
                </span>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Көрсеткіш дерекқорға соңғы енгізілген
                бос орын мәндерінен есептеледі.
              </p>
            </div>
          </div>

          <DistrictTable districts={data.districts} />
        </>
      )}
    </section>
  );
}
