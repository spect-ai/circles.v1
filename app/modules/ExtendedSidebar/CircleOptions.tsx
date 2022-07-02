import Popover from "@/app/common/components/Popover";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, ProjectType } from "@/app/types";
import { AppstoreOutlined } from "@ant-design/icons";
import { Avatar, Box, IconCog, IconUsersSolid, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { PopoverOption } from "../Card/ActionPopover";
import SettingsModal from "../Circle/CircleSettingsModal";
import ContributorsModal from "../Circle/ContributorsModal";
import { HeaderButton } from "./ExploreSidebar";

export default function CircleOptions() {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
    notifyOnChangeProps: ["data"],
  });
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [contributorsModalOpen, setContributorsModalOpen] = useState(false);

  const { canDo } = useRoleGate();

  return (
    <>
      <AnimatePresence>
        {settingsModalOpen && (
          <SettingsModal handleClose={() => setSettingsModalOpen(false)} />
        )}
        {contributorsModalOpen && (
          <ContributorsModal
            handleClose={() => setContributorsModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <Popover
        butttonComponent={
          <HeaderButton
            padding="1"
            borderRadius="large"
            width="full"
            onClick={() => {
              canDo(["steward"]) && setIsOpen(true);
            }}
          >
            <Stack direction="horizontal" align="center">
              <Avatar
                src={circle?.avatar || ""}
                label=""
                size="10"
                placeholder={!circle?.avatar}
              />
              <Text size="extraLarge" weight="semiBold" ellipsis>
                {circle?.name || project?.parents[0].name}
              </Text>
            </Stack>
          </HeaderButton>
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
          </PopoverOption>
        </Box>
      </Popover>
    </>
  );
}
