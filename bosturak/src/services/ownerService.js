const API_URL = "http://localhost:3000/api/v1/admin/owners";

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
    throw new Error("Backend серверіне қосылу мүмкін емес.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Сұрау орындалмады.");
  }

  return data;
}

export async function fetchOwners({ signal } = {}) {
  const data = await request("", { signal });
  return data.owners;
}

export async function fetchOwnerParkings({ signal } = {}) {
  const data = await request("/parkings", { signal });
  return data.parkings;
}

export async function promoteOwner(userId) {
  const data = await request(`/${encodeURIComponent(userId)}/promote`, {
    method: "PATCH",
  });

  return data.owner;
}

export async function assignParkingOwner(parkingId, ownerId) {
  const data = await request(
    `/parkings/${encodeURIComponent(parkingId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ownerId }),
    }
  );

  return data.parking;
}