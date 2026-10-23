const API_URL = "http://localhost:3000/api/v1/auth";

async function sendAuthRequest(endpoint, body) {
  let response;

  try {
    response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Серверге қосылу мүмкін емес. Backend іске қосылғанын тексеріңіз."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Сұрау орындалмады.");
  }

  if (!data?.user) {
    throw new Error("Серверден күтілген жауап келмеді.");
  }

  return data;
}

export function loginUser({ email, password }) {
  return sendAuthRequest("login", { email, password });
}

export function registerUser({ name, email, password }) {
  return sendAuthRequest("register", { name, email, password });
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.user) {
    throw new Error(
      data?.message || "Пайдаланушыны тексеру мүмкін болмады."
    );
  }

  return data.user;
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  // Сессия аяқталған болса, пайдаланушы жүйеден шыққан.
  if (response.status === 401) return;

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message || "Жүйеден шығу орындалмады."
    );
  }
}