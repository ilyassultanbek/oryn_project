
import { useMemo, useState } from "react";
import {
  Star,
  Search,
  RefreshCw,
  Trash2,
  MessageSquare,
  Clock3,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

const statusLabels = {
  pending: "Тексерілуде",
  approved: "Жарияланған",
  hidden: "Жасырылған",
};

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  hidden: "bg-slate-100 text-slate-600",
};

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Күні белгісіз";
  }

  return date.toLocaleString("kk-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RatingStars({ rating }) {
  const value = Number(rating);

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${value} / 5 жұлдыз`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={17}
          className={
            index < value
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-200"
          }
        />
      ))}

      <span className="ml-2 text-sm font-semibold text-slate-700">
        {value}/5
      </span>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-3 text-3xl font-semibold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function ReviewCard({
  review,
  disabled,
  onStatusChange,
  onDelete,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-slate-900">
            {review.userName}
          </h3>

          <p className="mt-1 break-words text-sm text-slate-500">
            {review.parkingName}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {formatDate(review.createdAt)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusColors[review.status] ??
            "bg-slate-100 text-slate-600"
          }`}
        >
          {statusLabels[review.status] ?? "Белгісіз"}
        </span>
      </div>

      <div className="mt-5">
        <RatingStars rating={review.rating} />
      </div>

      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
        {review.comment}
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-5">
        <div>
          <label
            htmlFor={`review-status-${review.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Модерация статусы
          </label>

          <select
            id={`review-status-${review.id}`}
            value={review.status}
            disabled={disabled}
            onChange={(event) =>
              onStatusChange(review.id, event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500 disabled:opacity-50"
          >
            <option value="pending">Тексерілуде</option>
            <option value="approved">Жариялау</option>
            <option value="hidden">Жасыру</option>
          </select>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onDelete(review.id)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
          Жою
        </button>
      </div>
    </article>
  );
}

function AdminReviewsPanel({
  reviews = [],
  stats,
  loading = false,
  saving = false,
  error = "",
  onRefresh,
  onStatusChange,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const busy = loading || saving;

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return reviews.filter((review) => {
      const matchesSearch = [
        review.userName,
        review.parkingName,
        review.comment,
      ].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase()
          .includes(query)
      );

      const matchesStatus =
        statusFilter === "all" ||
        review.status === statusFilter;

      const matchesRating =
        ratingFilter === "all" ||
        Number(review.rating) === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  return (
    <section
      aria-label="Пікірлер мен бағалар"
      aria-busy={busy}
      className="mt-6 space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={MessageSquare}
          title="Барлық пікірлер"
          value={stats.total}
          description="Жүйедегі пікірлер саны"
        />

        <StatCard
          icon={Star}
          title="Орташа рейтинг"
          value={stats.average}
          description="Тек жарияланған бағалар"
        />

        <StatCard
          icon={Clock3}
          title="Тексерілуде"
          value={stats.pending}
          description="Модерация күтіп тұрған пікірлер"
        />

        <StatCard
          icon={CheckCircle2}
          title="Жарияланған"
          value={stats.approved}
          description={`Жасырылған: ${stats.hidden}`}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Пікірлер тізімі
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Табылған пікірлер: {filteredReviews.length}
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Жаңарту
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Пікір немесе тұрақ іздеу..."
              aria-label="Пікір іздеу"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Статус бойынша сүзгілеу"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
          >
            <option value="all">Барлық статустар</option>
            <option value="pending">Тексерілуде</option>
            <option value="approved">Жарияланған</option>
            <option value="hidden">Жасырылған</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(event) =>
              setRatingFilter(event.target.value)
            }
            aria-label="Рейтинг бойынша сүзгілеу"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
          >
            <option value="all">Барлық бағалар</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} жұлдыз
              </option>
            ))}
          </select>
        </div>
      </div>

      {saving && (
        <p role="status" className="text-sm text-violet-700">
          Өзгерістер сақталуда...
        </p>
      )}

      {loading ? (
        <p role="status" className="rounded-2xl bg-white p-8 text-slate-500">
          Пікірлер жүктелуде...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">
          {error}
        </p>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <EyeOff size={28} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm text-slate-500">
            {reviews.length === 0
              ? "Әзірге пікірлер жоқ."
              : "Таңдалған сүзгілер бойынша пікір табылмады."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              disabled={busy}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminReviewsPanel;
