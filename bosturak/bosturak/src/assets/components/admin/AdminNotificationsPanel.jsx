
import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Send,
  EyeOff,
  RefreshCw,
  X,
} from "lucide-react";

import {
  getAdminNotifications,
  createAdminNotification,
  updateAdminNotification,
  publishAdminNotification,
  deleteAdminNotification,
} from "../../../services/adminNotificationsService";

const initialForm = {
  title: "",
  body: "",
  audience: "all",
};

const audiences = {
  all: "Барлық қолданушылар",
  user: "Қолданушылар",
  owner: "Тұрақ иелері",
  operator: "Операторлар",
  admin: "Әкімшілер",
};

export default function AdminNotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminNotifications();

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...initialForm });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      body: item.body,
      audience: item.audience,
    });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingId(null);
    setForm({ ...initialForm });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      audience: form.audience,
    };

    if (!payload.title || !payload.body) {
      setError("Барлық міндетті өрістерді толтырыңыз.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId !== null) {
        await updateAdminNotification(editingId, payload);
        setSuccess("Хабарландыру жаңартылды.");
      } else {
        await createAdminNotification(payload);
        setSuccess("Хабарландыру сақталды.");
      }

      setFormOpen(false);
      setEditingId(null);
      setForm({ ...initialForm });

      await loadNotifications();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item) {
    if (saving) return;

    const published = !item.published_at;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await publishAdminNotification(
        item.id,
        published
      );

      setSuccess(
        published
          ? "Хабарландыру жарияланды."
          : "Хабарландыру жасырылды."
      );

      await loadNotifications();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (saving) return;

    const confirmed = window.confirm(
      `"${item.title}" хабарландыруын жоясыз ба?`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await deleteAdminNotification(item.id);

      setSuccess("Хабарландыру жойылды.");
      await loadNotifications();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const total = notifications.length;

  const publishedCount = notifications.filter(
    (item) => item.published_at
  ).length;

  const draftCount = total - publishedCount;

  const inputClass =
    "w-full rounded-xl border border-slate-200 " +
    "bg-white px-4 py-3 text-sm outline-none " +
    "focus:border-violet-500 focus:ring-2 " +
    "focus:ring-violet-100";

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Хабарландыруларды басқару
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Жаңа хабарландырулар жариялаңыз және басқарыңыз.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading || saving}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Жаңарту
          </button>

          <button
            type="button"
            onClick={openCreate}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            <Plus size={18} />
            Жаңа хабарландыру
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Барлық хабарландыру",
            value: total,
          },
          {
            label: "Жарияланған",
            value: publishedCount,
          },
          {
            label: "Жоба күйінде",
            value: draftCount,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}

      {/* Form */}
      {formOpen && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold">
              {editingId !== null
                ? "Хабарландыруды өңдеу"
                : "Жаңа хабарландыру"}
            </h3>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              aria-label="Жабу"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="notification-title"
                className="mb-2 block text-sm font-medium"
              >
                Тақырып
              </label>

              <input
                id="notification-title"
                required
                maxLength={120}
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Мысалы: Жаңа тұрақ қосылды"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="notification-audience"
                className="mb-2 block text-sm font-medium"
              >
                Кімдерге көрсетіледі?
              </label>

              <select
                id="notification-audience"
                value={form.audience}
                onChange={(e) =>
                  setForm({
                    ...form,
                    audience: e.target.value,
                  })
                }
                className={inputClass}
              >
                {Object.entries(audiences).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs text-slate-500">
                Ескерту: жария API әзірге тек
                «Барлық қолданушылар» хабарландыруларын
                қайтарады.
              </p>
            </div>

            <div>
              <label
                htmlFor="notification-body"
                className="mb-2 block text-sm font-medium"
              >
                Хабарлама мәтіні
              </label>

              <textarea
                id="notification-body"
                required
                rows={5}
                maxLength={2000}
                value={form.body}
                onChange={(e) =>
                  setForm({
                    ...form,
                    body: e.target.value,
                  })
                }
                placeholder="Хабарламаңызды жазыңыз..."
                className={`${inputClass} resize-y`}
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {form.body.length}/2000
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border px-5 py-3 text-sm"
              >
                Болдырмау
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? "Сақталуда..." : "Сақтау"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Notifications */}
      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
          Жүктелуде...
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Bell
            size={36}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-4 text-lg font-semibold">
            Хабарландырулар жоқ
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Алғашқы хабарландыруды жасаңыз.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => {
            const published = Boolean(
              item.published_at
            );

            return (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold">
                        {item.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {published
                          ? "Жарияланған"
                          : "Жоба"}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                      {item.body}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span>
                        Аудитория:{" "}
                        {audiences[item.audience] ??
                          item.audience}
                      </span>

                      <span>
                        Құрылған:{" "}
                        {new Date(
                          item.created_at
                        ).toLocaleDateString("kk-KZ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => openEdit(item)}
                      className="rounded-xl bg-slate-100 p-3 hover:bg-slate-200 disabled:opacity-50"
                      title="Өңдеу"
                      aria-label="Өңдеу"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => togglePublish(item)}
                      className="rounded-xl bg-violet-50 p-3 text-violet-700 hover:bg-violet-100 disabled:opacity-50"
                      title={
                        published ? "Жасыру" : "Жариялау"
                      }
                      aria-label={
                        published ? "Жасыру" : "Жариялау"
                      }
                    >
                      {published ? (
                        <EyeOff size={17} />
                      ) : (
                        <Send size={17} />
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleDelete(item)}
                      className="rounded-xl bg-red-50 p-3 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      title="Жою"
                      aria-label="Жою"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
