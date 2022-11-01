import {
  Box,
  IconPlusSmall,
  Button,
  Text,
  useTheme,
  IconUserGroup,
  IconLightningBolt,
  IconCollection,
  Stack,
} from "degen";
import { useState } from "react";
import { ProjectOutlined } from "@ant-design/icons";
import { Tooltip } from "react-tippy";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { toast } from "react-toastify";
interface Props {
  setProjectModal: (a: boolean) => void;
  setWorkstreamModal: (a: boolean) => void;
  setRetroOpen: (a: boolean) => void;
  setCollectionModal: (a: boolean) => void;
}

export default function CreateFolderItem({
  setProjectModal,
  setWorkstreamModal,
  setRetroOpen,
  setCollectionModal,
}: Props) {
  const { mode } = useTheme();
  const { canDo } = useRoleGate();

  return (
    <Box>
      <Stack direction="horizontal" space="1" align="center">
        <IconPlusSmall size="5" color="textSecondary" />
        <Box
          transitionDuration={"700"}
          display={"flex"}
          flexDirection={"row"}
          gap={{
            xs: "0",
            md: "3",
          }}
        >
          <Tooltip html={<Text>Create Form</Text>} theme={mode}>
            <Button
              size="small"
              variant="transparent"
              shape="circle"
              onClick={(e) => {
                e.stopPropagation();
                setCollectionModal(true);
              }}
            >
              <IconCollection size="4" color="accent" />
            </Button>
          </Tooltip>
          <Tooltip html={<Text>Create Project</Text>} theme={mode}>
            <Button
              size="small"
              variant="transparent"
              shape="circle"
              onClick={(e) => {
                if (canDo("createNewProject")) {
                  e.stopPropagation();
                  setProjectModal(true);
                } else {
                  toast.error(
                    "You don't have the permission to create a new Project"
                  );
                }
              }}
            >
              <ProjectOutlined
                style={{ fontSize: "1.1rem", color: "rgb(191, 90, 242, 1)" }}
              />
            </Button>
          </Tooltip>
          <Tooltip html={<Text>Create Workstream</Text>} theme={mode}>
            <Button
              data-tour="folder-create-workstream-button"
              size="small"
              variant="transparent"
              shape="circle"
              onClick={(e) => {
                if (canDo("createNewCircle")) {
                  e.stopPropagation();
                  setWorkstreamModal(true);
                } else {
                  toast.error(
                    "You don't have the permission to create a new Workstream"
                  );
                }
              }}
            >
              <IconUserGroup size={"4"} color="accent" />
            </Button>
          </Tooltip>
          <Tooltip html={<Text>Create Retro</Text>} theme={mode}>
            <Button
              size="small"
              variant="transparent"
              shape="circle"
              onClick={(e) => {
                if (canDo("createNewRetro")) {
                  e.stopPropagation();
                  setRetroOpen(true);
                } else {
                  toast.error(
                    "You don't have the permission to create a new Retro"
                  );
                }
              }}
            >
              <IconLightningBolt size={"4"} color="accent" />
            </Button>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  );
}
