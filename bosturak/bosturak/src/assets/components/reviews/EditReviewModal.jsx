
import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

function EditReviewModal({
  review,
  saving = false,
  onClose,
  onSave,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!review) return;

    setRating(Number(review.rating) || 5);
    setComment(review.comment || "");
    setError("");
  }, [review]);

  if (!review) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedComment = comment.trim();

    if (!cleanedComment || cleanedComment.length > 2000) {
      setError("Пікір 1–2000 таңба аралығында болуы керек.");
      return;
    }

    setError("");

    try {
      await onSave(review.id, {
        rating,
        comment: cleanedComment,
      });
    } catch (err) {
      setError(err.message || "Пікірді сақтау мүмкін болмады.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-review-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="edit-review-title"
            className="text-xl font-semibold text-slate-900 dark:text-white"
          >
            Пікірді өңдеу
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Жабу"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            Бағалау
          </p>

          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                disabled={saving}
                aria-label={`${value} жұлдыз`}
                aria-pressed={rating === value}
                className="transition hover:scale-110"
              >
                <Star
                  size={30}
                  className={
                    value <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }
                />
              </button>
            ))}
          </div>

          <label
            htmlFor="edit-review-comment"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Пікір мәтіні
          </label>

          <textarea
            id="edit-review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={5}
            disabled={saving}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {comment.length}/2000
          </p>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-700 dark:border-slate-700 dark:text-white"
            >
              Болдырмау
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? "Сақталуда..." : "Сақтау"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditReviewModal;
