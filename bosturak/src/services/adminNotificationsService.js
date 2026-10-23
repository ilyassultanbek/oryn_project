
const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const API_URL = `${API_BASE}/api/v1/admin/notifications`;

async function request(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Жүйеге қайта кіріңіз.");
    }

    if (response.status === 403) {
      throw new Error(
        "Бұл әрекетті орындауға рұқсат жоқ."
      );
    }

    throw new Error(
      data?.error ||
      data?.message ||
      `Сервер қатесі: ${response.status}`
    );
  }

  return data;
}

// Барлық хабарландырулар
export function getAdminNotifications() {
  return request();
}

// Жаңа хабарландыру
export function createAdminNotification(data) {
  return request("", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Хабарландыруды өңдеу
export function updateAdminNotification(id, data) {
  return request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Жариялау немесе жасыру
export function publishAdminNotification(id, published) {
  return request(`/${id}/publish`, {
    method: "PATCH",
    body: JSON.stringify({ published }),
  });
}

// Жою
export function deleteAdminNotification(id) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}
