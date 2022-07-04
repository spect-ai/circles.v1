import Popover from "@/app/common/components/Popover";
import { Box, IconDotsHorizontal } from "degen";
import React, { useState } from "react";
import BatchPay from "../BatchPay";
import ProjectSettings from "../ProjectSettings";

export default function ProjectOptions() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box width="fit">
      <Popover
        butttonComponent={
          <Box
            data-tour="project-options-button"
            cursor="pointer"
            onClick={() => setIsOpen(!isOpen)}
            color="foreground"
          >
            <IconDotsHorizontal color="textSecondary" />
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
          <ProjectSettings />
          <BatchPay />
          {/* <PopoverOption
            onClick={() => {
              setIsOpen(false);
              void router.push(`/${cId}`);
            }}
          >
            <Stack direction="horizontal" space="2">
              <AppstoreOutlined
                style={{
                  fontSize: "1.3rem",
                  marginLeft: "2px",
                }}
              />
              Overview
            </Stack>
          </PopoverOption>
          <PopoverOption
            onClick={() => {
              setIsOpen(false);
              setSettingsModalOpen(true);
            }}
          >
            <Stack direction="horizontal" space="2">
              <IconCog />
              Settings
            </Stack>
          </PopoverOption>
          <PopoverOption
            onClick={() => {
              setIsOpen(false);
              setContributorsModalOpen(true);
            }}
          >
            <Stack direction="horizontal" space="2">
              <IconUsersSolid />
              Contributors
            </Stack>
          </PopoverOption> */}
        </Box>
      </Popover>
    </Box>
  );
}
