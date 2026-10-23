
import { useCallback, useEffect, useState } from "react";

import {
  getMyReviews,
  updateMyReview,
  deleteMyReview,
} from "../services/reviewsService";

export function useMyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refreshReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Пікірлерді жүктеу мүмкін болмады.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  const editReview = useCallback(
    async (reviewId, values) => {
      setSaving(true);

      try {
        await updateMyReview(reviewId, values);
        await refreshReviews();
      } finally {
        setSaving(false);
      }
    },
    [refreshReviews]
  );

  const removeReview = useCallback(
    async (reviewId) => {
      setSaving(true);

      try {
        await deleteMyReview(reviewId);
        await refreshReviews();
      } finally {
        setSaving(false);
      }
    },
    [refreshReviews]
  );

  return {
    reviews,
    loading,
    saving,
    error,
    refreshReviews,
    editReview,
    removeReview,
  };
}
