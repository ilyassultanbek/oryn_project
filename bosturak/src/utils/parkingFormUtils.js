
import { validateParkings } from "../data/demoParkings";

export const emptyParkingForm = {
  name: "",
  district: "",
  address: "",
  capacity: "",
  freeSpaces: "",
  price: "",
  lat: "",
  lng: "",
  isCovered: false,
};

const requiredFields = [
  "name",
  "district",
  "address",
  "capacity",
  "price",
  "lat",
  "lng",
];

export function createParkingForm(parking) {
  if (!parking) {
    return { ...emptyParkingForm };
  }

  return {
    name: parking.name ?? "",
    district: parking.district ?? "",
    address: parking.address ?? "",
    capacity: String(parking.capacity ?? ""),
    freeSpaces: String(parking.freeSpaces ?? ""),
    price: String(parking.price ?? ""),
    lat: String(parking.lat ?? ""),
    lng: String(parking.lng ?? ""),
    isCovered: Boolean(parking.isCovered),
  };
}

export function buildParkingPayload(form, existing) {
  const missingField = requiredFields.some(
    (field) => String(form[field] ?? "").trim() === ""
  );

  if (missingField) {
    throw new Error(
      "Міндетті өрістердің барлығын толтырыңыз."
    );
  }

  const payload = {
    name: form.name.trim(),
    district: form.district.trim(),
    address: form.address.trim(),
    capacity: Number(form.capacity),
    freeSpaces:
      String(form.freeSpaces).trim() === ""
        ? null
        : Number(form.freeSpaces),
    price: Number(form.price),
    lat: Number(form.lat),
    lng: Number(form.lng),
    isCovered: Boolean(form.isCovered),
    features: (existing?.features ?? []).filter(
      (feature) =>
        feature !== "Жабық тұрақ" &&
        feature !== "Ашық тұрақ"
    ),
  };

  const numericFields = [
    "capacity",
    "price",
    "lat",
    "lng",
  ];

  if (
    numericFields.some(
      (field) => !Number.isFinite(payload[field])
    ) ||
    (payload.freeSpaces !== null &&
      !Number.isFinite(payload.freeSpaces))
  ) {
    throw new Error(
      "Сандық өрістерге дұрыс мән енгізіңіз."
    );
  }

  validateParkings([
    {
      ...payload,
      id: existing?.id ?? "new-parking",
    },
  ]);

  return payload;
}
