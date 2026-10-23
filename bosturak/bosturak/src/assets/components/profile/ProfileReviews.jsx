
import { MessageSquareText } from "lucide-react";
import MyReviews from "../reviews/MyReviews";

function ProfileReviews({
  reviews,
  loading,
  saving,
  error,
  onRefresh,
  onEdit,
  onDelete,
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <MessageSquareText size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Менің пікірлерім
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Қалдырған пікірлеріңізді қарап, басқарыңыз.
          </p>
        </div>
      </div>

      <MyReviews
        reviews={reviews}
        loading={loading}
        saving={saving}
        error={error}
        onRefresh={onRefresh}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  );
}

export default ProfileReviews;
