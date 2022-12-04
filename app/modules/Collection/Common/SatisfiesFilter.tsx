import { CollectionType, Condition, Option } from "@/app/types";

export function satisfiesConditions(
  collection: CollectionType,
  conditions: Condition[]
) {
  return conditions.every((condition) => {
    const { propertyId, comparatorValue, value } = condition.data;
    const property = collection.properties[propertyId];
    const data = collection.data[propertyId];
    switch (property.type) {
      case "shortText":
      case "longText":
      case "ethAddress":
      case "email":
        switch (comparatorValue) {
          case "is":
            return data === value;
          case "is not":
            return data !== value;
          case "contains":
            return data.includes(value);
          case "does not contain":
            return !data.includes(value);
          case "starts with":
            return data.startsWith(value);
          case "ends with":
            return data.endsWith(value);
          default:
            return false;
        }
      case "number":
        switch (comparatorValue) {
          case "is":
            return data === value;
          case "is not":
            return data !== value;
          case "is greater than":
            return data > value;
          case "is less than":
            return data < value;
          default:
            return false;
        }
      case "singleSelect":
        switch (comparatorValue) {
          case "is":
            return data.value === value.value;
          default:
            return false;
        }
      case "multiSelect":
        switch (comparatorValue) {
          case "includes one of":
            // eslint-disable-next-line no-case-declarations
            const values = data.map((d: { value: any }) => d.value);
            return value.some((v: { value: any }) => values.includes(v.value));
          case "includes all of":
            // eslint-disable-next-line no-case-declarations
            const values2 = data.map((d: { value: any }) => d.value);
            return value.every((v: { value: any }) =>
              values2.includes(v.value)
            );
          default:
            return false;
        }
      case "date":
        switch (comparatorValue) {
          case "is":
            return data === value;
          case "is not":
            return data !== value;
          case "is before":
            return new Date(data) < new Date(value);
          case "is after":
            return new Date(data) > new Date(value);
          default:
            return false;
        }
      case "reward":
        switch (comparatorValue) {
          case "is":
            return false;
          default:
            return false;
        }
    }
  });
}
