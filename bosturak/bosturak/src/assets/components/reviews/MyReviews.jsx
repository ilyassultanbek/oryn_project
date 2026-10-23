
import { useState } from "react";
import {
  Star,
  Pencil,
  Trash2,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

import EditReviewModal from "./EditReviewModal";

const STATUS_CONFIG = {
  approved: {
    label: "Жарияланған",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  pending: {
    label: "Тексерілуде",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  hidden: {
    label: "Жасырылған",
    className:
      "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

function RatingDisplay({ rating }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} / 5 жұлдыз`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={15}
          className={
            value <= Number(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300 dark:text-slate-600"
          }
        />
      ))}
    </div>
  );
}

function MyReviews({
  reviews = [],
  loading = false,
  saving = false,
  error = "",
  onRefresh,
  onEdit,
  onDelete,
}) {
  const [editingReview, setEditingReview] = useState(null);
  const [actionError, setActionError] = useState("");

  async function handleSave(reviewId, values) {
    setActionError("");

    try {
      await onEdit(reviewId, values);
      setEditingReview(null);
    } catch (err) {
      const message = err.message || "Пікірді сақтау мүмкін болмады.";
      setActionError(message);
      throw err;
    }
  }

  async function handleDelete(reviewId) {
    if (!window.confirm("Бұл пікірді біржола жойғыңыз келе ме?")) {
      return;
    }

    setActionError("");

    try {
      await onDelete(reviewId);
    } catch (err) {
      setActionError(err.message || "Пікірді жою мүмкін болмады.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Барлық пікірлер:{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {reviews.length}
          </span>
        </p>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || saving}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Жаңарту
        </button>
      </div>

      {(error || actionError) && (
        <p role="alert" className="text-sm text-red-500">
          {actionError || error}
        </p>
      )}

      {loading && reviews.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Пікірлер жүктелуде...
        </p>
      ) : reviews.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-700">
          <MessageSquare
            size={34}
            className="mx-auto mb-3 text-slate-400"
          />

          <h3 className="font-semibold">
            Әзірге пікір қалдырмағансыз
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Тұрақтарды бағалап, тәжірибеңізбен бөлісіңіз.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f6f7f8] text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 font-medium">Тұрақ</th>
                <th className="px-5 py-4 font-medium">Бағалау</th>
                <th className="px-5 py-4 font-medium">Пікір</th>
                <th className="px-5 py-4 font-medium">Мәртебе</th>
                <th className="px-5 py-4 font-medium">Күні</th>
                <th className="px-5 py-4 text-right font-medium">
                  Әрекеттер
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reviews.map((review) => {
                const status =
                  STATUS_CONFIG[review.status] || {
                    label: review.status || "Белгісіз",
                    className:
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                  };

                const createdAt =
                  review.createdAt || review.created_at;

                const date = createdAt
                  ? new Date(createdAt).toLocaleDateString("kk-KZ")
                  : "—";

                return (
                  <tr
                    key={review.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4 align-top">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {review.parkingName ||
                          review.parking_name ||
                          `Тұрақ #${review.parkingId ?? review.parking_id ?? "—"}`}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <RatingDisplay rating={review.rating} />
                    </td>

                    <td className="max-w-[230px] px-5 py-4 align-top">
                      <p
                        title={review.comment}
                        className="line-clamp-2 break-words text-slate-600 dark:text-slate-300"
                      >
                        {review.comment}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 align-top text-slate-500 dark:text-slate-400">
                      {date}
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Пікірді өңдеу"
                          aria-label="Пікірді өңдеу"
                          disabled={saving}
                          onClick={() => {
                            setActionError("");
                            setEditingReview(review);
                          }}
                          className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50 dark:hover:bg-emerald-950"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Пікірді жою"
                          aria-label="Пікірді жою"
                          disabled={saving}
                          onClick={() => handleDelete(review.id)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <EditReviewModal
        review={editingReview}
        saving={saving}
        onClose={() => setEditingReview(null)}
        onSave={handleSave}
      />
    </div>
  );
}

export default MyReviews;
