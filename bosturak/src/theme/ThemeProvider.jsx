import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "bosturak-theme";
const SYSTEM_QUERY = "(prefers-color-scheme: dark)";
const VALID_THEMES = ["light", "dark", "system"];

function getInitialTheme() {
  if (typeof window === "undefined") return "system";

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (VALID_THEMES.includes(saved)) {
      return saved;
    }
  } catch {
    // Сақтау қолжетімсіз болса, жүйелік режим қолданылады.
  }

  return "system";
}

function getSystemTheme() {
  if (typeof window === "undefined") return "light";

  return window.matchMedia(SYSTEM_QUERY).matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme =
    theme === "system" ? systemTheme : theme;

  // Windows немесе басқа құрылғы тақырыбы өзгергенін бақылау.
  useEffect(() => {
    const media = window.matchMedia(SYSTEM_QUERY);

    function updateSystemTheme() {
      setSystemTheme(media.matches ? "dark" : "light");
    }

    updateSystemTheme();
    media.addEventListener("change", updateSystemTheme);

    return () => {
      media.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  // Басқа қойындыда таңдау өзгерсе, осы қойындыны да жаңарту.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== STORAGE_KEY && event.key !== null) {
        return;
      }

      setThemeState(
        VALID_THEMES.includes(event.newValue)
          ? event.newValue
          : "system"
      );
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  function setTheme(nextTheme) {
    if (!VALID_THEMES.includes(nextTheme)) return;

    setThemeState(nextTheme);

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Таңдау осы сессияда жұмыс істей береді.
    }
  }

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme тек ThemeProvider ішінде қолданылуы керек."
    );
  }

  return context;
}