function DistrictStats({ stats, hasPartialData }) {
  return (
    <section aria-label="Аудан тұрақтарының көрсеткіштері">
      <dl
        className="mt-6 grid grid-cols-1 gap-4
          sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200
              bg-white p-5 shadow-sm
              dark:border-blue-700 dark:bg-blue-900"
          >
            <dt className="text-sm text-gray-500 dark:text-gray-300">
              {stat.label}
            </dt>

            <dd className="mt-2 text-2xl font-bold">
              {typeof stat.value === "number"
                ? stat.value.toLocaleString("kk-KZ")
                : stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {hasPartialData && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-300">
          Бос орын мен толу деңгейі тек санақ дерегі бар тұрақтар
          бойынша есептелді.
        </p>
      )}
    </section>
  );
}

export default DistrictStats;