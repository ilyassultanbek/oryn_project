
const API_URL = "http://localhost:3000/api/v1/messages";

// Хабарлама тақырыптары
export const MESSAGE_TOPICS = {
  question: "Сұрақ",
  suggestion: "Ұсыныс",
  error: "Қате туралы хабарлама",
  partnership: "Серіктестік",
};

// Хабарлама статустары
export const MESSAGE_STATUSES = {
  new: "Жаңа",
  in_progress: "Қаралуда",
  resolved: "Шешілді",
};

// Ортақ API сұрау функциясы
async function request(path = "", options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

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

  return data;
}

// 1. Хабарлама жіберу
export async function sendMessage(formData) {
  return request("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
}

// 2. Барлық хабарламаларды алу
export async function getMessages({ signal } = {}) {
  const data = await request("", {
    signal,
  });

  if (!Array.isArray(data?.messages)) {
    throw new Error(
      "Хабарламалар форматы дұрыс емес."
    );
  }

  return data.messages;
}

// 3. Хабарлама статусын өзгерту
export async function updateMessageStatus(id, status) {
  const data = await request(
    `/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  return data.item;
}

// 4. Хабарламаны жою
export async function deleteMessage(id) {
  return request(
    `/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}
