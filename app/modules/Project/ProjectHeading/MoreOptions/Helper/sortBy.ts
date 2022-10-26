import { CardType } from "@/app/types";

export function sortBy(
  field: string,
  cards: CardType[],
  order?: string
): CardType[] {
  if (field == "none" || !field) return cards;
  const vcards = cards.slice(0);
  if (field == "Deadline") {
    if (order == "asc") {
      vcards.sort(function (a, b) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else {
      vcards.sort(function (a, b) {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      });
    }
  }
  if (field == "Priority") {
    if (order == "asc") {
      vcards.sort(function (a, b) {
        return a.priority - b.priority;
      });
    } else {
      vcards.sort(function (a, b) {
        return b.priority - a.priority;
      });
    }
  }
  return vcards;
}
