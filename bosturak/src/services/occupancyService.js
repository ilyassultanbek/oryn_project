
const API_URL = "http://localhost:3000/api/v1/admin/occupancy";

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
      "Backend серверіне қосылу мүмкін емес."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Сұрауды орындау мүмкін болмады."
    );
  }

  if (!data) {
    throw new Error("Сервер жауабы дұрыс емес.");
  }

  return data;
}

export async function fetchOccupancy({ signal } = {}) {
  const data = await request("", { signal });

  if (
    !data.summary ||
    !Array.isArray(data.parkings)
  ) {
    throw new Error("Бос орындар деректерінің форматы дұрыс емес.");
  }

  return data;
}

export async function updateOccupancy(id, freeSpaces) {
  const data = await request(
    `/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ freeSpaces }),
    }
  );

  return data.parking;
}
