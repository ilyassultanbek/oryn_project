import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import logo from "../../images/logo.webp";
import { adminSections } from "./adminSections";

function AdminSidebar({
  activeTab,
  onTabChange,
  newMessagesCount = 0,
  collapsed,
  onToggleCollapse,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function selectSection(id) {
    onTabChange(id);
    setMobileOpen(false);
  }

  return (
    <aside
      className="border-b border-white/80 bg-white/55 p-3
        backdrop-blur-xl lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]
        lg:rounded-[26px] lg:border lg:shadow-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex min-h-14 items-center justify-between gap-2">
          <Link
            to="/"
            aria-label="Oryn басты беті"
            className={`rounded-xl px-2 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <img src={logo} alt="Oryn" className="w-28" />
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Мәзірді кеңейту" : "Мәзірді жинау"}
            aria-expanded={!collapsed}
            className="mx-auto hidden h-10 w-10 items-center
              justify-center rounded-xl text-slate-500
              hover:bg-white focus-visible:outline-2
              focus-visible:outline-emerald-600 lg:flex"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-expanded={mobileOpen}
            aria-controls="admin-navigation"
            aria-label={mobileOpen ? "Мәзірді жабу" : "Мәзірді ашу"}
            className="flex h-10 w-10 items-center justify-center
              rounded-xl bg-white text-slate-700 lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav
          id="admin-navigation"
          aria-label="Басқару бөлімдері"
          className={`mt-5 min-h-0 flex-1 space-y-1 overflow-y-auto
            ${mobileOpen ? "block" : "hidden"} lg:block`}
        >
          {adminSections.map((section) => {
            const Icon = section.icon;
            const active = activeTab === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => selectSection(section.id)}
                aria-current={active ? "page" : undefined}
                aria-label={section.label}
                title={section.label}
                className={`relative flex min-h-11 w-full items-center
                  gap-3 rounded-2xl px-3 py-2.5 text-left text-[13px]
                  font-medium transition-colors
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-emerald-600
                  motion-reduce:transition-none ${
                    collapsed ? "lg:justify-center" : ""
                  } ${
                    active
                      ? "bg-[#182523] text-white shadow-sm"
                      : "text-slate-500 hover:bg-white/90 hover:text-slate-900"
                  }`}
              >
                <Icon size={19} className="shrink-0" aria-hidden="true" />

                <span className={collapsed ? "lg:hidden" : ""}>
                  {section.label}
                </span>

                {section.id === "messages" && newMessagesCount > 0 && (
                  <span
                    className={`rounded-full bg-emerald-100 px-1.5
                      py-0.5 text-[10px] font-semibold text-emerald-800 ${
                        collapsed
                          ? "ml-auto lg:absolute lg:right-0 lg:top-0"
                          : "ml-auto"
                      }`}
                  >
                    {newMessagesCount > 99 ? "99+" : newMessagesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <Link
          to="/"
          title="Сайтқа қайту"
          aria-label="Сайтқа қайту"
          className={`mt-4 items-center gap-3 rounded-2xl
            border border-white bg-white/60 px-3 py-3
            text-sm text-slate-600 hover:bg-white
            ${mobileOpen ? "flex" : "hidden"} lg:flex
            ${collapsed ? "lg:justify-center" : ""}`}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span className={collapsed ? "lg:hidden" : ""}>
            Сайтқа қайту
          </span>
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;