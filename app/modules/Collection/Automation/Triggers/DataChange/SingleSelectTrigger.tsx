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
  const [options, setOptions] = useState([] as Option[]);

  const { localCollection: collection } = useLocalCollection();

  useEffect(() => {
    if (collection.properties[trigger?.data?.fieldName]) {
      setOptions(collection.properties[trigger?.data?.fieldName].options || []);
    }
  }, [trigger]);

  return (
    <Box width="full">
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
        <Box width="3/4">
          <Dropdown
            options={options}
            selected={trigger.data.from || []}
            onChange={(value) => {
              setTrigger({
                ...trigger,
                data: {
                  ...trigger.data,
                  from: value,
                },
              });
            }}
            multiple={true}
          />
        </Box>
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
        <Box width="3/4">
          <Dropdown
            options={options}
            selected={trigger.data.to || []}
            onChange={(value) => {
              setTrigger({
                ...trigger,
                data: {
                  ...trigger.data,
                  to: value,
                },
              });
            }}
            multiple={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
