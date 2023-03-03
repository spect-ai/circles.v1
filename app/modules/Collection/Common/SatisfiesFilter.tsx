/* eslint-disable @typescript-eslint/no-explicit-any */
import { Condition, Property } from "@/app/types";

export function satisfiesConditions(
  data: any,
  properties: { [propertyId: string]: Property },
  conditions: Condition[]
): boolean {
  return conditions.every((condition) => {
    const { field, comparator, value } = condition.data;
    const propertyId = field?.value;
    const comparatorValue = comparator?.value;
    const property = properties[propertyId];
    console.log({ property, propertyId });
    if (!property) return false;
    switch (property.type) {
      case "shortText":
      case "longText":
      case "email":
      case "singleURL":
        switch (comparatorValue) {
          case "is":
            return data[propertyId] === value;
          case "is not":
            return data[propertyId] !== value;
          case "contains":
            return data[propertyId]?.includes(value);
          case "does not contain":
            return !data[propertyId]?.includes(value);
          case "starts with":
            return data[propertyId]?.startsWith(value);
          case "ends with":
            return data[propertyId]?.endsWith(value);
          default:
            return false;
        }
      case "ethAddress":
        switch (comparatorValue) {
          case "is":
            return data[propertyId]?.toLowerCase() === value?.toLowerCase();
          case "is not":
            return data[propertyId]?.toLowerCase() !== value?.toLowerCase();
          default:
            return false;
        }

      case "number":
        switch (comparatorValue) {
          case "is":
            return parseFloat(data[propertyId]) === parseFloat(value);
          case "is not":
            return parseFloat(data[propertyId]) !== parseFloat(value);
          case "is greater than":
            return parseFloat(data[propertyId]) > parseFloat(value);
          case "is less than":
            return parseFloat(data[propertyId]) < parseFloat(value);
          default:
            return false;
        }
      case "singleSelect":
      case "user":
        switch (comparatorValue) {
          case "is":
            return data[propertyId]?.value === value?.value;
          case "is not":
            return data[propertyId]?.value !== value?.value;
          case "is one of":
            // eslint-disable-next-line no-case-declarations
            const values = value?.map((v: any) => v.value);
            return values.includes(data[propertyId]?.value);
          default:
            return false;
        }
      case "multiSelect":
      case "multiURL":
      case "user[]":
        // eslint-disable-next-line no-case-declarations
        const values = data[propertyId]?.map((d: { value: any }) => d?.value);
        switch (comparatorValue) {
          case "does not include":
            return (
              !value ||
              !value?.some((v: { value: any }) => values?.includes(v.value))
            );
          case "includes one of":
            // eslint-disable-next-line no-case-declarations

            return (
              value &&
              value?.some((v: { value: any }) => values?.includes(v.value))
            );
          case "includes all of":
            return (
              value &&
              value.every((v: { value: any }) => values?.includes(v?.value))
            );
          default:
            return false;
        }
      case "date":
        switch (comparatorValue) {
          case "is":
            return (
              new Date(data[propertyId]).getTime() === new Date(value).getTime()
            );
          case "is not":
            return (
              new Date(data[propertyId]).getTime() !== new Date(value).getTime()
            );
          case "is before":
            return (
              data[propertyId] &&
              value &&
              new Date(data[propertyId]) < new Date(value)
            );
          case "is after":
            return (
              data[propertyId] &&
              value &&
              new Date(data[propertyId]) > new Date(value)
            );
          default:
            return false;
        }
      case "reward":
        switch (comparatorValue) {
          case "value is":
            return parseFloat(data[propertyId]?.value) === parseFloat(value);
          case "value is greater than":
            return parseFloat(data[propertyId]?.value) > parseFloat(value);
          case "value is less than":
            return parseFloat(data[propertyId]?.value) < parseFloat(value);
          case "token is":
            if (!value || typeof value !== "object") return false;
            // eslint-disable-next-line no-case-declarations
            const v = value?.value.split(":");
            if (!v || v.length !== 2) return false;
            return (
              data[propertyId]?.chain?.value === v[0] &&
              data[propertyId]?.token?.value === v[1]
            );
          case "token is one of":
            if (!value || !Array.isArray(value)) return false;
            // eslint-disable-next-line no-case-declarations
            const tokens = value.map((v: any) => v?.value.split(":"));
            if (!tokens || tokens.length === 0) return false;
            return tokens.some(
              (t: any) =>
                data[propertyId]?.chain?.value === t[0] &&
                data[propertyId]?.token?.value === t[1]
            );

          default:
            return false;
        }
      case "milestone":
        switch (comparatorValue) {
          case "count is greater than":
            return data[propertyId]?.length > value;
          case "count is less than":
            return data[propertyId]?.length < value;
          default:
            return false;
        }
      case "payWall":
        switch (comparatorValue) {
          case "is paid":
            if (!data[propertyId]) return false;
            if (data[propertyId].paid) {
              return true;
            }
            return false;
          case "is unpaid":
            if (!data[propertyId]) return true;
            if (data[propertyId].paid) {
              return false;
            }
            return true;
        }
      case "cardStatus":
        switch (comparatorValue) {
          case "is active":
            return data[propertyId] !== "closed";
          case "is closed":
            return data[propertyId] === "closed";
          default:
            return false;
        }
      default:
        return false;
    }
  });
}

export const isMyCard = (
  data: any,
  properties: { [propertyId: string]: Property },
  currentUser: string
): boolean => {
  const userProperties = Object.keys(properties).filter((propertyId) => {
    const property = properties[propertyId];
    return property.type === "user" || property.type === "user[]";
  });

  return userProperties.some((propertyId) => {
    const property = properties[propertyId];
    if (property.type === "user") {
      return data[propertyId]?.value === currentUser;
    } else if (property.type === "user[]") {
      return data[propertyId]?.some((user: any) => user.value === currentUser);
    }
    return false;
  });
};

export const paymentStatus = (filter: string, id: string, status: any) => {
  if (filter === "Paid") {
    return status?.[id] === "completed";
  } else if (filter === "Pending") {
    return status?.[id] === "pending";
  } else if (filter === "Pending Signature") {
    return status?.[id] === "pendingSignature";
  }
  return true;
};
