import {
  Box,
  IconPlusSmall,
  Button,
  Text,
  useTheme,
  IconUserGroup,
  IconLightningBolt,
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
}

export default function CreateFolderItem({
  setProjectModal,
  setWorkstreamModal,
  setRetroOpen,
}: Props) {
  const { mode } = useTheme();
  const { canDo } = useRoleGate();
  const [hover, setHover] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Box display={"flex"} flexDirection={"row"} alignItems="center">
        <Button
          size="small"
          variant="transparent"
          shape="circle"
          data-tour="create-proj-workstream-retro"
        >
          <IconPlusSmall size={"5"} />
        </Button>
        {hover && (
          <Box
            transitionDuration={"700"}
            display={"flex"}
            flexDirection={"row"}
            gap={"3"}
            marginLeft="3"
          >
            {/* <CreateProjectModal folderId={folderId} />
            <CreateSpaceModal folderId={folderId} />
            <CreateRetro folderId={folderId} />
            <CreateCollectionModal folderId={folderId} /> */}
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
        )}
      </Box>
    </Box>
  );
}
