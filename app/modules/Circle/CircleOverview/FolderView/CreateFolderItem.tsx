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

interface Props {
  setProjectModal: (a: boolean) => void;
  setWorkstreamModal: (a: boolean) => void;
  setRetroOpen: (a: boolean) => void;
}

function CreateFolderItem({
  setProjectModal,
  setWorkstreamModal,
  setRetroOpen,
}: Props) {
  const { mode } = useTheme();
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
            <Tooltip html={<Text>Create Project</Text>} theme={mode}>
              <Button
                size="small"
                variant="transparent"
                shape="circle"
                onClick={(e) => {
                  e.stopPropagation();
                  setProjectModal(true);
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
                  e.stopPropagation();
                  setWorkstreamModal(true);
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
                  e.stopPropagation();
                  setRetroOpen(true);
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

export default CreateFolderItem;
