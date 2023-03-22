import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType, Condition } from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import { getComparators } from "./Comparator";
import FilterValueField from "./FilterValueField";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  viewConditions: Condition[];
  setViewConditions: (viewConditions: Condition[]) => void;
  buttonText: string;
  firstRowMessage?: string;
  collection: CollectionType;
};

export default function AddConditions({
  viewConditions,
  setViewConditions,
  firstRowMessage,
  buttonText,
  collection,
}: Props) {
  const fieldOptions = Object.entries(collection.properties)
    .filter((field) => !["multiURL"].includes(field[1].type))
    .map((field) => ({
      label: field[0],
      value: field[0],
    }));
  return (
    <Box>
      {viewConditions?.map((condition, index) => (
        <Box key={index} marginBottom="2">
          <Stack direction="horizontal" align={"center"}>
            <Box
              width={{
                xs: "full",
                md: "1/4",
              }}
            >
              <Stack direction="horizontal" align="center" space="1">
                <Button
                  shape="circle"
                  size="small"
                  variant="transparent"
                  onClick={() => {
                    const newConditions = [...viewConditions];
                    newConditions.splice(index, 1);
                    setViewConditions(newConditions);
                  }}
                >
                  <DeleteOutlined style={{ fontSize: "1.2rem" }} />
                </Button>
                <Text size="base">
                  {index === 0
                    ? `${firstRowMessage || "Show field when"}`
                    : "and"}
                </Text>
              </Stack>
            </Box>
            <Box width="full" display="flex" gap="2" alignItems="center">
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
                    const newConditions = [...viewConditions];
                    newConditions[index].data.field = option;
                    newConditions[index].data.comparator = getComparators(
                      collection.properties[option.value]?.type
                    )[0];
                    newConditions[index].data.value = "";
                    setViewConditions(newConditions);
                  }}
                  multiple={false}
                  isClearable={false}
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
                  onChange={(option) => {
                    const newConditions = [...viewConditions];
                    newConditions[index].data.comparator = option;
                    setViewConditions(newConditions);
                  }}
                  multiple={false}
                  isClearable={false}
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
          </Stack>
        </Box>
      ))}
      <Box marginTop="4">
        <PrimaryButton
          icon={<IconPlusSmall />}
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
          {buttonText}
        </PrimaryButton>
      </Box>
    </Box>
  );
}
