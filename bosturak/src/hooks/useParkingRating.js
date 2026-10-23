
import { useCallback, useEffect, useState } from "react";
import { getParkingRatings } from "../services/reviewsService";

export function useParkingRatings() {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshRatings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getParkingRatings();

      const nextRatings = Object.fromEntries(
        data.map((item) => [
          String(item.parkingId),
          {
            averageRating: Number(item.averageRating) || 0,
            reviewCount: Number(item.reviewCount) || 0,
          },
        ])
      );

      setRatings(nextRatings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRatings();
  }, [refreshRatings]);

  return {
    ratings,
    loading,
    error,
    refreshRatings,
  };
}
