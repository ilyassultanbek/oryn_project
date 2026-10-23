
export const parkingSortOptions = [
  { value: "default", label: "Әдепкі реттілік" },
  { value: "rating", label: "Ең жоғары рейтинг" },
  { value: "reviews", label: "Ең көп пікір" },
  { value: "price", label: "Бағасы арзан" },
  { value: "spaces", label: "Бос орны көп" },
];

export function sortParkings(parkings, sortBy, ratings = {}) {
  const items = [...parkings];

  const getRating = (parking) =>
    ratings[String(parking.id)] ?? {
      averageRating: 0,
      reviewCount: 0,
    };

  switch (sortBy) {
    case "rating":
      return items.sort(
        (a, b) =>
          getRating(b).averageRating -
            getRating(a).averageRating ||
          getRating(b).reviewCount -
            getRating(a).reviewCount
      );

    case "reviews":
      return items.sort(
        (a, b) =>
          getRating(b).reviewCount -
          getRating(a).reviewCount
      );

    case "price":
      return items.sort(
        (a, b) =>
          (Number(a.price) || 0) -
          (Number(b.price) || 0)
      );

    case "spaces":
      return items.sort(
        (a, b) =>
          (b.freeSpaces == null ? -1 : Number(b.freeSpaces)) -
          (a.freeSpaces == null ? -1 : Number(a.freeSpaces))
      );

    default:
      return items;
  }
}
