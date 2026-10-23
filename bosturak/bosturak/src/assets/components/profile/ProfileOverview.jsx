
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  CircleParking,
} from "lucide-react";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
        <Icon size={15} />
        <span>{label}</span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-900 dark:text-white">
        {value || "Көрсетілмеген"}
      </p>
    </div>
  );
}

function ProfileOverview({ user }) {
  const displayName = user?.name || "Қолданушы";

  const role =
    user?.role === "admin"
      ? "Әкімші"
      : "Қолданушы";

  const joinedAt = user?.createdAt || user?.created_at;

  const registeredDate = joinedAt
    ? new Date(joinedAt).toLocaleDateString("kk-KZ")
    : null;

  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <div>
          <p className="text-xs font-medium text-[#16844a] dark:text-emerald-400">
            ORYN / PROFILE
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            Профиль ақпараты
          </h2>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <ShieldCheck size={14} />
          Жүйеге кірген
        </span>
      </div>

      {/* Main Profile */}
      <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_1.5fr]">
        <div className="flex flex-col items-center border-slate-100 text-center md:border-r md:pr-8 dark:border-slate-800">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e9f6ed] text-[#16844a] dark:bg-emerald-950 dark:text-emerald-400">
            <UserRound size={46} />
          </div>

          <h3 className="mt-4 break-words text-xl font-bold text-slate-900 dark:text-white">
            {displayName}
          </h3>

          <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
            {user?.email || "Email көрсетілмеген"}
          </p>

          <span className="mt-4 rounded-full border border-emerald-200 px-4 py-1.5 text-xs font-semibold text-[#16844a] dark:border-emerald-800 dark:text-emerald-400">
            {role}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
          <InfoItem
            icon={UserRound}
            label="Толық аты"
            value={displayName}
          />

          <InfoItem
            icon={Mail}
            label="Email мекенжайы"
            value={user?.email}
          />

          <InfoItem
            icon={ShieldCheck}
            label="Аккаунт рөлі"
            value={role}
          />

          <InfoItem
            icon={CalendarDays}
            label="Тіркелген күні"
            value={registeredDate}
          />

          <InfoItem
            icon={CircleParking}
            label="Платформа"
            value="Oryn Parking"
          />

          <InfoItem
            icon={ShieldCheck}
            label="Сессия"
            value="Белсенді"
          />
        </div>
      </div>
    </section>
  );
}

export default ProfileOverview;
