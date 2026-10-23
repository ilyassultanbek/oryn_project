
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from "../services/reviewsService";

export function useAdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);

  const busy = useRef(false);
  const requestController = useRef(null);
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    if (busy.current) return;

    busy.current = true;

    const controller = new AbortController();
    const version = ++requestVersion.current;
    requestController.current = controller;

    setLoading(true);
    setError("");

    try {
      const items = await getAdminReviews({
        signal: controller.signal,
      });

      if (
        !controller.signal.aborted &&
        requestVersion.current === version
      ) {
        setReviews(items);
      }
    } catch (err) {
      if (
        !controller.signal.aborted &&
        requestVersion.current === version
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Пікірлерді жүктеу мүмкін болмады."
        );
      }
    } finally {
      if (requestVersion.current === version) {
        busy.current = false;
        requestController.current = null;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refresh();

    return () => {
      requestVersion.current += 1;
      requestController.current?.abort();
      requestController.current = null;
      busy.current = false;
    };
  }, [refresh]);

  async function changeStatus(id, status) {
    if (busy.current || error) return;

    busy.current = true;
    setSaving(true);
    setNotice(null);

    try {
      await updateReviewStatus(id, status);

      setReviews((current) =>
        current.map((review) =>
          String(review.id) === String(id)
            ? { ...review, status }
            : review
        )
      );

      setNotice({
        error: false,
        text: "Пікірдің статусы сәтті жаңартылды.",
      });
    } catch (err) {
      setNotice({
        error: true,
        text:
          err instanceof Error
            ? err.message
            : "Пікір статусын өзгерту мүмкін болмады.",
      });
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  async function removeReview(id) {
    if (busy.current || error) return;

    const confirmed = window.confirm(
      "Бұл пікірді біржола жойғыңыз келе ме? Бұл әрекетті қайтару мүмкін емес."
    );

    if (!confirmed) return;

    busy.current = true;
    setSaving(true);
    setNotice(null);

    try {
      await deleteReview(id);

      setReviews((current) =>
        current.filter(
          (review) => String(review.id) !== String(id)
        )
      );

      setNotice({
        error: false,
        text: "Пікір сәтті жойылды.",
      });
    } catch (err) {
      setNotice({
        error: true,
        text:
          err instanceof Error
            ? err.message
            : "Пікірді жою мүмкін болмады.",
      });
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    const approved = reviews.filter(
      (review) => review.status === "approved"
    );

    const totalRating = approved.reduce(
      (sum, review) => sum + Number(review.rating),
      0
    );

    return {
      total: reviews.length,
      pending: reviews.filter(
        (review) => review.status === "pending"
      ).length,
      approved: approved.length,
      hidden: reviews.filter(
        (review) => review.status === "hidden"
      ).length,
      average:
        approved.length > 0
          ? (totalRating / approved.length).toFixed(1)
          : "0.0",
    };
  }, [reviews]);

  return {
    reviews,
    loading,
    saving,
    error,
    notice,
    stats,
    refresh,
    changeStatus,
    removeReview,
  };
}
