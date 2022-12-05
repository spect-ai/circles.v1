import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Condition, Option } from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Text } from "degen";
import { useEffect, useState } from "react";
import { getComparators } from "./Comparator";
import FilterValueField from "./FilterValueField";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  viewConditions: Condition[];
  setViewConditions: (viewConditions: Condition[]) => void;
  firstRowMessage?: string;
};

export default function AddConditions({
  viewConditions,
  setViewConditions,
  firstRowMessage,
}: Props) {
  const { localCollection: collection } = useLocalCollection();

  const [fieldOptions, setFieldOptions] = useState<Option[]>(
    Object.entries(collection.properties)
      .filter((field) => !["multiURL"].includes(field[1].type))
      .map((field) => ({
        label: field[0],
        value: field[0],
      }))
  );
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
              width={{
                xs: "full",
                md: "48",
              }}
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap="2"
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
                <Text size="small">
                  {index === 0
                    ? `${firstRowMessage || "Show field when"}`
                    : "and"}
                </Text>
              </Box>
            </Box>
            <Box
              width={{
                xs: "full",
                md: "1/4",
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
              width={{
                xs: "full",
                md: "1/4",
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
              width={{
                xs: "full",
                md: "1/4",
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
              <FilterValueField
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
          </Box>
        </Box>
      ))}
      <Box width="1/2" marginTop="4">
        <PrimaryButton
          variant="tertiary"
          onClick={() => {
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
