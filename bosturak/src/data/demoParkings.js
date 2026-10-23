export const districts = [
  "Алатау",
  "Алмалы",
  "Әуезов",
  "Бостандық",
  "Жетісу",
  "Медеу",
  "Наурызбай",
  "Түрксіб",
];

export const PARKINGS_STORAGE_KEY = "bosturak-admin-parkings";

export function validateParkings(parkings) {
  if (!Array.isArray(parkings)) {
    throw new Error("Тұрақтар тізімінің форматы дұрыс емес.");
  }

  const ids = new Set();

  for (const parking of parkings) {
    if (!parking || typeof parking !== "object") {
      throw new Error("Тұрақ деректері дұрыс емес.");
    }

    const validId =
      (typeof parking.id === "string" && parking.id.trim() !== "") ||
      (typeof parking.id === "number" && Number.isFinite(parking.id));

    if (!validId || ids.has(String(parking.id))) {
      throw new Error("Тұрақ идентификаторы дұрыс емес немесе қайталанады.");
    }

    ids.add(String(parking.id));

    if (
      typeof parking.name !== "string" ||
      !parking.name.trim() ||
      typeof parking.address !== "string" ||
      !parking.address.trim()
    ) {
      throw new Error("Тұрақ атауы мен мекенжайын толтырыңыз.");
    }

    if (!districts.includes(parking.district)) {
      throw new Error("Ауданды тізімнен таңдаңыз.");
    }

    if (
      !Number.isInteger(parking.capacity) ||
      parking.capacity <= 0
    ) {
      throw new Error("Жалпы орын саны нөлден үлкен бүтін сан болуы керек.");
    }

    if (
      parking.freeSpaces !== null &&
      (!Number.isInteger(parking.freeSpaces) ||
        parking.freeSpaces < 0 ||
        parking.freeSpaces > parking.capacity)
    ) {
      throw new Error(
        "Бос орын саны 0-ден жалпы орын санына дейін болуы керек."
      );
    }

    if (!Number.isFinite(parking.price) || parking.price < 0) {
      throw new Error("Баға нөл немесе оң сан болуы керек.");
    }

    if (
      !Number.isFinite(parking.lat) ||
      parking.lat < -90 ||
      parking.lat > 90 ||
      !Number.isFinite(parking.lng) ||
      parking.lng < -180 ||
      parking.lng > 180
    ) {
      throw new Error("Карта координаттары дұрыс емес.");
    }

    if (typeof parking.isCovered !== "boolean") {
      throw new Error("Тұрақ түрі дұрыс емес.");
    }

    if (
      parking.features !== undefined &&
      (!Array.isArray(parking.features) ||
        parking.features.some((feature) => typeof feature !== "string"))
    ) {
      throw new Error("Тұрақ ерекшеліктерінің форматы дұрыс емес.");
    }
  }
}

export function getParkings() {
  const raw = localStorage.getItem(PARKINGS_STORAGE_KEY);

  // Алғаш ашылғанда ғана бастапқы демо тұрақтарды қолданамыз.
  if (raw === null) {
    return demoParkings.map((parking) => ({
      ...parking,
      features: [...(parking.features ?? [])],
    }));
  }

  const saved = JSON.parse(raw);
  validateParkings(saved);

  // Бос массив те сақталған нәтиже:
  // барлық тұрақ жойылса, демо тізімді қайта қоспаймыз.
  return saved;
}