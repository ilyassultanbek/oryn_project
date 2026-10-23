
import { useCallback, useEffect, useRef, useState } from "react";
import { getParkingRatings } from "../services/reviewsService";

const REFRESH_INTERVAL = 60_000;

function createRatingsMap(items) {
  return Object.fromEntries(
    items.map((item) => [
      String(item.parkingId),
      {
        averageRating: Number(item.averageRating) || 0,
        reviewCount: Number(item.reviewCount) || 0,
      },
    ])
  );
}

export function useParkingRatings() {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mountedRef = useRef(false);
  const requestRef = useRef(false);

  const refreshRatings = useCallback(async () => {
    if (requestRef.current) return;

    requestRef.current = true;

    try {
      const data = await getParkingRatings();

      if (!mountedRef.current) return;

      setRatings(createRatingsMap(data));
      setError("");
    } catch (err) {
      if (!mountedRef.current) return;

      setError(
        err instanceof Error
          ? err.message
          : "Рейтингтерді жүктеу мүмкін болмады."
      );
    } finally {
      requestRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    refreshRatings();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshRatings();
      }
    }, REFRESH_INTERVAL);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshRatings();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      mountedRef.current = false;

      window.clearInterval(intervalId);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [refreshRatings]);

  return {
    ratings,
    loading,
    error,
    refreshRatings,
  };
}
