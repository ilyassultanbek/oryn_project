
import { Link } from "react-router-dom";

const descriptions = {
  map: "Тұрақтарды сайт картасынан көруге болады. Осы панельдегі карта арқылы басқару әлі қосылмаған.",

  occupancy:
    "Бос орын санын «Тұрақтарды басқару» бөлімінде өзгертуге болады. Бөлек мониторинг экраны әлі қосылмаған.",
};

function AdminEmptySection({ section, onTabChange }) {
  const SectionIcon = section.icon;
  const description =
    descriptions[section.id] ??
    "Бұл бөлімнің басқару мүмкіндіктері әлі қосылмаған. Оларды келесі кезеңдерде іске асырамыз.";

  return (
    <section className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-[28px] border border-white bg-white/75 px-6 py-12 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <SectionIcon size={28} aria-hidden="true" />
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        {section.label}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {section.id === "map" && (
        <Link
          to="/map"
          className="mt-6 rounded-xl bg-[#182523] px-5 py-3 text-sm font-medium text-white hover:bg-emerald-900"
        >
          Сайт картасын ашу
        </Link>
      )}

      {section.id === "occupancy" && (
        <button
          type="button"
          onClick={() => onTabChange("parkings")}
          className="mt-6 rounded-xl bg-[#182523] px-5 py-3 text-sm font-medium text-white hover:bg-emerald-900"
        >
          Тұрақтарды басқаруға өту
        </button>
      )}
    </section>
  );
}

export default AdminEmptySection;
