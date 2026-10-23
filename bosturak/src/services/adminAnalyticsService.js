
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export async function getAdminAnalytics() {
  const response = await fetch(
    `${API_BASE}/api/v1/admin/analytics`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Сессия аяқталды. Қайта кіріңіз."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "Бұл бөлімге кіруге рұқсат жоқ."
      );
    }

    throw new Error(
      `Статистиканы алу мүмкін болмады (${response.status}).`
    );
  }

  return response.json();
}
