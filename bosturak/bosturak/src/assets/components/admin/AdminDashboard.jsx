
import { ArrowUpRight } from "lucide-react";
import AdminStats from "./AdminStats";

const quickActions = [
  {
    id: "parkings",
    title: "Тұрақтарды басқару",
    description: "Жаңа тұрақ қосу немесе ақпаратын өзгерту.",
  },
  {
    id: "messages",
    title: "Өтініштерді қарау",
    description: "Қолданушы хабарламалары мен шағымдарын өңдеу.",
  },
];

function AdminDashboard({ parkingAdmin, messageAdmin, onTabChange }) {
  const isLoading = parkingAdmin.loading || messageAdmin.loading;

  return (
    <>
      {isLoading ? (
        <div
          role="status"
          className="mt-6 rounded-3xl bg-white/80 p-8 text-slate-500"
        >
          Көрсеткіштер жүктелуде...
        </div>
      ) : (
        <AdminStats
          parkings={parkingAdmin.parkings}
          parkingError={parkingAdmin.loadError}
          newMessagesCount={messageAdmin.newCount}
          messagesError={messageAdmin.error}
        />
      )}

      <section
        aria-label="Жылдам әрекеттер"
        className="mt-6 grid gap-4 md:grid-cols-2"
      >
        {quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onTabChange(action.id)}
            className="flex items-center justify-between gap-4 rounded-3xl border border-white bg-white/80 p-6 text-left shadow-sm transition-colors hover:bg-white"
          >
            <div>
              <h2 className="font-semibold">{action.title}</h2>

              <p className="mt-2 text-sm text-slate-500">
                {action.description}
              </p>
            </div>

            <ArrowUpRight
              size={22}
              className="shrink-0 text-emerald-700"
              aria-hidden="true"
            />
          </button>
        ))}
      </section>
    </>
  );
}

export default AdminDashboard;
