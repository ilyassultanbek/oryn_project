
import { LogOut, UserRound } from "lucide-react";

function AdminHeader({
  sectionLabel,
  user,
  authLoading,
  isLoggingOut,
  onLogout,
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/80 px-5 py-4 lg:px-3">
      <div className="text-xs text-slate-500">
        Oryn Admin

        <span className="mx-2 text-slate-400">/</span>

        <span className="text-slate-700">{sectionLabel}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/75 px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <UserRound size={19} aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <p className="max-w-40 truncate text-xs font-semibold">
              {authLoading
                ? "Жүктелуде..."
                : user?.name ?? "Аккаунт қолжетімсіз"}
            </p>

            {user && (
              <p className="mt-0.5 text-[10px] text-slate-500">
                {user.role === "admin" ? "Әкімші" : "Қолданушы"}
              </p>
            )}
          </div>
        </div>

        {user && (
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            aria-label="Жүйеден шығу"
            title="Жүйеден шығу"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
