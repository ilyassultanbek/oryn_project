
import { useState } from "react";
import { Star, Send } from "lucide-react";

function ReviewForm({ onSubmit, saving = false }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (rating < 1 || rating > 5) {
      setValidationError("1–5 аралығында баға таңдаңыз.");
      return;
    }

    const trimmedComment = comment.trim();

    if (
      trimmedComment.length < 1 ||
      trimmedComment.length > 2000
    ) {
      setValidationError(
        "Пікір мәтіні 1–2000 таңба болуы керек."
      );
      return;
    }

    const success = await onSubmit({
      rating,
      comment: trimmedComment,
    });

    if (success) {
      setRating(0);
      setHoverRating(0);
      setComment("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 p-5 dark:border-blue-700"
    >
      <h4 className="text-base font-semibold">
        Өз пікіріңізді қалдырыңыз
      </h4>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
        Тұрақты 1-ден 5-ке дейін бағалаңыз.
      </p>

      <div
        className="mt-4 flex items-center gap-2"
        role="group"
        aria-label="Тұрақты бағалау"
      >
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          const active = value <= (hoverRating || rating);

          return (
            <button
              key={value}
              type="button"
              disabled={saving}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onFocus={() => setHoverRating(value)}
              onBlur={() => setHoverRating(0)}
              aria-label={`${value} жұлдыз`}
              aria-pressed={rating === value}
              className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-violet-600 disabled:opacity-50"
            >
              <Star
                size={28}
                className={
                  active
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 dark:text-slate-500"
                }
              />
            </button>
          );
        })}
      </div>

      <label
        htmlFor="parking-review-comment"
        className="mt-5 block text-sm font-medium"
      >
        Пікіріңіз
      </label>

      <textarea
        id="parking-review-comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={2000}
        rows={4}
        disabled={saving}
        placeholder="Тұрақ туралы тәжірибеңізбен бөлісіңіз..."
        className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60 dark:border-blue-700 dark:bg-blue-950 dark:text-white"
      />

      <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-300">
        {comment.length}/2000
      </p>

      {validationError && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">
          {validationError}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} />
        {saving ? "Жіберілуде..." : "Пікірді жіберу"}
      </button>
    </form>
  );
}

export default ReviewForm;
