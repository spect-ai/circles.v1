import Dropdown from "@/app/common/components/Dropdown";
import { Option, Trigger } from "@/app/types";
import { Box, Text } from "degen";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../../../Context/LocalCollectionContext";

type Props = {
  triggerMode: "edit" | "create";
  trigger: Trigger;
  setTrigger: (trigger: Trigger) => void;
};

export default function SingleSelectTrigger({
  setTrigger,
  triggerMode,
  trigger,
}: Props) {
  const [selectedFromOption, setSelectedFromOption] = useState([] as Option[]);
  const [selectedToOption, setSelectedToOption] = useState([] as Option[]);
  const [options, setOptions] = useState([] as Option[]);

  const { localCollection: collection } = useLocalCollection();

  useEffect(() => {
    if (collection.properties[trigger?.data?.fieldName]) {
      setOptions(collection.properties[trigger?.data?.fieldName].options || []);
    }
  }, [trigger]);

  useEffect(() => {
    setSelectedFromOption(
      trigger?.data?.from?.map((fromOption: string) => {
        return {
          label: fromOption,
          value: fromOption,
        };
      })
    );
  }, [trigger?.data?.from]);

  useEffect(() => {
    setSelectedToOption(
      trigger?.data?.to?.map((toOption: string) => {
        return {
          label: toOption,
          value: toOption,
        };
      })
    );
  }, [trigger?.data?.to]);

  return (
    <Box
      width="full"
      onMouseLeave={() => {
        setTrigger({
          ...trigger,
          data: {
            ...trigger.data,
            from: selectedFromOption?.map((option) => option.value),
            to: selectedToOption?.map((option) => option.value),
          },
        });
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        gap="2"
        width="full"
        alignItems="center"
        marginTop="2"
        marginBottom="2"
      >
        <Box width="1/4">
          <Text variant="label">From</Text>
        </Box>
        <Dropdown
          options={options}
          selected={selectedFromOption}
          onChange={(value) => {
            setSelectedFromOption(value);
          }}
          multiple={true}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        gap="2"
        width="full"
        alignItems="center"
      >
        <Box width="1/4">
          <Text variant="label">To</Text>
        </Box>{" "}
        <Dropdown
          options={options}
          selected={selectedToOption}
          onChange={(value) => {
            setSelectedToOption(value);
          }}
          multiple={true}
        />{" "}
      </Box>
    </Box>
  );
}
