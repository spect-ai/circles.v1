import { CardsType, CardType, FilterType, ProjectType } from "@/app/types";

export const filterCards = (
  project: ProjectType,
  cards: CardsType | CardType[],
  currentFilter: FilterType
): any => {
  if (!currentFilter || !project.cards) return cards as CardsType;
  const filteredCards = Object.values(cards)?.filter((card) => {
    if (card === undefined) return false;
    // let reviewerFiltSat = false;
    // let assigneeFiltSat = false;
    // let labelsFiltSat = false;
    // let titleFiltSat = false;
    // let typeFiltSat = false;
    // let priorityFiltSat = false;
    // let columnFiltSat = false;

    const { assignee, reviewer, labels, title, type, priority, id } = card;

    //   if (currentFilter?.reviewer?.length > 0) {
    //     for (let i = 0; i < reviewer.length; i += 1) {
    //       const filterRTruth = currentFilter.reviewer.includes(reviewer[i]);
    //       if (filterRTruth) {
    //         reviewerFiltSat = true;
    //         break;
    //       }
    //     }
    //   } else {
    //     reviewerFiltSat = true;
    //   }

    //   if (currentFilter?.assignee?.length > 0) {
    //     for (let i = 0; i < assignee.length; i += 1) {
    //       const filterATruth = currentFilter.assignee.includes(assignee[i]);
    //       if (filterATruth) {
    //         assigneeFiltSat = true;
    //         break;
    //       }
    //     }
    //   } else {
    //     assigneeFiltSat = true;
    //   }

    //   if (currentFilter?.label?.length > 0) {
    //     for (let i = 0; i < labels.length; i += 1) {
    //       const filterLTruth = currentFilter.label.includes(labels[i]);
    //       if (filterLTruth) {
    //         labelsFiltSat = true;
    //         break;
    //       }
    //     }
    //   } else {
    //     labelsFiltSat = true;
    //   }

    //   if (currentFilter?.type?.length > 0) {
    //     const filterLTruth = currentFilter.type.includes(type);
    //     if (filterLTruth) {
    //       typeFiltSat = true;
    //     }
    //   } else {
    //     typeFiltSat = true;
    //   }

    //   if (currentFilter?.column?.length > 0) {
    //     Object.keys(project.columnDetails).forEach((key) => {
    //       const columnName = project.columnDetails?.[key]?.name;
    //       const filterLTruth =
    //         project.columnDetails?.[key]?.cards?.includes(id) &&
    //         currentFilter?.column?.includes(columnName);
    //       if (filterLTruth) {
    //         columnFiltSat = true;
    //       }
    //     });
    //   } else {
    //     columnFiltSat = true;
    //   }

    //   if (currentFilter?.priority?.length > 0) {
    //     const filterLTruth = currentFilter.priority.includes(priority.toString());
    //     if (filterLTruth) {
    //       priorityFiltSat = true;
    //     }
    //   } else {
    //     priorityFiltSat = true;
    //   }

    //   if (currentFilter?.title?.length > 0) {
    //     const searchString = currentFilter.title.toLowerCase();
    //     const titleToSearch = title.toLowerCase();
    //     const titleSearch = titleToSearch.includes(searchString);
    //     if (titleSearch === true) {
    //       titleFiltSat = true;
    //     }
    //   } else {
    //     titleFiltSat = true;
    //   }

    //   if (
    //     reviewerFiltSat &&
    //     assigneeFiltSat &&
    //     labelsFiltSat &&
    //     typeFiltSat &&
    //     priorityFiltSat &&
    //     columnFiltSat &&
    //     titleFiltSat
    //   ) {
    //     return card;
    //   }
    //   return false;
    // });

    // const ProjectCards = filteredCards.reduce(
    //   (rest, card) => ({ ...rest, [card.id]: card }),
    //   {}
    // );

    //return null;
  });
};
