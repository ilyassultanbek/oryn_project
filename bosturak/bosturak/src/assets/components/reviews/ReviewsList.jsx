
import RatingStars from "./RatingStars";

function ReviewsList({ reviews = [], loading = false }) {
  if (loading) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Пікірлер жүктелуде...
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-5 dark:bg-blue-800">
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Бұл тұраққа әзірге жарияланған пікір жоқ.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-2xl border border-slate-200 p-4 dark:border-blue-700"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">
                {review.userName || "Қолданушы"}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString(
                      "kk-KZ"
                    )
                  : ""}
              </p>
            </div>

            <RatingStars value={review.rating} size={15} />
          </div>

          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6">
            {review.comment}
          </p>
        </article>
      ))}
    </div>
  );
}

export default ReviewsList;
