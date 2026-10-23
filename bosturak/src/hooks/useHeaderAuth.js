import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logoutUser,
} from "../services/authService";

export function useHeaderAuth() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const logoutPending = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();

        if (active) setUser(currentUser);
      } catch {
        if (active) {
          setError(
            "Сессияны тексеру мүмкін болмады. Бетті жаңартып көріңіз."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    if (logoutPending.current) return;

    logoutPending.current = true;
    setIsLoggingOut(true);
    setError("");

    try {
      await logoutUser();
      setUser(null);
      navigate("/login", { replace: true });
    } catch {
      setError("Жүйеден шығу орындалмады. Қайта көріңіз.");
    } finally {
      logoutPending.current = false;
      setIsLoggingOut(false);
    }
  }

  return {
    user,
    loading,
    isLoggingOut,
    error,
    handleLogout,
  };
}