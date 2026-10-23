
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCurrentUser } from "../../../services/authService";
import { useParkingReviews } from "../../../hooks/useParkingReviews";

import RatingStars from "../reviews/RatingStars";
import ReviewsList from "../reviews/ReviewsList";
import ReviewForm from "../reviews/ReviewForm";

function ParkingReviews({ parkingId }) {
  const {
    reviews,
    rating,
    loading,
    saving,
    error,
    notice,
    refresh,
    submitReview,
  } = useParkingReviews(parkingId);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      setAuthLoading(true);

      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    checkUser();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">
          Пікірлер мен бағалар
        </h3>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="text-sm font-medium text-violet-600 hover:underline disabled:opacity-50 dark:text-violet-300"
        >
          Жаңарту
        </button>
      </div>

      <RatingStars
        value={rating.averageRating}
        count={rating.reviewCount}
        size={20}
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200"
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
        >
          {notice}
        </p>
      )}

      <ReviewsList
        reviews={reviews}
        loading={loading}
      />

      <div className="border-t border-slate-200 pt-6 dark:border-blue-700">
        {authLoading ? (
          <p role="status" className="text-sm text-slate-500">
            Қолданушы тексерілуде...
          </p>
        ) : user ? (
          <ReviewForm
            key={parkingId}
            onSubmit={submitReview}
            saving={saving}
          />
        ) : (
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-blue-800">
            <p className="text-sm text-slate-600 dark:text-slate-200">
              Пікір қалдыру үшін аккаунтыңызға кіріңіз.
            </p>

            <Link
              to="/login"
              className="mt-3 inline-block text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300"
            >
              Жүйеге кіру →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default ParkingReviews;
