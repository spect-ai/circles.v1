import { CardType } from "@/app/types";

export function titleFilter(cards: CardType[], inputTitle: string): CardType[] {
  if (!inputTitle) return cards;

  const filteredCards = Object.values(cards)?.filter((card) => {
    const { title } = card;
    if (inputTitle.length > 0) {
      const searchString = inputTitle.toLowerCase();
      const titleToSearch = title.toLowerCase();
      const titleSearch = titleToSearch.includes(searchString);
      if (titleSearch == true) {
        return card;
      } else {
        return false;
      }
    }
  });

  let ProjectCards = filteredCards.reduce(
    (rest, card) => [...rest, card],
    [{} as CardType]
  );

  ProjectCards = ProjectCards.filter((i) => i?.id !== undefined);

  return ProjectCards;
}