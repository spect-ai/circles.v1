import { Box, Tag, Text } from "degen";
import { useState } from "react";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { PopoverOption } from "../../../Card/OptionPopover";
import Popover from "@/app/common/components/Popover";

export function GroupBy() {
  const { advFilters, setAdvFilters } = useLocalProject();
  const [groupByIsOpen, setGroupByIsOpen] = useState(false);
  return (
    <Popover
      butttonComponent={
        <Box
          data-tour="group-options-button"
          cursor="pointer"
          onClick={() => setGroupByIsOpen(!groupByIsOpen)}
          color="foreground"
          display="flex"
          flexDirection="row"
          gap="3"
        >
          <Text whiteSpace="nowrap">Group By</Text>
          <Tag size="medium" hover>
            {advFilters.groupBy}
          </Tag>
        </Box>
      }
      isOpen={groupByIsOpen}
      setIsOpen={setGroupByIsOpen}
    >
      <Box
        backgroundColor="background"
        borderWidth="0.5"
        borderRadius="2xLarge"
        width="36"
      >
        <PopoverOption
          tourId="default-button"
          onClick={() => {
            setGroupByIsOpen(false);
            setAdvFilters({
              ...advFilters,
              groupBy: "Status",
            });
          }}
        >
          Status (default)
        </PopoverOption>
        <PopoverOption
          tourId="groupby-assignee-button"
          onClick={() => {
            setGroupByIsOpen(false);
            setAdvFilters({
              ...advFilters,
              groupBy: "Assignee",
            });
          }}
        >
          Assignee
        </PopoverOption>
      </Box>
    </Popover>
  );
}
