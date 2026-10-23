
import { useCallback, useEffect, useState } from "react";

import {
  fetchOwners,
  fetchOwnerParkings,
  promoteOwner,
  assignParkingOwner,
} from "../../../services/ownerService";

import { fetchUsers } from "../../../services/userService";

function AdminOwnersPanel() {
  const [owners, setOwners] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [notice, setNotice] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);
  const [usersRefreshKey, setUsersRefreshKey] = useState(0);

  const loadData = useCallback(async (signal) => {
    try {
      setError("");

      const [ownersData, parkingsData] = await Promise.all([
        fetchOwners({ signal }),
        fetchOwnerParkings({ signal }),
      ]);

      if (signal?.aborted) return;

      setOwners(ownersData);
      setParkings(parkingsData);
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) {
        setError(err.message);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadData(controller.signal);

    return () => controller.abort();
  }, [loadData, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setSearchingUsers(true);
      setSearchError("");

      try {
        const data = await fetchUsers({
          page: 1,
          search: userSearch.trim(),
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setUsers(
          data.users.filter((user) => user.role === "user")
        );
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setUsers([]);
          setSearchError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchingUsers(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [userSearch, usersRefreshKey]);

  function refreshData() {
    if (saving) return;

    setLoading(true);
    setNotice("");
    setRefreshKey((value) => value + 1);
    setUsersRefreshKey((value) => value + 1);
  }

  async function handlePromote() {
    if (!selectedUserId || saving) return;

    const user = users.find(
      (item) => String(item.id) === selectedUserId
    );

    if (!user) return;

    const confirmed = window.confirm(
      `${user.name} қолданушысын тұрақ иесі етесіз бе?`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await promoteOwner(user.id);

      setSelectedUserId("");

      await loadData();

      setUsersRefreshKey((value) => value + 1);

      setNotice("Қолданушы тұрақ иесі ретінде тіркелді.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAssign(parkingId, value) {
    if (saving) return;

    const ownerId = value === "" ? null : Number(value);

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await assignParkingOwner(parkingId, ownerId);

      await loadData();

      setNotice(
        ownerId === null
          ? "Тұрақ иесінен ажыратылды."
          : "Тұрақ иесіне сәтті бекітілді."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const unassignedCount = parkings.filter(
    (parking) => parking.owner_id == null
  ).length;

  const stats = [
    {
      label: "Тұрақ иелері",
      value: owners.length,
    },
    {
      label: "Барлық тұрақтар",
      value: parkings.length,
    },
    {
      label: "Иесі бекітілмеген",
      value: unassignedCount,
    },
  ];

  if (loading) {
    return (
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8">
        <p className="text-sm text-slate-500">
          Деректер жүктелуде...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={refreshData}
          disabled={saving}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Деректерді жаңарту
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Жаңа тұрақ иесін тіркеу
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Жүйеде тіркелген қолданушыны іздеп, оған
            тұрақ иесі рөлін тағайындаңыз.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="owner-user-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Қолданушыны іздеу
          </label>

          <input
            id="owner-user-search"
            type="search"
            value={userSearch}
            onChange={(event) => {
              setUserSearch(event.target.value);
              setSelectedUserId("");
            }}
            placeholder="Аты немесе email..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
          />

          {searchingUsers && (
            <p className="mt-2 text-xs text-slate-500">
              Қолданушылар ізделуде...
            </p>
          )}

          {searchError && (
            <p
              role="alert"
              className="mt-2 text-xs text-red-600"
            >
              {searchError}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedUserId}
            onChange={(event) =>
              setSelectedUserId(event.target.value)
            }
            disabled={saving || searchingUsers || !!searchError}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
          >
            <option value="">
              {users.length === 0
                ? "Қолданушылар табылмады"
                : "Қолданушыны таңдаңыз"}
            </option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {user.email}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handlePromote}
            disabled={
              !selectedUserId ||
              saving ||
              searchingUsers ||
              !!searchError
            }
            className="rounded-xl bg-[#123d32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1b5545] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Сақталуда..." : "Тұрақ иесі ету"}
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Аты немесе email арқылы іздеңіз.
          Әр сұрауда ең көбі 10 қолданушы көрсетіледі.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Тұрақ иелері
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Жүйеде тіркелген тұрақ иелерінің тізімі.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Аты-жөні
                </th>

                <th className="px-6 py-4 font-medium">
                  Email
                </th>

                <th className="px-6 py-4 font-medium">
                  Тұрақ саны
                </th>
              </tr>
            </thead>

            <tbody>
              {owners.map((owner) => (
                <tr
                  key={owner.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {owner.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {owner.email}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {owner.parking_count}
                  </td>
                </tr>
              ))}

              {owners.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Тұрақ иелері әлі тіркелмеген.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Тұрақтарды иелеріне бекіту
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Әр тұраққа жауапты иені таңдаңыз немесе
            бұрынғы иесінен ажыратыңыз.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Тұрақ
                </th>

                <th className="px-6 py-4 font-medium">
                  Аудан
                </th>

                <th className="px-6 py-4 font-medium">
                  Иесі
                </th>
              </tr>
            </thead>

            <tbody>
              {parkings.map((parking) => (
                <tr
                  key={parking.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {parking.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {parking.district}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={parking.owner_id ?? ""}
                      onChange={(event) =>
                        handleAssign(
                          parking.id,
                          event.target.value
                        )
                      }
                      disabled={saving}
                      aria-label={`${parking.name} тұрақ иесі`}
                      className="w-full min-w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 disabled:opacity-50"
                    >
                      <option value="">
                        Иесі жоқ
                      </option>

                      {owners.map((owner) => (
                        <option
                          key={owner.id}
                          value={owner.id}
                        >
                          {owner.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {parkings.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Тұрақтар табылмады.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminOwnersPanel;
