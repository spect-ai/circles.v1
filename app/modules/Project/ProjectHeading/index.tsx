import { Box, Heading, IconGrid, IconList, Stack } from "degen";
import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";
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
  const { localProject: project, loading, view, setView } = useLocalProject();
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
        {!loading && <Heading>{project?.name}</Heading>}
        {loading && (
          <Skeleton
            enableAnimation
            style={{
              height: "2rem",
              width: "15rem",
              borderRadius: "0.5rem",
            }}
            baseColor="rgb(20,20,20,1)"
            highlightColor="rgb(255,255,255,0.1)"
          />
        )}
        {project?.name && <ProjectOptions />}
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
            backgroundColor={view === 0 ? "foregroundSecondary" : "background"}
            onClick={() => setView(0)}
          >
            <IconGrid size="6" />
          </IconButton>
          <IconButton
            color="textSecondary"
            paddingX="2"
            borderRightRadius="large"
            backgroundColor={view === 1 ? "foregroundSecondary" : "background"}
            onClick={() => setView(1)}
          >
            <IconList size="6" />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}

export default memo(ProjectHeading);
