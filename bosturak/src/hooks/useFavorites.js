import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchFavorites,
  setParkingFavorite,
} from "../services/favoritesService";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [favoritesError, setFavoritesError] = useState("");
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesSaving, setFavoritesSaving] = useState(false);

  const mountedRef = useRef(false);
  const busyRef = useRef(false);
  const readyRef = useRef(false);
  const favoritesRef = useRef([]);
  const controllerRef = useRef(null);

  const refreshFavorites = useCallback(async () => {
    if (busyRef.current) return;

    busyRef.current = true;
    readyRef.current = false;

    const controller = new AbortController();
    controllerRef.current = controller;

    setFavoritesLoading(true);
    setFavoritesError("");

    try {
      const items = await fetchFavorites({
        signal: controller.signal,
      });

      if (!mountedRef.current || controller.signal.aborted) return;

      favoritesRef.current = items;
      readyRef.current = true;
      setFavorites(items);
    } catch (error) {
      if (!mountedRef.current || controller.signal.aborted) return;

      favoritesRef.current = [];
      setFavorites([]);

      setFavoritesError(
        error instanceof Error
          ? error.message
          : "Таңдаулыларды жүктеу мүмкін болмады."
      );
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        busyRef.current = false;

        if (mountedRef.current) {
          setFavoritesLoading(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refreshFavorites();

    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
      controllerRef.current = null;
      busyRef.current = false;
      readyRef.current = false;
    };
  }, [refreshFavorites]);

  async function toggleFavorite(id) {
    if (busyRef.current) return;

    if (!readyRef.current) {
      setFavoritesError(
        "Алдымен жүйеге кіріп, таңдаулылар тізімін қайта жүктеңіз."
      );
      return;
    }

    busyRef.current = true;
    setFavoritesSaving(true);
    setFavoritesError("");

    const isFavorite = !favoritesRef.current.includes(id);

    try {
      await setParkingFavorite(id, isFavorite);

      if (!mountedRef.current) return;

      const next = isFavorite
        ? [...favoritesRef.current, id]
        : favoritesRef.current.filter((item) => item !== id);

      favoritesRef.current = next;
      setFavorites(next);
    } catch (error) {
      if (!mountedRef.current) return;

      if (error.status === 401) {
        readyRef.current = false;
        favoritesRef.current = [];
        setFavorites([]);
      }

      setFavoritesError(
        error instanceof Error
          ? error.message
          : "Таңдаулыларды өзгерту мүмкін болмады."
      );
    } finally {
      busyRef.current = false;

      if (mountedRef.current) {
        setFavoritesSaving(false);
      }
    }
  }

  return {
    favorites,
    favoritesError,
    favoritesLoading,
    favoritesSaving,
    toggleFavorite,
    refreshFavorites,
  };
}