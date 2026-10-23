const API_URL = "http://localhost:3000/api/v1/favorites";

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
      "Серверге қосылу мүмкін болмады. Байланысты тексеріңіз."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      response.status === 401
        ? "Таңдаулыларды пайдалану үшін жүйеге кіріңіз."
        : data?.message || "Сұранысты орындау мүмкін болмады."
    );

    error.status = response.status;
    throw error;
  }

  if (!data) {
    throw new Error("Сервер жауабының форматы дұрыс емес.");
  }

  return data;
}

export async function fetchFavorites({ signal } = {}) {
  const data = await request("", { signal });

  if (
    !Array.isArray(data.favorites) ||
    !data.favorites.every(
      (id) => Number.isSafeInteger(id) && id > 0
    )
  ) {
    throw new Error("Таңдаулылар тізімінің форматы дұрыс емес.");
  }

  return [...new Set(data.favorites)];
}

export async function setParkingFavorite(parkingId, isFavorite) {
  if (!Number.isSafeInteger(parkingId) || parkingId <= 0) {
    throw new Error("Тұрақ идентификаторы дұрыс емес.");
  }

  const data = await request(`/${parkingId}`, {
    method: isFavorite ? "PUT" : "DELETE",
  });

  if (
    data.parkingId !== parkingId ||
    data.isFavorite !== isFavorite
  ) {
    throw new Error("Сервер жауабының форматы дұрыс емес.");
  }

  return data;
}