export function calculateParkingStats(parkings) {
  const knownParkings = parkings.filter(
    (parking) => parking.freeSpaces != null
  );

  const { freeSpaces, capacity } = knownParkings.reduce(
    (totals, parking) => ({
      freeSpaces: totals.freeSpaces + parking.freeSpaces,
      capacity: totals.capacity + parking.capacity,
    }),
    { freeSpaces: 0, capacity: 0 }
  );

  return {
    total: parkings.length,
    knownCount: knownParkings.length,
    unknownCount: parkings.length - knownParkings.length,
    freeSpaces: knownParkings.length > 0 ? freeSpaces : null,
    occupancy:
      capacity > 0
        ? Math.round((1 - freeSpaces / capacity) * 100)
        : null,
  };
}