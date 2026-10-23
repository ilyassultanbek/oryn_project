
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareText,
  Heart,
  Settings,
  ArrowLeft,
  UserRound,
} from "lucide-react";
import logo from "../../images/logo.png";

const menuItems = [
  {
    label: "Шолу",
    icon: LayoutDashboard,
    section: "overview",
  },
  {
    label: "Менің пікірлерім",
    icon: MessageSquareText,
    section: "reviews",
  },
  {
    label: "Таңдаулылар",
    icon: Heart,
    section: "favorites",
  },
  {
    label: "Баптаулар",
    icon: Settings,
    section: "settings",
  },
];

function ProfileSidebar({
  user,
  activeSection = "overview",
  onSectionChange,
}) {
  const displayName = user?.name || "Қолданушы";

  return (
    <aside className="flex w-full flex-col gap-5 lg:w-[245px] lg:shrink-0">
      {/* Brand */}
      <NavLink to="/"
      aria-label="Oryn — басты бет"
     className="flex items-center px-3 py-2"
   >
  <img
    src={logo}
    alt="Oryn"
    className="h-11 w-auto max-w-[180px] object-contain"
  />
</NavLink>

      {/* User Card */}
      <div className="rounded-[22px] bg-[#f6f7f8] px-4 py-6 text-center dark:bg-slate-800">
        <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white text-[#16844a] shadow-sm dark:bg-slate-700">
          <UserRound size={35} />
        </div>

        <h2 className="mt-4 break-words text-base font-bold text-slate-900 dark:text-white">
          {displayName}
        </h2>

        <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
          {user?.email || "Oryn қолданушысы"}
        </p>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Жеке кабинет мәзірі"
        className="rounded-[22px] bg-[#f6f7f8] p-3 dark:bg-slate-800"
      >
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;

            return (
              <button
                key={item.section}
                type="button"
                onClick={() => onSectionChange?.(item.section)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-[#16844a] shadow-sm dark:bg-slate-700 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700",
                ].join(" ")}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Card */}
      <div className="rounded-[22px] bg-[#151a19] p-5 text-white">
        <p className="text-sm font-semibold">
          Oryn Parking
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-300">
          Алматыдағы тұрақтарды оңай тауып,
          таңдаулыларыңызды басқарыңыз.
        </p>

        <NavLink
          to="/parkings"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          <ArrowLeft size={15} />
          Тұрақтарға қайту
        </NavLink>
      </div>
    </aside>
  );
}

export default ProfileSidebar;
