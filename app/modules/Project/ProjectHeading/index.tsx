import { useGlobalContext } from "@/app/context/globalContext";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Box, IconGrid, IconList, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { memo } from "react";
import styled from "styled-components";
import { SlideButtonContainer } from "../../Header";
import { useLocalProject } from "../Context/LocalProjectContext";
import ProjectOptions from "./ProjectOptions";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function ProjectHeading() {
  const { localProject: project, loading } = useLocalProject();
  const { setIsSidebarExpanded, isSidebarExpanded } = useGlobalContext();
  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;

  return (
    <Box
      width="full"
      paddingY="4"
      paddingX="8"
      borderBottomWidth="0.375"
      backgroundColor="background"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Stack direction="horizontal" align="center">
        {!isSidebarExpanded && cId && (
          <SlideButtonContainer
            transitionDuration="300"
            style={{
              transform: isSidebarExpanded ? "rotate(180deg)" : "rotate(0deg)",
              marginLeft: "-2rem",
            }}
            cursor="pointer"
            color="textSecondary"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          >
            <DoubleRightOutlined style={{ fontSize: "1.1rem" }} />
          </SlideButtonContainer>
        )}
        <Text size="extraLarge" weight="semiBold">
          {project?.name}
        </Text>
        <ProjectOptions />
      </Stack>
      <Stack direction="horizontal">
        <Box
          display="flex"
          flexDirection="row"
          borderWidth="0.375"
          borderRadius="large"
          backgroundColor="foregroundSecondary"
        >
          <IconButton
            color="textSecondary"
            borderRightWidth="0.375"
            paddingX="2"
            borderLeftRadius="large"
          >
            <IconGrid size="6" />
          </IconButton>
          <IconButton
            color="textSecondary"
            paddingX="2"
            borderRightRadius="large"
          >
            <IconList size="6" />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}

export default memo(ProjectHeading);
