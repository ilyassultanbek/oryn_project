import { useState } from "react";

export function useDistrictParkings({
  parkings,
  selectedDistrict,
  validDistrict,
  favorites,
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("cheap");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const districtParkings = parkings.filter(
    (parking) =>
      validDistrict &&
      (!selectedDistrict || parking.district === selectedDistrict)
  );

  const knownParkings = districtParkings.filter(
    (parking) => parking.freeSpaces != null
  );

  const totalCapacity = districtParkings.reduce(
    (sum, parking) => sum + parking.capacity,
    0
  );

  const knownCapacity = knownParkings.reduce(
    (sum, parking) => sum + parking.capacity,
    0
  );

  const totalFree = knownParkings.reduce(
    (sum, parking) => sum + parking.freeSpaces,
    0
  );

  const occupancy =
    knownCapacity > 0
      ? Math.round((1 - totalFree / knownCapacity) * 100)
      : null;

  const query = search.trim().toLocaleLowerCase("kk-KZ");

  const visibleParkings = districtParkings
    .filter((parking) => {
      const text =
        `${parking.name} ${parking.address} ${parking.district}`
          .toLocaleLowerCase("kk-KZ");

      return (
        text.includes(query) &&
        (!onlyAvailable || parking.freeSpaces > 0) &&
        (!onlyFavorites || favorites.includes(parking.id))
      );
    })
    .sort((a, b) => {
      if (sort === "free") {
        return (b.freeSpaces ?? -1) - (a.freeSpaces ?? -1);
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name, "kk");
      }

      return a.price - b.price;
    });

  const stats = [
    {
      label: "Тұрақ саны",
      value: districtParkings.length,
    },
    {
      label: "Бос орын",
      value: knownParkings.length > 0 ? totalFree : "Ақпарат жоқ",
    },
    {
      label: "Барлық орын",
      value: totalCapacity,
    },
    {
      label: "Толу деңгейі",
      value: occupancy !== null ? `${occupancy}%` : "Ақпарат жоқ",
    },
  ];

  function resetFilters() {
    setSearch("");
    setSort("cheap");
    setOnlyAvailable(false);
    setOnlyFavorites(false);
  }

  return {
    search,
    setSearch,
    sort,
    setSort,
    onlyAvailable,
    setOnlyAvailable,
    onlyFavorites,
    setOnlyFavorites,
    visibleParkings,
    stats,
    hasPartialData: knownParkings.length < districtParkings.length,
    resetFilters,
  };
}   