
import ParkingForm from "./ParkingForm";
import ParkingsTable from "./ParkingsTable";

function ParkingsPanel({ admin }) {
  const {
    parkings,
    loading,
    saving,
    loadError,
    search,
    setSearch,
    visibleParkings,
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
  } = admin;

  const busy = loading || saving;
  const unavailable = busy || Boolean(loadError);
  const actionsDisabled = unavailable || formOpen;

  const emptyMessage = loading
    ? "Тұрақтар жүктелуде…"
    : loadError
      ? "Тұрақ деректері қолжетімсіз."
      : parkings.length === 0
        ? "Тұрақтар әзірге жоқ."
        : "Іздеу бойынша тұрақ табылмады.";

  return (
    <section
      aria-label="Тұрақтарды басқару"
      aria-busy={busy}
    >
      {loadError && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {loadError}
        </p>
      )}

      <fieldset
        disabled={unavailable}
        className="m-0 min-w-0 border-0 p-0"
      >
        <legend className="sr-only">
          Тұрақтар тізімі және өңдеу формасы
        </legend>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            aria-label="Тұрақ іздеу"
            placeholder="Атауы, ауданы немесе мекенжайы..."
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <button
            type="button"
            onClick={openCreateForm}
            disabled={actionsDisabled}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Тұрақ қосу
          </button>
        </div>

        {formOpen && (
          <ParkingForm
            form={form}
            isEditing={editingId !== null}
            error={formError}
            disabled={unavailable}
            onChange={changeField}
            onSubmit={submitParking}
            onCancel={closeForm}
          />
        )}

        <ParkingsTable
          parkings={visibleParkings}
          disabled={actionsDisabled}
          emptyMessage={emptyMessage}
          onEdit={openEditForm}
          onDelete={deleteParking}
        />
      </fieldset>

      {saving && (
        <p
          role="status"
          className="mt-4 text-sm text-violet-700"
        >
          Сұрау орындалуда, күтіңіз…
        </p>
      )}
    </section>
  );
}

export default ParkingsPanel;
