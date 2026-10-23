
import {
  MessageSquareText,
  CheckCircle2,
  Clock3,
  Star,
} from "lucide-react";

function ProfileStats({ reviews = [] }) {
  const approved = reviews.filter(
    (review) => review.status === "approved"
  );

  const pending = reviews.filter(
    (review) => review.status === "pending"
  );

  const averageRating = reviews.length
    ? (
        reviews.reduce(
          (sum, review) => sum + Number(review.rating || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "—";

  const stats = [
    {
      label: "Барлық пікірлер",
      value: reviews.length,
      icon: MessageSquareText,
      color: "text-blue-600",
      background: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Жарияланған",
      value: approved.length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      background: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      label: "Тексерілуде",
      value: pending.length,
      icon: Clock3,
      color: "text-amber-600",
      background: "bg-amber-50 dark:bg-amber-950",
    },
    {
      label: "Орташа бағалау",
      value: averageRating,
      icon: Star,
      color: "text-violet-600",
      background: "bg-violet-50 dark:bg-violet-950",
    },
  ];

  return (
    <section aria-label="Профиль статистикасы">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
        Менің белсенділігім
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.background} ${stat.color}`}
              >
                <Icon size={20} />
              </div>

              <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProfileStats;
