import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Condition, Option } from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Text } from "degen";
import { useEffect, useState } from "react";
import FilterField from "../Common/FilterField";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  viewConditions: Condition[];
  setViewConditions: (viewConditions: Condition[]) => void;
  setModalSize: (size: "small" | "medium" | "large") => void;
};

export function getComparators(propertyType: string): Option[] {
  switch (propertyType) {
    case "shortText":
    case "longText":
    case "ethAddress":
    case "email":
      return [{ label: "is", value: "is" }];
    case "number":
      return [
        { label: "is", value: "is" },
        { label: "is greater than", value: "is greater than" },
        { label: "is less than", value: "is less than" },
      ];
    case "singleSelect":
      return [{ label: "is", value: "is" }];
    case "multiSelect":
      return [{ label: "includes", value: "includes" }];
    case "date":
      return [
        { label: "is", value: "is" },
        { label: "is after", value: "is after" },
        { label: "is before", value: "is before" },
      ];
    case "user":
      return [{ label: "is", value: "is" }];
    case "user[]":
      return [{ label: "includes", value: "includes" }];

    default:
      return [];
  }
}

export default function AddConditions({
  viewConditions,
  setViewConditions,
  setModalSize,
}: Props) {
  const { localCollection: collection } = useLocalCollection();

  const [fieldOptions, setFieldOptions] = useState<Option[]>(
    Object.entries(collection.properties).map((field) => ({
      label: field[0],
      value: field[0],
    }))
  );

  console.log({ viewConditions });
  return (
    <>
      {viewConditions?.map((condition, index) => (
        <Box key={index} marginBottom="2">
          <Box
            display="flex"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            gap="2"
            alignItems="center"
          >
            <Box
              style={{
                width: "15%",
              }}
            >
              <Text size="small">
                {index === 0 ? "Show field when" : "and"}
              </Text>
            </Box>
            <Box
              style={{
                width: "25%",
              }}
            >
              <Dropdown
                options={fieldOptions}
                selected={condition?.data?.field || {}}
                onChange={(option) => {
                  const newConditions = [...viewConditions];
                  newConditions[index].data.field = option;
                  newConditions[index].data.comparator = getComparators(
                    collection.properties[option.value]?.type
                  )[0];
                  newConditions[index].data.value = "";
                  setViewConditions(newConditions);
                }}
                multiple={false}
              />
            </Box>
            <Box
              style={{
                width: "25%",
              }}
            >
              <Dropdown
                options={getComparators(
                  collection.properties[condition?.data?.field?.value]?.type
                )}
                selected={condition?.data?.comparator || {}}
                onChange={(option) => {
                  const newConditions = [...viewConditions];
                  newConditions[index].data.comparator = option;
                  setViewConditions(newConditions);
                }}
                multiple={false}
              />
            </Box>
            <Box
              style={{
                width: "30%",
              }}
              marginTop={
                [
                  "shortText",
                  "longText",
                  "number",
                  "date",
                  "ethAddress",
                  "email",
                ].includes(
                  collection.properties[condition?.data?.field?.value]?.type
                )
                  ? "-2"
                  : "0"
              }
            >
              <FilterField
                value={condition?.data?.value}
                onChange={(value) => {
                  const newConditions = [...viewConditions];
                  newConditions[index].data.value = value;
                  setViewConditions(newConditions);
                }}
                collection={collection}
                propertyId={condition?.data?.field?.value}
                comparatorValue={condition?.data?.comparator?.value}
              />
            </Box>
            <Box
              style={{
                width: "5%",
              }}
            >
              <PrimaryButton
                variant="transparent"
                onClick={() => {
                  const newConditions = [...viewConditions];
                  newConditions.splice(index, 1);
                  setViewConditions(newConditions);
                }}
              >
                <DeleteOutlined />
              </PrimaryButton>
            </Box>
          </Box>
        </Box>
      ))}
      <Box width="1/2" marginTop="4">
        <PrimaryButton
          variant="tertiary"
          onClick={() => {
            setModalSize("large");
            const newCondition: Condition = {
              id: Math.random().toString(36).substring(7),
              type: "data",
              service: "collection",
              data: {
                field: fieldOptions[0],
                comparator: getComparators(
                  collection.properties[fieldOptions[0]?.value]?.type
                )[0],
              },
            };
            setViewConditions([...viewConditions, newCondition]);
          }}
        >
          Add Conditions
        </PrimaryButton>
      </Box>
    </>
  );
}
