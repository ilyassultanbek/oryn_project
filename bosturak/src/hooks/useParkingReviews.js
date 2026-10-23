
import { useCallback, useEffect, useState } from "react";

import {
  getParkingReviews,
  getParkingRating,
  createParkingReview,
} from "../services/reviewsService";

export function useParkingReviews(parkingId) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({
    reviewCount: 0,
    averageRating: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    if (parkingId == null) return;

    setLoading(true);
    setError("");

    try {
      const [reviewsData, ratingData] = await Promise.all([
        getParkingReviews(parkingId),
        getParkingRating(parkingId),
      ]);

      setReviews(
        Array.isArray(reviewsData)
          ? reviewsData
          : Array.isArray(reviewsData?.reviews)
            ? reviewsData.reviews
            : []
      );

      setRating({
        reviewCount: Number(ratingData?.reviewCount ?? 0),
        averageRating: Number(ratingData?.averageRating ?? 0),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [parkingId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function submitReview({ rating, comment }) {
    if (parkingId == null) return false;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await createParkingReview(parkingId, {
        rating,
        comment,
      });

      setNotice(
        "Пікіріңіз жіберілді. Әкімші мақұлдағаннан кейін жарияланады."
      );

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    reviews,
    rating,
    loading,
    saving,
    error,
    notice,
    refresh,
    submitReview,
  };
}
