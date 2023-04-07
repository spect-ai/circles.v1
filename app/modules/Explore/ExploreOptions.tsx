import Popover from "@/app/common/components/Popover";
import { Box, Text } from "degen";
import { useState } from "react";
import { PopoverOption } from "../Circle/CircleSettingsModal/DiscordRoleMapping/RolePopover";

const ExploreOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("Circles");
  return (
    <Popover
      butttonComponent={
        <Box
          cursor="pointer"
          onClick={() => setIsOpen(!isOpen)}
          color="foreground"
          borderLeftWidth="0.5"
          paddingLeft="2"
        >
          <Text>{type}</Text>
        </Box>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Box
        backgroundColor="background"
        borderWidth="0.5"
        borderRadius="2xLarge"
        width="36"
      >
        <PopoverOption
          onClick={() => {
            setIsOpen(false);
            setType("Circles");
          }}
        >
          Circles
        </PopoverOption>
      </Box>
    </Popover>
  );
};

export default ExploreOptions;
