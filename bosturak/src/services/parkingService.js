import { validateParkings } from "../data/demoParkings";

const API_URL = "http://localhost:3000/api/v1/parkings";

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

  if (!data) {
    throw new Error("Сервер жауабының форматы дұрыс емес.");
  }

  return data;
}

function jsonOptions(method, parking) {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parking),
  };
}

export async function fetchParkings({ signal } = {}) {
  const data = await request("", { signal });

  validateParkings(data.parkings);

  return data.parkings;
}

export async function createParking(parking) {
  const data = await request(
    "",
    jsonOptions("POST", parking)
  );

  validateParkings([data.parking]);

  return data.parking;
}

export async function updateParking(id, parking) {
  const data = await request(
    `/${encodeURIComponent(id)}`,
    jsonOptions("PUT", parking)
  );

  validateParkings([data.parking]);

  return data.parking;
}

export async function deleteParking(id) {
  await request(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}