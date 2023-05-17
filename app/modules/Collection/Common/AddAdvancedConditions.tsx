import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  CollectionType,
  Condition as ConditionType,
  ConditionGroup,
} from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Button, IconPlusSmall, Stack, Text, useTheme } from "degen";
import { getComparators } from "./Comparator";
import FilterValueField from "./FilterValueField";
import { toast } from "react-toastify";
import { getPropertyIcon } from "../../CollectionProject/EditProperty/Utils";
import styled from "styled-components";
import uuid from "react-uuid";

function Condition({
  collection,
  condition,
  message,
  onDelete,
  onFieldChange,
  onComparatorChange,
  onValueChange,
  fieldOptions,
  dropDownPortal,
  operator,
  onOperatorChange,
}: {
  collection: CollectionType;
  condition: ConditionType;
  message?: string;
  onDelete: () => void;
  onFieldChange: (field: OptionType) => void;
  onComparatorChange: (comparator: OptionType) => void;
  onValueChange: (value: any) => void;
  fieldOptions: any[];
  dropDownPortal: boolean;
  operator: "and" | "or";
  onOperatorChange: (operator: "and" | "or") => void;
}) {
  return (
    <Box marginBottom="2" width="full">
      <Stack direction="horizontal" align="flex-start" space="1">
        <Box
          width={{
            xs: "full",
            md: message ? "32" : "0",
          }}
          marginTop={{
            xs: "2",
            md: "0",
          }}
        >
          <Stack direction="horizontal" align="center" space="1">
            {message && ["and", "or"].includes(message) ? (
              <Dropdown
                options={[
                  {
                    label: "and",
                    value: "and",
                  },
                  {
                    label: "or",
                    value: "or",
                  },
                ]}
                selected={{
                  label: operator,
                  value: operator,
                }}
                onChange={(option) => {
                  onOperatorChange(option.value as "and" | "or");
                }}
                multiple={false}
                isClearable={false}
                portal={dropDownPortal}
              />
            ) : (
              <Box paddingTop="4">
                <Text size="base">{message}</Text>
              </Box>
            )}
          </Stack>
        </Box>
        <Box
          width="full"
          display="flex"
          flexDirection={{
            xs: "column",
            md: "row",
          }}
          gap="1"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
          >
            <Dropdown
              options={fieldOptions}
              selected={condition?.data?.field || {}}
              onChange={(option) => {
                onFieldChange(option);
              }}
              multiple={false}
              isClearable={false}
              portal={dropDownPortal}
            />
          </Box>
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
          >
            <Dropdown
              options={getComparators(
                collection.properties[condition?.data?.field?.value]?.type
              )}
              selected={condition?.data?.comparator || {}}
              onChange={(option) => onComparatorChange(option)}
              multiple={false}
              isClearable={false}
              portal={dropDownPortal}
            />
          </Box>
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
          >
            <FilterValueField
              value={condition?.data?.value}
              onChange={(value) => onValueChange(value)}
              collection={collection}
              propertyId={condition?.data?.field?.value}
              comparatorValue={condition?.data?.comparator?.value}
              dropDownPortal={dropDownPortal}
            />
          </Box>
        </Box>
        <Button
          shape="circle"
          size="small"
          variant="transparent"
          onClick={onDelete}
        >
          <DeleteOutlined style={{ fontSize: "1.2rem" }} />
        </Button>
      </Stack>
    </Box>
  );
}

type Props = {
  rootConditionGroup: ConditionGroup;
  setRootConditionGroup: (rootConditionGroup: ConditionGroup) => void;
  buttonText: string;
  groupButtonText: string;
  firstRowMessage?: string;
  collection: CollectionType;
  dropDownPortal: boolean;
  buttonWidth?: string;
  validConditionFields?: string[];
};

