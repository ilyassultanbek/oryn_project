const fieldClass =
  "w-full min-w-0 rounded-xl border border-gray-300 bg-white " +
  "px-4 py-3 text-sm outline-none " +
  "focus:border-violet-500 focus:ring-2 focus:ring-violet-100 " +
  "dark:border-blue-700 dark:bg-blue-900 dark:text-white " +
  "dark:focus:ring-violet-800";

function DistrictFilters({
  filters,
  districtId,
  districtNames,
  onDistrictChange,
  onReset,
}) {
  const {
    search,
    setSearch,
    sort,
    setSort,
    onlyAvailable,
    setOnlyAvailable,
    onlyFavorites,
    setOnlyFavorites,
  } = filters;

  return (
    <section
      aria-label="Тұрақтарды іздеу және сүзгілеу"
      className="mt-6 rounded-2xl border border-gray-200
        bg-white p-5 shadow-sm
        dark:border-blue-700 dark:bg-blue-900"
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Атауы немесе мекенжайы бойынша іздеу..."
          aria-label="Тұрақ іздеу"
          className={fieldClass}
        />

        <select
          value={districtId}
          onChange={(event) => onDistrictChange(event.target.value)}
          aria-label="Аудан таңдау"
          className={fieldClass}
        >
          <option value="">Барлық аудан</option>

          {Object.entries(districtNames).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Сұрыптау"
          className={fieldClass}
        >
          <option value="cheap">Арзаннан қымбатқа</option>
          <option value="free">Бос орны көп</option>
          <option value="name">Атауы бойынша</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(event) => setOnlyAvailable(event.target.checked)}
            className="h-4 w-4 accent-violet-600"
          />
          Тек бос орны барлар
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(event) => setOnlyFavorites(event.target.checked)}
            className="h-4 w-4 accent-violet-600"
          />
          Таңдаулылар
        </label>

        <button
          type="button"
          onClick={onReset}
          className="text-violet-600 hover:underline
            dark:text-violet-300"
        >
          Сүзгілерді тазалау
        </button>
      </div>
    </section>
  );
}

export default DistrictFilters;