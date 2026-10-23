
import { useRef, useState } from "react";
import { useParkings } from "../context/ParkingsContext";

import {
  emptyParkingForm,
  createParkingForm,
  buildParkingPayload,
} from "../utils/parkingFormUtils";

export function useAdminParkings() {
  const {
    parkings,
    loading,
    saving,
    loadError,
    addParking,
    editParking,
    removeParking,
  } = useParkings();

  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(
    createParkingForm()
  );
  const [formError, setFormError] = useState("");

  const pendingRef = useRef(false);

  const busy = loading || saving;

  const query = search
    .trim()
    .toLocaleLowerCase("kk-KZ");

  const visibleParkings = parkings.filter((parking) => {
    const searchableText = [
      parking.name,
      parking.district,
      parking.address,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("kk-KZ");

    return searchableText.includes(query);
  });

  function resetForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(createParkingForm());
    setFormError("");
  }

  function openCreateForm() {
    if (loadError || busy || pendingRef.current) {
      return;
    }

    setEditingId(null);
    setForm(createParkingForm());
    setFormError("");
    setNotice(null);
    setFormOpen(true);
  }

  function openEditForm(parking) {
    if (loadError || busy || pendingRef.current) {
      return;
    }

    setEditingId(parking.id);
    setForm(createParkingForm(parking));
    setFormError("");
    setNotice(null);
    setFormOpen(true);
  }

  function closeForm() {
    if (busy || pendingRef.current) {
      return;
    }

    resetForm();
  }

  function changeField(event) {
    if (busy || pendingRef.current) {
      return;
    }

    const { name, value, type, checked } =
      event.target;

    if (!Object.hasOwn(emptyParkingForm, name)) {
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
  }

  async function submitParking(event) {
    event.preventDefault();

    if (busy || pendingRef.current) {
      return;
    }

    if (loadError) {
      setFormError(
        "Деректерді оқу қатесі түзетілмейінше сақтау мүмкін емес."
      );
      return;
    }

    const isEditing = editingId !== null;

    const existing = isEditing
      ? parkings.find(
          (parking) => parking.id === editingId
        )
      : null;

    if (isEditing && !existing) {
      setFormError("Өңделетін тұрақ табылмады.");
      return;
    }

    pendingRef.current = true;
    setFormError("");
    setNotice(null);

    try {
      const payload = buildParkingPayload(
        form,
        existing
      );

      if (isEditing) {
        await editParking(editingId, payload);
      } else {
        await addParking(payload);
      }

      resetForm();

      setNotice({
        error: false,
        text: isEditing
          ? "Тұрақтың өзгерістері серверде сақталды."
          : "Жаңа тұрақ серверге қосылды.",
      });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Тұрақты сақтау мүмкін болмады."
      );
    } finally {
      pendingRef.current = false;
    }
  }

  async function deleteParking(parking) {
    if (
      loadError ||
      busy ||
      formOpen ||
      pendingRef.current
    ) {
      return;
    }

    const confirmed = window.confirm(
      `«${parking.name}» тұрағын жою керек пе?\n` +
      "Ол деректер қорынан, картадан және тізімдерден жойылады."
    );

    if (!confirmed) {
      return;
    }

    pendingRef.current = true;
    setNotice(null);

    try {
      await removeParking(parking.id);

      setNotice({
        error: false,
        text: `«${parking.name}» тұрағы жойылды.`,
      });
    } catch (error) {
      setNotice({
        error: true,
        text:
          error instanceof Error
            ? error.message
            : "Тұрақты жою мүмкін болмады.",
      });
    } finally {
      pendingRef.current = false;
    }
  }

  return {
    parkings,
    loading,
    saving,
    loadError,

    search,
    setSearch,
    visibleParkings,

    notice,
    clearNotice: () => setNotice(null),

    formOpen,
    editingId,
    form,
    formError,

    openCreateForm,
    openEditForm,
    closeForm,
    changeField,
    submitParking,
    deleteParking,
  };
}
