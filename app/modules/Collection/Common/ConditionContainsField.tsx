import { CollectionType, ConditionGroup } from "@/app/types";

export function formConditionContainsFieldThatDoesntExistInForm(
  collection: CollectionType,
  propertiesBeforeCurrentProperty: string[],
  advancedConditions?: ConditionGroup
): {
  contains: boolean;
  reason: string;
} {
  if (advancedConditions && advancedConditions.order?.length > 0) {
    const conditions = advancedConditions.conditions;
    const conditionGroups = advancedConditions.conditionGroups;
    for (const oid of advancedConditions.order) {
      if (conditions?.[oid]) {
        const condition = conditions[oid];
        if (
          condition.data?.field &&
          !collection.properties[condition.data?.field?.value]
        ) {
          return {
            contains: true,
            reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but doesn't exist on the form`,
          };
        } else if (
          condition.data?.field &&
          !collection.properties[condition.data?.field?.value]?.isPartOfFormView
        ) {
          return {
            contains: true,
            reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but is an internal field`,
          };
        } else if (
          condition.data?.field &&
          !propertiesBeforeCurrentProperty.includes(
            condition.data?.field?.value
          )
        ) {
          return {
            contains: true,
            reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but is after this field`,
          };
        }
      } else if (conditionGroups?.[oid]) {
        const conditionGroup = conditionGroups[oid];
        for (const cid of conditionGroup.order) {
          const condition = conditions?.[cid];
          if (!condition) continue;
          if (
            condition.data?.field &&
            !collection.properties[condition.data?.field?.value]
          ) {
            return {
              contains: true,
              reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but doesn't exist on the form`,
            };
          } else if (
            condition.data?.field &&
            !collection.properties[condition.data?.field?.value]
              ?.isPartOfFormView
          ) {
            return {
              contains: true,
              reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but is an internal field`,
            };
          } else if (
            condition.data?.field &&
            !propertiesBeforeCurrentProperty.includes(
              condition.data?.field?.value
            )
          ) {
            return {
              contains: true,
              reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but is after this field`,
            };
          }
        }
      }
    }
    return {
      contains: false,
      reason: "",
    };
  } else {
    return {
      contains: false,
      reason: "",
    };
  }
}
