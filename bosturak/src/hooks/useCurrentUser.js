
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getCurrentUser } from "../services/authService";

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);

  const refreshUser = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError("");

    try {
      const currentUser = await getCurrentUser();

      if (
        mountedRef.current &&
        requestId === requestIdRef.current
      ) {
        setUser(currentUser);
      }

      return currentUser;
    } catch (err) {
      if (
        mountedRef.current &&
        requestId === requestIdRef.current
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Пайдаланушы мәліметтері жүктелмеді."
        );
      }

      throw err;
    } finally {
      if (
        mountedRef.current &&
        requestId === requestIdRef.current
      ) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    refreshUser().catch(() => {});

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, [refreshUser]);

  return {
    user,
    loading,
    error,
    refreshUser,
  };
}
