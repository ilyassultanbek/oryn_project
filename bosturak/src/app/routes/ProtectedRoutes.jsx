import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { getCurrentUser } from "../../services/authService";

function ProtectedRoutes({ children, adminOnly = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      setLoading(true);
      setError("");

      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
          setError(
            "Серверге қосылу мүмкін болмады. Қайта тексеріңіз."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [retryCount]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <p role="status" className="text-sm text-slate-600">
          Қолжетімділік тексерілуде…
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="text-center">
          <p role="alert" className="text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-5 rounded-xl bg-[#087F5B]
              px-5 py-3 font-medium text-white
              hover:bg-[#066649]"
          >
            Қайта тексеру
          </button>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="max-w-md text-center">
          <span className="text-6xl font-bold text-[#087F5B]">
            403
          </span>

          <h1 className="mt-4 text-2xl font-bold text-[#142B45]">
            Әкімші құқығы қажет
          </h1>

          <p className="mt-3 text-slate-500">
            Бұл бөлім тек әкімшілерге қолжетімді.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl
              bg-[#087F5B] px-5 py-3 font-medium
              text-white hover:bg-[#066649]"
          >
            Басты бетке қайту
          </Link>
        </div>
      </main> 
    );
  }

  return children;
}

export default ProtectedRoutes;