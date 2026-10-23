
import { useMemo, useState } from "react";
import { Trash2, RefreshCw, Search } from "lucide-react";

import {
  MESSAGE_TOPICS,
  MESSAGE_STATUSES,
} from "../../../services/messagesService";

const statusClasses = {
  new: "bg-violet-50 text-violet-800",
  in_progress: "bg-amber-50 text-amber-800",
  resolved: "bg-emerald-50 text-emerald-800",
};

function formatDate(value) {
  if (!value) return "Уақыты көрсетілмеген";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Уақыты көрсетілмеген";
  }

  return date.toLocaleString("kk-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function MessageCard({
  message,
  onStatusChange,
  onDelete,
  disabled,
}) {
  const topic = Object.hasOwn(
    MESSAGE_TOPICS,
    message.topic
  )
    ? MESSAGE_TOPICS[message.topic]
    : "Басқа тақырып";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="break-words font-semibold text-slate-900">
            {message.name}
          </h2>

          <p className="mt-1 break-words text-sm text-slate-500">
            {message.email}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {formatDate(message.createdAt)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusClasses[message.status] ??
            "bg-slate-100 text-slate-600"
          }`}
        >
          {MESSAGE_STATUSES[message.status] ??
            "Белгісіз күй"}
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-violet-700">
        {topic}
      </p>

      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
        {message.message}
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-5">
        <div>
          <label
            htmlFor={`message-status-${message.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Өңдеу күйі
          </label>

          <select
            id={`message-status-${message.id}`}
            value={message.status}
            disabled={disabled}
            onChange={(event) =>
              onStatusChange(
                message.id,
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 disabled:opacity-50 sm:w-56"
          >
            {Object.entries(MESSAGE_STATUSES).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onDelete(message.id)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
          Жою
        </button>
      </div>
    </article>
  );
}

function MessagesPanel({
  messages = [],
  error,
  newCount,
  loading = false,
  saving = false,
  onRefresh,
  onStatusChange,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const busy = loading || saving;

  const stats = useMemo(
    () => ({
      total: messages.length,
      new: messages.filter(
        (message) => message.status === "new"
      ).length,
      inProgress: messages.filter(
        (message) => message.status === "in_progress"
      ).length,
      resolved: messages.filter(
        (message) => message.status === "resolved"
      ).length,
    }),
    [messages]
  );

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return messages.filter((message) => {
      const matchesSearch = [
        message.name,
        message.email,
        message.message,
      ].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase()
          .includes(query)
      );

      const matchesStatus =
        statusFilter === "all" ||
        message.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  return (
    <section
      aria-label="Қолданушы хабарламалары"
      aria-busy={busy}
      className="mt-6 space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Барлық хабарламалар" value={stats.total} />
        <StatCard label="Жаңа" value={stats.new} />
        <StatCard label="Қаралуда" value={stats.inProgress} />
        <StatCard label="Шешілді" value={stats.resolved} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Хабарламалар тізімі
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Барлығы: {messages.length} · Жаңа: {newCount}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Хабарлама іздеу..."
                aria-label="Хабарлама іздеу"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Хабарлама күйін сүзу"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
            >
              <option value="all">Барлық күйлер</option>

              {Object.entries(MESSAGE_STATUSES).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              onClick={onRefresh}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              {loading ? "Жүктелуде..." : "Жаңарту"}
            </button>
          </div>
        </div>
      </div>

      {saving && (
        <p role="status" className="text-sm text-violet-700">
          Өзгерістер сақталуда...
        </p>
      )}

      {loading ? (
        <p
          role="status"
          className="rounded-2xl bg-white p-8 text-slate-500"
        >
          Хабарламалар жүктелуде...
        </p>
      ) : error ? (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 p-5 text-sm text-red-800"
        >
          {error}
        </p>
      ) : filteredMessages.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
          {messages.length === 0
            ? "Хабарламалар әзірге жоқ."
            : "Іздеу немесе сүзгі бойынша хабарлама табылмады."}
        </p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              disabled={busy}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MessagesPanel;
