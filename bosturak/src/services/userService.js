
const API_URL = "http://localhost:3000/api/v1/admin/users";

async function request(path = "", options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;

    throw new Error(
      "Серверге қосылу мүмкін емес. Backend қосулы екенін тексеріңіз."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Сұрауды орындау мүмкін болмады."
    );
  }

  if (!data || typeof data !== "object") {
    throw new Error("Сервер жауабының форматы дұрыс емес.");
  }

  return data;
}

export async function fetchUsers({
  page = 1,
  search = "",
  signal,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    search,
  });

  const data = await request(`?${params}`, { signal });

  if (
    !Array.isArray(data.users) ||
    !data.pagination ||
    typeof data.pagination.total !== "number"
  ) {
    throw new Error("Қолданушылар деректерінің форматы дұрыс емес.");
  }

  return data;
}

export async function fetchUserStats({ signal } = {}) {
  const data = await request("/stats", { signal });

  if (
    typeof data.total !== "number" ||
    typeof data.admins !== "number" ||
    typeof data.regular_users !== "number"
  ) {
    throw new Error("Статистика форматы дұрыс емес.");
  }

  return data;
}

export async function updateUserRole(id, role) {
  const data = await request(
    `/${encodeURIComponent(id)}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  if (!data.user) {
    throw new Error("Қолданушы деректері қайтарылмады.");
  }

  return data.user;
}
