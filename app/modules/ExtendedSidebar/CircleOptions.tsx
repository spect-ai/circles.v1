import Popover from "@/app/common/components/Popover";
import { CircleType, Permissions, ProjectType, UserType } from "@/app/types";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconUserGroup,
  IconUsersSolid,
  Stack,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { memo, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PopoverOption } from "../Card/OptionPopover";
import SettingsModal from "../Circle/CircleSettingsModal";
import { HeaderButton } from "./ExploreSidebar";
import { useGlobal } from "@/app/context/globalContext";
import mixpanel from "@/app/common/utils/mixpanel";

function CircleOptions() {
  const router = useRouter();
  const { setToggle } = useGlobal();
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
  const [perm, setPerm] = useState({} as Permissions);
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  useEffect(() => {
    if (circle?.id) {
      fetch(
        `${process.env.API_HOST}/circle/myPermissions?circleIds=${circle?.id}`,
        {
          credentials: "include",
        }
      )
        .then((res) => {
          res
            .json()
            .then((permissions: Permissions) => {
              setPerm(permissions);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }, [circle?.id]);

  return (
    <Box width="full">
      <AnimatePresence>
        {settingsModalOpen && (
          <SettingsModal handleClose={() => setSettingsModalOpen(false)} />
        )}
      </AnimatePresence>
      <Box display="flex" flexDirection="row" alignItems="center" width="full">
        <Box width="full">
          <Popover
            data-tour="circle-options-popover"
            butttonComponent={
              <HeaderButton
                data-tour="circle-options-button"
                padding="1"
                marginTop="0.5"
                marginBottom="1"
                borderRadius="large"
                width="full"
                onClick={() => {
                  setIsOpen(!isOpen);
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Sidebar header button", {
                      circle: cId,
                      user: currentUser?.username,
                    });
                }}
                mode={mode}
              >
                <Stack direction="horizontal" align="center">
                  <Text size="headingTwo" weight="semiBold" ellipsis>
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
              width="44"
            >
              <PopoverOption
                onClick={() => {
                  setIsOpen(false);
                  void router.push(`/${cId}`);
                  setToggle(0);
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
                  void router.push(`/${cId}`);
                  setToggle(1);
                }}
              >
                <Stack direction="horizontal" space="2">
                  <IconUsersSolid />
                  Contributors
                </Stack>
              </PopoverOption>
              <PopoverOption
                onClick={() => {
                  setIsOpen(false);
                  void router.push(`/${cId}`);
                  setToggle(2);
                }}
              >
                <Stack direction="horizontal" space="2">
                  <IconUserGroup />
                  Roles
                </Stack>
              </PopoverOption>
            </Box>
          </Popover>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          width="1/4"
          justifyContent="flex-end"
        >
          {perm?.manageCircleSettings && (
            <Button
              data-tour="circle-settings-button"
              shape="circle"
              size="small"
              variant="transparent"
              onClick={() => {
                setSettingsModalOpen(true);
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Sidebar circle settings", {
                    circle: cId,
                    user: currentUser?.username,
                  });
              }}
            >
              <SettingOutlined
                style={{
                  color: "rgb(191, 90, 242, 0.8)",
                  fontSize: "1.2rem",
                }}
              />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default memo(CircleOptions);
