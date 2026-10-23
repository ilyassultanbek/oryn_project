
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  UserRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  fetchUsers,
  fetchUserStats,
  updateUserRole,
} from "../../../services/userService";

function StatCard({ title, value, Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{title}</span>
        <Icon size={20} className="text-emerald-700" />
      </div>

      <p className="mt-3 text-3xl font-semibold text-slate-900">
        {value ?? "—"}
      </p>
    </div>
  );
}

function AdminUsersPanel({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [usersData, statsData] = await Promise.all([
          fetchUsers({
            page,
            search: query,
            signal: controller.signal,
          }),
          fetchUserStats({
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) return;

        setUsers(usersData.users);
        setPagination(usersData.pagination);
        setStats(statsData);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(err.message);
        setUsers([]);
        setPagination(null);
        setStats(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, [page, query, revision]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  function refresh() {
    setNotice("");
    setRevision((value) => value + 1);
  }

  async function changeRole(user, role) {
    if (savingId !== null || loading || error) return;
    if (user.role === role) return;

    if (String(user.id) === String(currentUserId)) {
      setError("Өзіңіздің рөліңізді өзгертуге болмайды.");
      return;
    }

    const confirmed = window.confirm(
      `${user.name} қолданушысының рөлін "${role}" деп өзгертесіз бе?`
    );

    if (!confirmed) return;

    setSavingId(user.id);
    setError("");
    setNotice("");

    try {
      await updateUserRole(user.id, role);

      setNotice("Қолданушы рөлі сәтті өзгертілді.");
      setRevision((value) => value + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Барлық қолданушылар"
          value={stats?.total}
          Icon={Users}
        />
        <StatCard
          title="Әкімшілер"
          value={stats?.admins}
          Icon={ShieldCheck}
        />
        <StatCard
          title="Қарапайым қолданушылар"
          value={stats?.regular_users}
          Icon={UserRound}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Қолданушылар тізімі
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Тіркелген аккаунттарды басқару
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading || savingId !== null}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Жаңарту
          </button>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-5 flex flex-wrap gap-3"
        >
          <div className="relative min-w-48 flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Аты немесе email бойынша іздеу"
              aria-label="Қолданушыларды іздеу"
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#182523] px-5 py-3 text-sm font-medium text-white hover:bg-emerald-900"
          >
            Іздеу
          </button>
        </form>

        {notice && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {notice}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-4 font-medium">Қолданушы</th>
                <th className="px-4 py-4 font-medium">Рөлі</th>
                <th className="px-4 py-4 font-medium">Тіркелген күні</th>
                <th className="px-4 py-4 font-medium">Басқару</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isSelf =
                  String(user.id) === String(currentUserId);

                return (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">
                        {user.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-slate-400">
                            (Сіз)
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "kk-KZ"
                          )
                        : "—"}
                    </td>

                    <td className="px-4 py-4">
                      <select
                        aria-label={`${user.name} рөлін өзгерту`}
                        value={user.role}
                        disabled={
                          isSelf ||
                          savingId !== null ||
                          loading ||
                          Boolean(error)
                        }
                        onChange={(event) =>
                          changeRole(user, event.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && !error && users.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">
              Қолданушылар табылмады.
            </p>
          )}

          {loading && (
            <p role="status" className="py-8 text-center text-sm text-slate-500">
              Қолданушылар жүктелуде...
            </p>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-500">
              {pagination.page} / {pagination.totalPages} бет
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  page <= 1 || loading || savingId !== null
                }
                onClick={() => setPage((value) => value - 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Алдыңғы бет"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                disabled={
                  page >= pagination.totalPages ||
                  loading ||
                  savingId !== null
                }
                onClick={() => setPage((value) => value + 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Келесі бет"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminUsersPanel;
