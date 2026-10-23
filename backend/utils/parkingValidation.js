const districts = [
  "Алатау",
  "Алмалы",
  "Әуезов",
  "Бостандық",
  "Жетісу",
  "Медеу",
  "Наурызбай",
  "Түрксіб",
];

function validateParking(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Тұрақ деректері дұрыс емес.";
  }

  const allowedFields = [
    "name",
    "address",
    "district",
    "capacity",
    "freeSpaces",
    "price",
    "isCovered",
    "lat",
    "lng",
    "features",
  ];

  if (Object.keys(body).some((key) => !allowedFields.includes(key))) {
    return "Сұрауда рұқсат етілмеген өрістер бар.";
  }

  if (
    typeof body.name !== "string" ||
    body.name.trim().length < 2 ||
    body.name.trim().length > 150
  ) {
    return "Тұрақ атауы 2–150 таңба болуы керек.";
  }

  if (
    typeof body.address !== "string" ||
    !body.address.trim() ||
    body.address.trim().length > 255
  ) {
    return "Мекенжайды енгізіңіз: ең көбі 255 таңба.";
  }

  if (!districts.includes(body.district)) {
    return "Ауданды тізімнен таңдаңыз.";
  }

  if (
    !Number.isInteger(body.capacity) ||
    body.capacity < 1 ||
    body.capacity > 2147483647
  ) {
    return "Сыйымдылық дұрыс оң бүтін сан болуы керек.";
  }

  if (
    body.freeSpaces !== null &&
    (!Number.isInteger(body.freeSpaces) ||
      body.freeSpaces < 0 ||
      body.freeSpaces > body.capacity)
  ) {
    return "Бос орын саны 0 мен сыйымдылық арасында болуы керек.";
  }

  if (
    !Number.isFinite(body.price) ||
    body.price < 0 ||
    body.price > 99999999.99 ||
    Math.abs(body.price * 100 - Math.round(body.price * 100)) > 0.00001
  ) {
    return "Баға теріс болмауы және үтірден кейін ең көбі 2 цифр болуы керек.";
  }

  if (typeof body.isCovered !== "boolean") {
    return "Тұрақ түрі дұрыс емес.";
  }

  if (
    !Number.isFinite(body.lat) ||
    body.lat < -90 ||
    body.lat > 90 ||
    !Number.isFinite(body.lng) ||
    body.lng < -180 ||
    body.lng > 180
  ) {
    return "Координаттар дұрыс емес.";
  }

  if (
    body.features !== undefined &&
    (!Array.isArray(body.features) ||
      body.features.length > 20 ||
      body.features.some(
        (feature) =>
          typeof feature !== "string" ||
          !feature.trim() ||
          feature.trim().length > 100
      ))
  ) {
    return "Ерекшеліктер: ең көбі 20 мәтін, әрқайсысы 1–100 таңба.";
  }

  return null;
}

module.exports = { validateParking };