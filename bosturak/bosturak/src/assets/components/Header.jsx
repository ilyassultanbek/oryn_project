import { Link } from "react-router-dom";

import logo from "../images/logo.webp";
import login from "../images/login.png";
import admin from "../images/admin.png";


import DistrictDropdown from "./DistrictDropdown";
import ParkingDropdown from "./ParkingDropdown";
import UserMenu from "./UserMenu";

import { useTheme } from "../../theme/ThemeProvider";
import { useHeaderAuth } from "../../hooks/useHeaderAuth";

function Header() {
  const { setTheme } = useTheme();

  const {
    user,
    loading,
    isLoggingOut,
    error,
    handleLogout,
  } = useHeaderAuth();

  function toggleTheme() {
    const isDark =
      document.documentElement.classList.contains("dark");

    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header
      className="sticky top-0 z-[1000] mx-auto mt-0
        w-[calc(100%-24px)] max-w-7xl rounded-[70px]
        border border-slate-200/60 bg-white/70
        text-slate-800 shadow-sm backdrop-blur-xl
        dark:border-white/10 dark:bg-slate-950/70
        dark:text-white"
    >
      <nav className="my-1 flex flex-wrap items-center gap-4 px-5 py-2">
        <Link to="/" className="w-36 shrink-0">
          <img src={logo} alt="Oryn — басты бет" />
        </Link>

        <ul
          className="flex flex-wrap items-center gap-x-6 gap-y-2
            font-medium text-gray-700 dark:text-gray-200"
        >
          <li>
            <Link
              to="/"
              className="transition-colors hover:text-amber-600"
            >
              Басты бет
            </Link>
          </li>

          <li>
            <Link
              to="/map"
              className="transition-colors hover:text-amber-600"
            >
              Карта
            </Link>
          </li>

          <DistrictDropdown />
          <ParkingDropdown />

          <li>
            <Link
              to="/about"
              className="transition-colors hover:text-amber-600"
            >
              Біз туралы
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="transition-colors hover:text-amber-600"
            >
              Байланыс
            </Link>
          </li>
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          

          {loading ? (
            <span
              role="status"
              className="text-sm text-slate-500"
            >
              Күтіңіз…
            </span>
          ) : user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  aria-label="Әкімші панелі"
                  className="flex h-10 w-10 items-center
                    justify-center rounded-full
                    hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <img
                    src={admin}
                    alt=""
                    className="h-6 w-6"
                  />
                </Link>
              )}

              <UserMenu
                user={user}
                isLoggingOut={isLoggingOut}
                onLogout={handleLogout}
              />
            </>
          ) : (
            <Link
              to="/login"
              aria-label="Аккаунтқа кіру"
              className="flex h-10 w-10 items-center justify-center
                rounded-full hover:bg-slate-100
                dark:hover:bg-slate-800"
            >
              <img
                src={login}
                alt=""
                className="h-6 w-6"
              />
            </Link>
          )}
        </div>
      </nav>

      {error && (
        <p
          role="alert"
          className="px-5 pb-3 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </header>
  );
}

export default Header;