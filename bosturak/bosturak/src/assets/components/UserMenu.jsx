
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserRound,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Heart,
  Settings,
} from "lucide-react";

const MENU_ITEMS = [
  {
    label: "Жеке кабинет",
    to: "/profile",
    icon: LayoutDashboard,
  },
  {
    label: "Таңдаулылар",
    to: "/profile?section=favorites",
    icon: Heart,
  },
  {
    label: "Баптаулар",
    to: "/profile?section=settings",
    icon: Settings,
  },
];

function UserMenu({ user, isLoggingOut, onLogout }) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const firstItemRef = useRef(null);
  const menuId = useId();

  const location = useLocation();

  const roleLabel =
    user.role === "admin" ? "Әкімші" : "Қолданушы";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;

    firstItemRef.current?.focus();

    function handleOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  function handleTriggerKeyDown(event) {
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleMenuKeyDown(event) {
    const items = Array.from(
      event.currentTarget.querySelectorAll(
        '[role="menuitem"]:not(:disabled)'
      )
    );

    if (items.length === 0) return;

    const currentIndex = items.indexOf(
      document.activeElement
    );

    let nextIndex;

    switch (event.key) {
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % items.length;
        break;

      case "ArrowUp":
        nextIndex =
          (currentIndex - 1 + items.length) %
          items.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = items.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();
    items[nextIndex]?.focus();
  }

  async function handleLogout() {
    if (isLoggingOut) return;

    await onLogout();
  }

  const menuItemClass = `
    flex w-full items-center gap-3
    rounded-xl px-3 py-3
    text-left text-sm font-medium
    text-slate-700 transition-colors
    hover:bg-emerald-50 hover:text-emerald-700
    focus-visible:bg-emerald-50
    focus-visible:outline-none
    dark:text-slate-200
    dark:hover:bg-emerald-950/40
    dark:hover:text-emerald-400
  `;

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className="relative shrink-0"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${user.name}: аккаунт мәзірі`}
        className={`
          flex h-14 items-center gap-3 rounded-2xl
          border px-3 text-left
          shadow-[0_2px_10px_rgba(20,43,69,0.04)]
          transition-colors duration-150
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-emerald-500/40
          ${
            open
              ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40"
              : "border-slate-200/70 bg-white hover:border-emerald-500/30 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          }
        `}
      >
        <span
          className="
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-full
            bg-[#E7F5EE] text-[#087F5B]
            dark:bg-emerald-950 dark:text-emerald-400
          "
        >
          <UserRound
            size={21}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <span className="flex min-w-0 flex-col gap-0.5">
          <span
            className="
              max-w-24 truncate text-[14px]
              font-semibold leading-5 text-[#142B45]
              sm:max-w-32 dark:text-white
            "
          >
            {user.name}
          </span>

          <span
            className="
              text-[11px] leading-4 text-[#64748B]
              dark:text-slate-400
            "
          >
            {roleLabel}
          </span>
        </span>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`
            ml-1 shrink-0 text-slate-500
            transition-transform duration-150
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        hidden={!open}
        className="
          absolute right-0 top-full z-50 mt-2
          w-64 max-w-[calc(100vw-3rem)]
          overflow-hidden rounded-2xl
          border border-slate-100 bg-white
          shadow-[0_14px_45px_rgba(20,43,69,0.12)]
          dark:border-slate-700 dark:bg-slate-900
        "
      >
        <div className="flex items-center gap-3 px-4 py-4">
          <span
            className="
              flex h-10 w-10 shrink-0 items-center
              justify-center rounded-full
              bg-[#E7F5EE] text-[#087F5B]
              dark:bg-emerald-950 dark:text-emerald-400
            "
          >
            <UserRound size={20} aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <div
              className="
                truncate text-sm font-semibold
                text-[#142B45] dark:text-white
              "
            >
              {user.name}
            </div>

            <div
              title={user.email}
              className="
                mt-0.5 truncate text-xs text-[#64748B]
                dark:text-slate-400
              "
            >
              {user.email}
            </div>
          </div>
        </div>

        <div
          className="
            mx-3 border-t border-slate-100
            dark:border-slate-700
          "
        />

        <div
          id={menuId}
          role="menu"
          aria-label="Аккаунт әрекеттері"
          onKeyDown={handleMenuKeyDown}
          className="p-2"
        >
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                ref={index === 0 ? firstItemRef : null}
                to={item.to}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className={menuItemClass}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}

          <div
            className="
              my-2 border-t border-slate-100
              dark:border-slate-700
            "
          />

          <button
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            disabled={isLoggingOut}
            aria-busy={isLoggingOut}
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3
              rounded-xl px-3 py-3 text-left
              text-sm font-medium text-red-600
              transition-colors hover:bg-red-50
              focus-visible:bg-red-50
              focus-visible:outline-none
              disabled:cursor-wait disabled:opacity-60
              dark:text-red-400
              dark:hover:bg-red-950/40
            "
          >
            <LogOut size={18} aria-hidden="true" />
            {isLoggingOut
              ? "Шығу орындалуда…"
              : "Жүйеден шығу"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;
