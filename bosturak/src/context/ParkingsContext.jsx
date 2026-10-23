
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  fetchParkings,
  createParking,
  updateParking,
  deleteParking,
} from "../services/parkingService";

const ParkingsContext = createContext(null);

export function ParkingsProvider({ children }) {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  const mutationPending = useRef(false);
  const loadingRef = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadParkings() {
      loadingRef.current = true;
      setLoading(true);
      setLoadError(null);

      try {
        const data = await fetchParkings({
          signal: controller.signal,
        });

        if (!active) return;

        if (!Array.isArray(data)) {
          throw new Error(
            "Сервер тұрақтар тізімін дұрыс қайтармады."
          );
        }

        setParkings(data);
      } catch (error) {
        if (!active || error?.name === "AbortError") {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Тұрақтарды жүктеу мүмкін болмады."
        );
      } finally {
        if (active) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    }

    loadParkings();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadCount]);

  function reloadParkings() {
    if (
      mutationPending.current ||
      loadingRef.current
    ) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setReloadCount((count) => count + 1);
  }

  async function runMutation(action) {
    if (loadingRef.current || loadError) {
      throw new Error(
        "Алдымен тұрақтар тізімін сәтті жүктеу керек."
      );
    }

    if (mutationPending.current) {
      throw new Error(
        "Алдыңғы сұраудың аяқталуын күтіңіз."
      );
    }

    mutationPending.current = true;
    setSaving(true);

    try {
      return await action();
    } finally {
      mutationPending.current = false;
      setSaving(false);
    }
  }

  async function addParking(parking) {
    return runMutation(async () => {
      const saved = await createParking(parking);

      setParkings((current) => [
        ...current,
        saved,
      ]);

      return saved;
    });
  }

  async function editParking(id, parking) {
    return runMutation(async () => {
      const saved = await updateParking(id, parking);

      setParkings((current) =>
        current.map((item) =>
          String(item.id) === String(id)
            ? saved
            : item
        )
      );

      return saved;
    });
  }

  async function removeParking(id) {
    return runMutation(async () => {
      await deleteParking(id);

      setParkings((current) =>
        current.filter(
          (item) => String(item.id) !== String(id)
        )
      );
    });
  }

  const value = {
    parkings,
    loading,
    saving,
    loadError,
    reloadParkings,
    addParking,
    editParking,
    removeParking,
  };

  return (
    <ParkingsContext.Provider value={value}>
      {loading && (
        <p
          role="status"
          className="m-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-600"
        >
          Тұрақтар жүктелуде…
        </p>
      )}

      {loadError && (
        <div
          role="alert"
          className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p>{loadError}</p>

          <button
            type="button"
            onClick={reloadParkings}
            disabled={loading || saving}
            className="mt-3 rounded-lg bg-red-100 px-4 py-2 font-medium hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Қайта жүктеу
          </button>
        </div>
      )}

      {children}
    </ParkingsContext.Provider>
  );
}

export function useParkings() {
  const context = useContext(ParkingsContext);

  if (!context) {
    throw new Error(
      "useParkings тек ParkingsProvider ішінде қолданылуы керек."
    );
  }

  return context;
}
