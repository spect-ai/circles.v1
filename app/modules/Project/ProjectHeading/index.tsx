import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, Stack, Text, useTheme } from "degen";
import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import ProjectOptions from "./ProjectOptions";
import { ViewBar } from "../ProjectViews";
import { useRouter } from "next/router";
import { useGlobal } from "@/app/context/globalContext";
import AdvancedOptions from "./AdvancedOptions";
import {
  AlignLeftOutlined,
  BarsOutlined,
  AppstoreOutlined,
  TableOutlined
} from "@ant-design/icons";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function ProjectHeading() {
  const { localProject: project, loading } = useLocalProject();
  const { canDo } = useRoleGate();
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId, project: pId, view: vId } = router.query;
  const { setViewName, viewName, view, setView } = useGlobal();

  const defaultView = () => {
    if (viewName.length > 0) setViewName("");
    if (vId) void router.push(`/${cId}/${pId}/`);
  };

  return (
    <Box
      width="full"
      display="flex"
      flexDirection="column"
      alignItems="center"
      // borderBottomWidth="0.375"
      paddingLeft="3"
      paddingRight="5"
    >
      <Box
        width="full"
        height="16"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{
          paddingTop: "0.5rem",
          paddingBottom: "0.0rem",
        }}
      >
        <Stack direction="horizontal" align="center">
          {!loading && (
            <Button
              variant="transparent"
              size="small"
              onClick={() => defaultView()}
            >
              <Text size="headingTwo" weight="semiBold" ellipsis>
                {project?.name}
              </Text>
            </Button>
          )}
          {loading && (
            <Skeleton
              enableAnimation
              style={{
                height: "2rem",
                width: "15rem",
                borderRadius: "0.5rem",
              }}
              baseColor={mode === "dark" ? "rgb(20,20,20)" : "rgb(255,255,255)"}
              highlightColor={
                mode === "dark" ? "rgb(255,255,255,0.1)" : "rgb(20,20,20,0.1)"
              }
            />
          )}
          {project?.name && canDo("manageProjectSettings") && (
            <ProjectOptions />
          )}
          <ViewBar />
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
              paddingY="0.5"
              borderLeftRadius="large"
              backgroundColor={
                view === 0 && viewName === ""
                  ? "foregroundSecondary"
                  : "background"
              }
              onClick={() => {
                setView(0);
                defaultView();
              }}
            >
              <AppstoreOutlined style={{ fontSize: "1.4rem" }} />
            </IconButton>
            <IconButton
              color="textSecondary"
              borderRightWidth="0.375"
              paddingX="2"
              paddingY="0.5"
              backgroundColor={
                view === 1 && viewName === ""
                  ? "foregroundSecondary"
                  : "background"
              }
              onClick={() => {
                setView(1);
                defaultView();
              }}
            >
              <BarsOutlined style={{ fontSize: "1.4rem" }} />
            </IconButton>
            <IconButton
              color="textSecondary"
              paddingX="2"
              paddingY="1"
              borderRightWidth="0.375"
              backgroundColor={
                view === 2 && viewName === ""
                  ? "foregroundSecondary"
                  : "background"
              }
              onClick={() => {
                setView(2);
                defaultView();
              }}
            >
              <AlignLeftOutlined style={{ fontSize: "1.3rem" }} />
            </IconButton>
            <IconButton
              color="textSecondary"
              paddingX="2"
              paddingY="1"
              borderRightRadius="large"
              backgroundColor={
                view === 3 && viewName === ""
                  ? "foregroundSecondary"
                  : "background"
              }
              onClick={() => {
                setView(3);
                defaultView();
              }}
            >
              <TableOutlined style={{ fontSize: "1.3rem" }} />
            </IconButton>
          </Box>
        </Stack>
      </Box>
      <AdvancedOptions />
    </Box>
  );
}

export default memo(ProjectHeading);
