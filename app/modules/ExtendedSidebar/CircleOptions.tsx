import { CircleType, ProjectType, UserType } from "@/app/types";
import { SettingOutlined } from "@ant-design/icons";
import { Box, Button, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { useQuery } from "react-query";
import mixpanel from "@/app/common/utils/mixpanel";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import SettingsModal from "../Circle/CircleSettingsModal";

const CircleOptions = () => {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
    notifyOnChangeProps: ["data"],
  });
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { canDo } = useRoleGate();

  return (
    <Box width="full">
      <AnimatePresence>
        {settingsModalOpen && (
          <SettingsModal handleClose={() => setSettingsModalOpen(false)} />
        )}
      </AnimatePresence>
      <Box display="flex" flexDirection="row" alignItems="center" width="full">
        <Box
          style={{
            width: "90%",
          }}
        >
          <Text size="headingThree" weight="bold" ellipsis>
            {circle?.name || project?.parents[0].name}
          </Text>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          style={{
            width: "10%",
          }}
        >
          {canDo("manageCircleSettings") && (
            <Button
              data-tour="circle-settings-button"
              shape="circle"
              size="small"
              variant="transparent"
              onClick={() => {
                setSettingsModalOpen(true);
                process.env.NODE_ENV === "production"
                  && mixpanel.track("Sidebar circle settings", {
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
};

export default memo(CircleOptions);
