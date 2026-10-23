import { districts } from "../../../data/demoParkings";

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white " +
  "px-3 py-2.5 text-sm outline-none " +
  "focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

function FormField({ label, id, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input {...props} id={id} className={fieldClass} />
    </div>
  );
}

function ParkingForm({
  form,
  isEditing,
  error,
  disabled,
  onChange,
  onSubmit,
  onCancel,
}) {
  function fieldProps(name) {
    return {
      id: `parking-${name}`,
      name,
      value: form[name],
      onChange,
    };
  }

  return (
    <section
      aria-labelledby="parking-form-title"
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <h2 id="parking-form-title" className="text-xl font-semibold">
        {isEditing ? "Тұрақты өңдеу" : "Жаңа тұрақ"}
      </h2>

      <form onSubmit={onSubmit} className="mt-5">
        <fieldset disabled={disabled}>
          <legend className="sr-only">Тұрақ туралы мәліметтер</legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              {...fieldProps("name")}
              label="Тұрақ атауы"
              type="text"
              required
              maxLength={120}
              autoFocus
              placeholder="Мысалы: Орталық тұрақ"
            />

            <div>
              <label
                htmlFor="parking-district"
                className="block text-sm font-medium text-slate-700"
              >
                Аудан
              </label>

              <select
                {...fieldProps("district")}
                required
                className={fieldClass}
              >
                <option value="">Ауданды таңдаңыз</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <FormField
                {...fieldProps("address")}
                label="Мекенжай"
                type="text"
                required
                maxLength={250}
                placeholder="Көше және ғимарат нөмірі"
              />
            </div>

            <FormField
              {...fieldProps("capacity")}
              label="Жалпы орын саны"
              type="number"
              min="1"
              step="1"
              required
            />

            <div>
              <FormField
                {...fieldProps("freeSpaces")}
                label="Бос орын саны"
                type="number"
                min="0"
                max={form.capacity || undefined}
                step="1"
                aria-describedby="free-spaces-hint"
              />
              <p
                id="free-spaces-hint"
                className="mt-2 text-xs text-slate-500"
              >
                Белгісіз болса, бос қалдырыңыз.
              </p>
            </div>

            <FormField
              {...fieldProps("price")}
              label="Баға — ₸ / сағ"
              type="number"
              min="0"
              step="any"
              required
              placeholder="Тегін болса — 0"
            />

            <label className="flex items-center gap-3 self-center text-sm font-medium">
              <input
                type="checkbox"
                name="isCovered"
                checked={form.isCovered}
                onChange={onChange}
                className="h-5 w-5 accent-violet-600"
              />
              Жабық тұрақ
            </label>

            <FormField
              {...fieldProps("lat")}
              label="Ендік — latitude"
              type="number"
              min="-90"
              max="90"
              step="any"
              required
              placeholder="43.2389"
            />

            <FormField
              {...fieldProps("lng")}
              label="Бойлық — longitude"
              type="number"
              min="-180"
              max="180"
              step="any"
              required
              placeholder="76.8897"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 rounded-xl bg-violet-600 px-5 py-3
              text-sm font-semibold text-white hover:bg-violet-700
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEditing ? "Өзгерістерді сақтау" : "Тұрақты қосу"}
          </button>
        </fieldset>

        <button
          type="button"
          onClick={onCancel}
          className="mt-3 rounded-xl border border-slate-300
            px-5 py-3 text-sm hover:bg-slate-50"
        >
          Болдырмау
        </button>
      </form>
    </section>
  );
}

export default ParkingForm;