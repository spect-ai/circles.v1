import { ConditionGroup, Property } from "@/app/types";
import { satisfiesCondition, satisfiesConditions } from "./SatisfiesFilter";

export function satisfiesAdvancedConditions(
  data: any,
  properties: { [propertyId: string]: Property },
  rootConditionGroup: ConditionGroup
): boolean {
  const { id, operator, conditions, conditionGroups, order } =
    rootConditionGroup;
  if (!order || order.length === 0) return true;
  if (operator === "and") {
    return order.every((oid: string) => {
      const condition = conditions[oid];
      if (condition) {
        const { field, comparator, value } = condition.data;
        const propertyId = field?.value;
        const comparatorValue = comparator?.value;
        const property = properties[propertyId];
        if (!property) return true;
        if (!data) return false;
        return satisfiesCondition(
          data,
          property,
          propertyId,
          value,
          comparatorValue
        );
      } else {
        const conditionGroup = conditionGroups?.[oid];
        if (conditionGroup) {
          return satisfiesAdvancedConditions(data, properties, conditionGroup);
        } else {
          return false;
        }
      }
    });
  } else if (operator === "or") {
    return order.some((oid: string) => {
      const condition = conditions[oid];
      if (condition) {
        const { field, comparator, value } = condition.data;
        const propertyId = field?.value;
        const comparatorValue = comparator?.value;
        const property = properties[propertyId];
        if (!property) return true;
        if (!data) return false;
        return satisfiesCondition(
          data,
          property,
          propertyId,
          value,
          comparatorValue
        );
      } else {
        const conditionGroup = conditionGroups?.[oid];
        if (conditionGroup) {
          return satisfiesAdvancedConditions(data, properties, conditionGroup);
        } else {
          return false;
        }
      }
    });
  }
  return true;
}
