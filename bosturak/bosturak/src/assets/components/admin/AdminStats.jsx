import {
  ParkingSquare,
  CircleParking,
  Gauge,
  MessageSquare,
} from "lucide-react";

import { calculateParkingStats } from "../../../utils/adminStats";

const numberFormatter = new Intl.NumberFormat("kk-KZ");

function formatValue(value) {
  if (value == null) return "Ақпарат жоқ";

  return typeof value === "number"
    ? numberFormatter.format(value)
    : value;
}

function AdminStats({
  parkings,
  parkingError,
  newMessagesCount,
  messagesError,
}) {
  const summary = calculateParkingStats(parkings);

  const stats = [
    {
      id: "parkings",
      label: "Барлық тұрақ",
      value: parkingError ? null : summary.total,
      icon: ParkingSquare,
      iconClass: "bg-violet-50 text-violet-500",
      description: "Жүйеде тіркелген тұрақтар",
    },
    {
      id: "available",
      label: "Белгілі бос орын",
      value: parkingError ? null : summary.freeSpaces,
      icon: CircleParking,
      iconClass: "bg-emerald-50 text-emerald-600",
      description: parkingError
        ? "Деректер қолжетімсіз"
        : `${summary.knownCount} тұрақтың дерегі бойынша`,
    },
    {
      id: "occupancy",
      label: "Толу деңгейі",
      value:
        parkingError || summary.occupancy == null
          ? null
          : `${summary.occupancy}%`,
      icon: Gauge,
      iconClass: "bg-sky-50 text-sky-600",
      description: "Ақпараты белгілі тұрақтар бойынша",
    },
    {
      id: "messages",
      label: "Жаңа хабарламалар",
      value: messagesError ? null : newMessagesCount,
      icon: MessageSquare,
      iconClass: "bg-rose-50 text-rose-500",
      description: "«Жаңа» күйіндегі өтініштер",
    },
  ];

  return (
    <section aria-label="Жалпы көрсеткіштер" className="mt-6">
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.id}
              className="min-w-0 rounded-[24px] border border-white
                bg-white/85 p-5 shadow-[0_4px_24px_rgba(15,23,42,0.025)]"
            >
              <dt className="flex flex-col items-start gap-5">
                <span
                  className={`flex h-10 w-10 items-center
                    justify-center rounded-2xl ${stat.iconClass}`}
                >
                  <Icon size={19} aria-hidden="true" />
                </span>

                <span className="text-xs font-medium text-slate-500">
                  {stat.label}
                </span>
              </dt>

              <dd
                className={`mt-2 font-semibold tracking-tight
                  text-[#182523] ${
                    stat.value == null ? "text-lg" : "text-3xl"
                  }`}
              >
                {formatValue(stat.value)}
              </dd>

              <dd className="mt-2 text-[11px] leading-5 text-slate-400">
                {stat.description}
              </dd>
            </div>
          );
        })}
      </dl>

      {!parkingError && summary.unknownCount > 0 && (
        <p className="mt-3 text-xs leading-5 text-slate-500">
          {summary.unknownCount} тұрақтың бос орын саны белгісіз.
          Олар бос орын мен толу деңгейінің есебіне кірмейді.
        </p>
      )}
    </section>
  );
}

export default AdminStats;