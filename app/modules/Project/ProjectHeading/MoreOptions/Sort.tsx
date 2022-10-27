import { Box, Tag, Text } from "degen";
import { useState } from "react";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { PopoverOption } from "../../../Card/OptionPopover";
import Popover from "@/app/common/components/Popover";

export function SortBy() {
  const { advFilters, setAdvFilters } = useLocalProject();
  const [sortIsOpen, setSortIsOpen] = useState(false);
  return (
    <Popover
      butttonComponent={
        <Box display="flex" flexDirection="row" gap="2">
          <Box
            data-tour="sortby-options-button"
            cursor="pointer"
            onClick={() => setSortIsOpen(!sortIsOpen)}
            color="foreground"
            display="flex"
            flexDirection="row"
            gap="3"
          >
            <Text whiteSpace="nowrap">Sort By</Text>
            <Tag size="medium" hover>
              {advFilters.sortBy}
            </Tag>
          </Box>
          {advFilters.sortBy !== "none" && (
            <Box
              data-tour="order-options-button"
              cursor="pointer"
              onClick={() => {
                if (advFilters.order == "asc") {
                  setAdvFilters({
                    ...advFilters,
                    order: "des",
                  });
                } else {
                  setAdvFilters({
                    ...advFilters,
                    order: "asc",
                  });
                }
              }}
              color="foreground"
              display="flex"
              flexDirection="row"
              gap="3"
            >
              <Tag size="medium" hover tone="accent">
                {advFilters.order}
              </Tag>
            </Box>
          )}
        </Box>
      }
      isOpen={sortIsOpen}
      setIsOpen={setSortIsOpen}
    >
      <Box
        backgroundColor="background"
        borderWidth="0.5"
        borderRadius="2xLarge"
        width="36"
      >
        <PopoverOption
          tourId="sortby-none-button"
          onClick={() => {
            setSortIsOpen(false);
            setAdvFilters({
              ...advFilters,
              sortBy: "none",
            });
          }}
        >
          None (default)
        </PopoverOption>
        <PopoverOption
          tourId="sortby-priority-button"
          onClick={() => {
            setSortIsOpen(false);
            setAdvFilters({
              ...advFilters,
              sortBy: "Priority",
            });
          }}
        >
          Priority
        </PopoverOption>
        <PopoverOption
          tourId="sortby-deadline-button"
          onClick={() => {
            setSortIsOpen(false);
            setAdvFilters({
              ...advFilters,
              sortBy: "Deadline",
            });
          }}
        >
          Deadline
        </PopoverOption>
      </Box>
    </Popover>
  );
}
