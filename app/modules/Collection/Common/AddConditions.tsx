import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType, Condition } from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import { getComparators } from "./Comparator";
import FilterValueField from "./FilterValueField";
import { toast } from "react-toastify";

type Props = {
  viewConditions: Condition[];
  setViewConditions: (viewConditions: Condition[]) => void;
  buttonText: string;
  firstRowMessage?: string;
  collection: CollectionType;
  dropDownPortal: boolean;
  buttonWidth?: string;
};

export default function AddConditions({
  viewConditions,
  setViewConditions,
  firstRowMessage,
  buttonText,
  collection,
  buttonWidth,
  dropDownPortal,
}: Props) {
  const fieldOptions = Object.entries(collection.properties || {})
    .filter((field) => !["multiURL"].includes(field[1].type))
    .map((field) => ({
      label: collection.properties[field[0]].name,
      value: field[0],
    }));

  return (
    <Box>
      {viewConditions?.map((condition, index) => (
        <Box key={index} marginBottom="2">
          <Stack
            direction="horizontal"
            align={{
              xs: "flex-start",
              md: "center",
            }}
          >
            <Box
              width={{
                xs: "full",
                md: "1/4",
              }}
              marginTop={{
                xs: "2",
                md: "0",
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
            <Box
              width="full"
              display="flex"
              flexDirection={{
                xs: "column",
                md: "row",
              }}
              gap="2"
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
                  onChange={(option) => {
                    const newConditions = [...viewConditions];
                    newConditions[index].data.comparator = option;
                    setViewConditions(newConditions);
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
                  dropDownPortal={dropDownPortal}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      ))}
      <Box marginTop="4" width={(buttonWidth as any) || "64"} padding="0.5">
        <PrimaryButton
          icon={<IconPlusSmall size="5" />}
          variant="tertiary"
          onClick={() => {
            if (!fieldOptions[0]) {
              toast.warn(
                "There are no fields in the form to add a condition to."
              );
              return;
            }
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
