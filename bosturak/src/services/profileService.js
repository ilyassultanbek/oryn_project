
const API_URL = "http://localhost:3000/api/v1/profile";

async function profileRequest(endpoint, body) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Сұрауды орындау мүмкін болмады."
    );
  }

  return data;
}

export function updateProfile({ name, email }) {
  return profileRequest("", {
    name,
    email,
  });
}

export function changePassword({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  return profileRequest("/password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
}