export default function AddAdvancedConditions({
  rootConditionGroup,
  setRootConditionGroup,
  firstRowMessage,
  buttonText,
  groupButtonText,
  collection,
  buttonWidth,
  dropDownPortal,
  validConditionFields,
}: Props) {
  const { mode } = useTheme();
  const fieldOptions = Object.entries(collection.properties || {})
    .filter(
      (field) =>
        !["multiURL", "github", "discord", "telegram", "readonly"].includes(
          field[1].type
        )
    )
    .filter(
      (field) =>
        !validConditionFields || validConditionFields.includes(field[0])
    )
    .map((field) => ({
      label: collection.properties[field[0]].name,
      value: field[0],
      icon: getPropertyIcon(collection.properties[field[0]].type),
    }));

  return (
    <Box display="flex" flexDirection="column" gap="1">
      {rootConditionGroup &&
        rootConditionGroup.order?.map((oid, index) => {
          if (rootConditionGroup.conditions?.[oid]) {
            const condition = rootConditionGroup.conditions[oid];
            return (
              <Condition
                collection={collection}
                condition={condition}
                message={
                  index === 0 ? firstRowMessage : rootConditionGroup.operator
                }
                onDelete={() => {
                  const newConditions = [...rootConditionGroup.order];
                  newConditions.splice(index, 1);
                  delete rootConditionGroup.conditions[oid];
                  setRootConditionGroup({
                    ...rootConditionGroup,
                    order: newConditions,
                    conditions: rootConditionGroup.conditions,
                  });
                }}
                onFieldChange={(field: OptionType) => {
                  condition.data.field = {
                    label: field.label,
                    value: field.value,
                  };
                  const comparator = getComparators(
                    collection.properties[field.value]?.type
                  )[0];
                  condition.data.comparator = {
                    label: comparator.label,
                    value: comparator.value,
                  };
                  condition.data.value = "";

                  setRootConditionGroup({
                    ...rootConditionGroup,
                    conditions: {
                      ...rootConditionGroup.conditions,
                      [oid]: condition,
                    },
                  });
                }}
                onComparatorChange={(comparator: OptionType) => {
                  condition.data.comparator = comparator;
                  setRootConditionGroup({
                    ...rootConditionGroup,
                    conditions: {
                      ...rootConditionGroup.conditions,
                      [oid]: condition,
                    },
                  });
                }}
                onValueChange={(value: any) => {
                  condition.data.value = value;
                  setRootConditionGroup({
                    ...rootConditionGroup,
                    conditions: {
                      ...rootConditionGroup.conditions,
                      [oid]: condition,
                    },
                  });
                }}
                dropDownPortal={dropDownPortal}
                fieldOptions={fieldOptions}
                operator={rootConditionGroup.operator}
                onOperatorChange={(operator: "and" | "or") => {
                  rootConditionGroup.operator = operator;
                  setRootConditionGroup({
                    ...rootConditionGroup,
                    operator: operator,
                  });
                }}
              />
            );
          } else if (rootConditionGroup.conditionGroups?.[oid]) {
            const conditionGroup = rootConditionGroup.conditionGroups[oid];

            return (
              <Stack direction="horizontal" align="flex-start" space="1">
                <Box
                  width={{
                    xs: "full",
                    md: "32",
                  }}
                  marginTop={{
                    xs: "2",
                    md: "0",
                  }}
                >
                  <Stack direction="horizontal" align="flex-start" space="1">
                    {index === 0 ? (
                      <Text>When</Text>
                    ) : (
                      <Dropdown
                        options={[
                          {
                            label: "and",
                            value: "and",
                          },
                          {
                            label: "or",
                            value: "or",
                          },
                        ]}
                        selected={{
                          label: rootConditionGroup.operator,
                          value: rootConditionGroup.operator,
                        }}
                        onChange={(option) => {
                          rootConditionGroup.operator = option.value as
                            | "and"
                            | "or";
                          setRootConditionGroup({
                            ...rootConditionGroup,
                            operator: option.value as "and" | "or",
                          });
                        }}
                        multiple={false}
                        isClearable={false}
                        portal={dropDownPortal}
                      />
                    )}
                  </Stack>
                </Box>
                <ConditionGroupCard
                  mode={mode}
                  backgroundColor="foregroundTertiary"
                >
                  {conditionGroup.order?.map((cgoid, index) => {
                    if (conditionGroup.conditions[cgoid]) {
                      const condition = conditionGroup.conditions[cgoid];
                      return (
                        <Condition
                          collection={collection}
                          condition={condition}
                          message={index === 0 ? "" : conditionGroup.operator}
                          onDelete={() => {
                            const newConditions = [...conditionGroup.order];
                            newConditions.splice(index, 1);
                            conditionGroup.order = newConditions;
                            delete conditionGroup.conditions[cgoid];
                            if (conditionGroup.order.length === 0) {
                              delete rootConditionGroup.conditionGroups?.[oid];
                              setRootConditionGroup({
                                ...rootConditionGroup,
                                conditionGroups:
                                  rootConditionGroup.conditionGroups,
                                order: rootConditionGroup.order.filter(
                                  (o) => o !== oid
                                ),
                              });
                            } else
                              setRootConditionGroup({
                                ...rootConditionGroup,
                                conditionGroups: {
                                  ...rootConditionGroup.conditionGroups,
                                  [cgoid]: conditionGroup,
                                },
                              });
                          }}
                          onFieldChange={(field: OptionType) => {
                            conditionGroup.conditions[cgoid].data.field = {
                              label: field.label,
                              value: field.value,
                            };
                            const comparator = getComparators(
                              collection.properties[field.value]?.type
                            )[0];
                            condition.data.comparator = {
                              label: comparator.label,
                              value: comparator.value,
                            };
                            condition.data.value = "";

                            setRootConditionGroup({
                              ...rootConditionGroup,
                              conditionGroups: {
                                ...rootConditionGroup.conditionGroups,
                                [cgoid]: conditionGroup,
                              },
                            });
                          }}
                          onComparatorChange={(comparator: OptionType) => {
                            conditionGroup.conditions[cgoid].data.comparator =
                              comparator;
                            setRootConditionGroup({
                              ...rootConditionGroup,
                              conditionGroups: {
                                ...rootConditionGroup.conditionGroups,
                                [cgoid]: conditionGroup,
                              },
                            });
                          }}
                          onValueChange={(value: any) => {
                            conditionGroup.conditions[cgoid].data.value = value;
                            setRootConditionGroup({
                              ...rootConditionGroup,
                              conditionGroups: {
                                ...rootConditionGroup.conditionGroups,
                                [cgoid]: conditionGroup,
                              },
                            });
                          }}
                          dropDownPortal={dropDownPortal}
                          fieldOptions={fieldOptions}
                          operator={conditionGroup.operator}
                          onOperatorChange={(operator: "and" | "or") => {
                            conditionGroup.operator = operator;
                            setRootConditionGroup({
                              ...rootConditionGroup,
                              conditionGroups: {
                                ...rootConditionGroup.conditionGroups,
                                [cgoid]: conditionGroup,
                              },
                            });
                          }}
                        />
                      );
                    } else return null;
                  })}
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    width="full"
                  >
                    <PrimaryButton
                      variant="tertiary"
                      size="extraSmall"
                      onClick={() => {
                        const newCondition: ConditionType = {
                          id: uuid(),
                          type: "data",
                          service: "collection",
                          data: {
                            field: {
                              label: fieldOptions[0]?.label,
                              value: fieldOptions[0]?.value,
                            },
                            comparator: {
                              label: "is",
                              value: "is",
                            },
                            value: "",
                          },
                        };
                        conditionGroup.order = [
                          ...conditionGroup.order,
                          newCondition.id,
                        ];
                        conditionGroup.conditions[newCondition.id] =
                          newCondition;
                        setRootConditionGroup({
                          ...rootConditionGroup,
                          conditionGroups: {
                            ...rootConditionGroup.conditionGroups,
                            [oid]: conditionGroup,
                          },
                        });
                      }}
                    >
                      Add Condition
                    </PrimaryButton>
                  </Box>
                </ConditionGroupCard>
              </Stack>
            );
          }
        })}
      <Box
        display="flex"
        flexDirection="row"
        gap="4"
        marginTop="4"
        width={(buttonWidth as any) || "64"}
        padding="0.5"
      >
        <PrimaryButton
          icon={<IconPlusSmall size="5" />}
          variant="tertiary"
          size="extraSmall"
          onClick={() => {
            if (!fieldOptions[0]) {
              toast.warn(
                "There are no non-hidden fields above this field that can be used to add conditions."
              );
              return;
            }
            const newCondition: ConditionType = {
              id: uuid(),
              type: "data",
              service: "collection",
              data: {
                field: {
                  label: fieldOptions[0]?.label,
                  value: fieldOptions[0]?.value,
                },
                comparator: getComparators(
                  collection.properties[fieldOptions[0]?.value]?.type
                )[0],
              },
            };
            if (!rootConditionGroup.operator) {
              rootConditionGroup.operator = "and";
            }
            if (!rootConditionGroup.conditionGroups) {
              rootConditionGroup.conditionGroups = {};
            }
            setRootConditionGroup({
              ...rootConditionGroup,
              order: [...(rootConditionGroup.order || []), newCondition.id],
              conditions: {
                ...rootConditionGroup.conditions,
                [newCondition.id]: newCondition,
              },
            });
          }}
        >
          {buttonText}
        </PrimaryButton>
        <PrimaryButton
          icon={<IconPlusSmall size="5" />}
          variant="tertiary"
          size="extraSmall"
          onClick={() => {
            const defaultCondition = {
              id: uuid(),
              type: "data",
              service: "collection",
              data: {
                field: {
                  label: fieldOptions[0]?.label,
                  value: fieldOptions[0]?.value,
                },
                comparator: getComparators(
                  collection.properties[fieldOptions[0]?.value]?.type
                )[0],
              },
            };

            const newConditionGroup: ConditionGroup = {
              id: uuid(),
              operator: "and",
              order: [defaultCondition.id],
              conditions: {
                [defaultCondition.id]: defaultCondition,
              },
            };
            if (!rootConditionGroup.operator) {
              rootConditionGroup.operator = "and";
            }
            if (!rootConditionGroup.conditions) {
              rootConditionGroup.conditions = {};
            }
            setRootConditionGroup({
              ...rootConditionGroup,
              order: [
                ...(rootConditionGroup.order || []),
                newConditionGroup.id,
              ],
              conditionGroups: {
                ...(rootConditionGroup.conditionGroups || {}),
                [newConditionGroup.id]: newConditionGroup,
              },
            });
          }}
        >
          {groupButtonText}
        </PrimaryButton>
      </Box>
    </Box>
  );
}

const ConditionGroupCard = styled(Box)<{
  mode: string;
}>`
  margin: 0;
  width: 100%;
  height: auto;
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0px 1px 6px
    ${(props) =>
      props.mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    box-shadow: 0px 3px 10px
      ${(props) =>
        props.mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.25)"};
    transition-duration: 0.7s;
  }
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: flex-start;
  position: relative;
  transition: all 0.5s ease-in-out;
`;
