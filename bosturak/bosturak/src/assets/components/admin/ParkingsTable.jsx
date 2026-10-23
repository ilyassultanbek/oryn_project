import {
  ParkingSquare,
  Pencil,
  Trash2,
  Inbox,
} from "lucide-react";

const columns = [
  "Тұрақ",
  "Аудан",
  "Бос / жалпы орын",
  "Баға",
  "Түрі",
  "Әрекеттер",
];

const numberFormatter = new Intl.NumberFormat("kk-KZ");

const actionButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-xl " +
  "transition-colors focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-40 " +
  "motion-reduce:transition-none";

function AvailabilityCell({ freeSpaces, capacity }) {
  const known = freeSpaces != null;

  const colorClass = !known
    ? "bg-slate-300"
    : freeSpaces > 0
      ? "bg-emerald-500"
      : "bg-rose-400";

  const percentage =
    known && capacity > 0
      ? Math.min(100, Math.max(0, (freeSpaces / capacity) * 100))
      : 0;

  return (
    <div className="min-w-28">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${colorClass}`}
        />

        <span className="font-medium text-slate-700">
          {known ? numberFormatter.format(freeSpaces) : "Белгісіз"}
          <span className="font-normal text-slate-400">
            {" / "}
            {numberFormatter.format(capacity)}
          </span>
        </span>
      </div>

      {known && (
        <div
          aria-hidden="true"
          className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className={`h-full rounded-full ${colorClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

function ParkingRow({ parking, disabled, onEdit, onDelete }) {
  return (
    <tr className="border-t border-slate-100/80 hover:bg-slate-50/60">
      <th scope="row" className="min-w-64 px-5 py-4 font-medium">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center
              justify-center rounded-2xl bg-slate-100 text-slate-500"
          >
            <ParkingSquare size={19} aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <span className="block break-words text-slate-800">
              {parking.name}
            </span>

            <span
              className="mt-1 block break-words text-xs
                font-normal text-slate-400"
            >
              {parking.address}
            </span>
          </div>
        </div>
      </th>

      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
        {parking.district}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <AvailabilityCell
          freeSpaces={parking.freeSpaces}
          capacity={parking.capacity}
        />
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        {parking.price === 0 ? (
          <span className="font-medium text-emerald-700">
            Тегін
          </span>
        ) : (
          <>
            <span className="font-medium text-slate-700">
              {numberFormatter.format(parking.price)} ₸
            </span>
            <span className="text-xs text-slate-400"> / сағ</span>
          </>
        )}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px]
            font-medium ${
              parking.isCovered
                ? "bg-violet-50 text-violet-600"
                : "bg-emerald-50 text-emerald-700"
            }`}
        >
          {parking.isCovered ? "Жабық" : "Ашық"}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(parking)}
            disabled={disabled}
            aria-label={`${parking.name}: өңдеу`}
            title="Өңдеу"
            className={`${actionButtonClass}
              text-slate-500 enabled:hover:bg-emerald-50
              enabled:hover:text-emerald-700
              focus-visible:outline-emerald-600`}
          >
            <Pencil size={16} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(parking)}
            disabled={disabled}
            aria-label={`${parking.name}: жою`}
            title="Жою"
            className={`${actionButtonClass}
              text-slate-400 enabled:hover:bg-rose-50
              enabled:hover:text-rose-600
              focus-visible:outline-rose-600`}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ParkingsTable({
  parkings,
  disabled = false,
  emptyMessage = "Тұрақтар әзірге жоқ.",
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="mt-6 overflow-hidden rounded-[24px]
        border border-white bg-white/90
        shadow-[0_4px_24px_rgba(15,23,42,0.025)]"
    >
      <div
        role="region"
        aria-label="Тұрақтар кестесі"
        tabIndex={0}
        className="overflow-x-auto
          focus-visible:outline-2 focus-visible:outline-inset
          focus-visible:outline-emerald-600"
      >
        <table className="w-full text-left text-[13px]">
          <caption className="sr-only">
            Тұрақтар тізімі және басқару әрекеттері
          </caption>

          <thead className="bg-slate-50/60 text-[11px] text-slate-500">
            <tr>
              {columns.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="whitespace-nowrap px-5 py-4 font-medium"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {parkings.map((parking) => (
              <ParkingRow
                key={parking.id}
                parking={parking}
                disabled={disabled}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {parkings.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-6 py-12">
          <Inbox size={28} className="text-slate-300" aria-hidden="true" />

          <p role="status" className="text-center text-sm text-slate-500">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default ParkingsTable; 