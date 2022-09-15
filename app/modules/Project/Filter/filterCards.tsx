import { CardsType, CardType, FilterType, ProjectType } from "@/app/types";
import { diff as arrayDiff, same as arraySame } from "fast-array-diff";
import moment from "moment";

export const filterCards = (
  project: ProjectType,
  cards: CardsType | CardType[],
  currentFilter: FilterType
): any => {
  if (!currentFilter || !project.cards) return cards as CardsType;
  const filteredCards = Object.values(cards)?.filter((card) => {
    if (card === undefined) return false;
    const { properties } = card;

    let passedFilters = true;
    if (currentFilter.properties)
      passedFilters = currentFilter.properties.every((filterProperty) => {
        const propType = project.properties[filterProperty.id.value].type;
        const propValue = properties[filterProperty.id.value];
        const filterValue = filterProperty.value;
        const filterCondition = filterProperty.condition;

        switch (propType) {
          case "user[]":
            switch (filterCondition.value) {
              case "isExactly":
                return (
                  Array.isArray(propValue) && arraySame(propValue, filterValue)
                );

              case "hasAnyOf":
                // eslint-disable-next-line no-case-declarations
                const filterSet = new Set(filterValue);
                for (const user of propValue) {
                  if (filterSet.has(user)) return true;
                }
                return false;
              case "hasAllOf":
                return (
                  Array.isArray(propValue) &&
                  arrayDiff(propValue, filterValue).added.length > 0
                );
            }
            break;
          case "shortText":
          case "longText":
            switch (filterCondition.value) {
              case "is":
                return propValue === filterValue;
            }
            break;
          case "ethAddress":
            switch (filterCondition.value) {
              case "is":
                return propValue === filterValue;
            }
            break;
          case "number":
            switch (filterCondition.value) {
              case "is":
                return propValue === filterValue;
            }
            break;
          case "date":
            switch (filterCondition.value) {
              case "is":
                return (
                  propValue && moment(propValue).isSame(filterValue, "date")
                );
              case "isAfter":
                return (
                  propValue && moment(propValue).isAfter(filterValue, "date")
                );
              case "isBefore":
                return (
                  propValue && moment(propValue).isBefore(filterValue, "date")
                );
            }
            break;
          case "singleSelect":
            switch (filterCondition.value) {
              case "is":
                return propValue?.value === filterValue?.value;
              case "isOneOf":
                return filterValue?.value?.includes(propValue?.value);
            }
            break;
          case "multiSelect":
            // eslint-disable-next-line no-case-declarations
            const filterValues = filterValue?.map((a: any) => a.value);
            // eslint-disable-next-line no-case-declarations
            const propValues = propValue
              ? propValue?.map((a: any) => a.value)
              : [];

            switch (filterCondition.value) {
              case "isExactly":
                return (
                  Array.isArray(propValues) &&
                  arraySame(propValues, filterValues)
                );

              case "hasAnyOf":
                // eslint-disable-next-line no-case-declarations
                const filterSet = new Set(filterValues);
                for (const user of propValues) {
                  if (filterSet.has(user)) return true;
                }
                return false;
              case "hasAllOf":
                return (
                  Array.isArray(propValues) &&
                  arrayDiff(propValues, filterValues).added.length > 0
                );
            }
            break;
          default:
            return true;
        }

        return true;
      });
    return passedFilters;
  });

  const projectCards = filteredCards.reduce(
    (rest, card) => ({ ...rest, [card.id]: card }),
    {}
  );

  return projectCards;
};
