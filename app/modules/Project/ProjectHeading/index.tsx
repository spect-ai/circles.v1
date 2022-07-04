import { Box, Heading, IconGrid, IconList, Stack, Text } from "degen";
import React, { memo } from "react";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import ProjectOptions from "./ProjectOptions";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function ProjectHeading() {
  const { localProject: project } = useLocalProject();
  return (
    <Box
      width="full"
      paddingRight="8"
      paddingLeft="5"
      borderBottomWidth="0.375"
      backgroundColor="background"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{
        paddingTop: "0.79rem",
        paddingBottom: "0.9rem",
      }}
    >
      <Stack direction="horizontal" align="center">
        <Heading>{project?.name}</Heading>
        <ProjectOptions />
      </Stack>
      <Stack direction="horizontal" align="center">
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
