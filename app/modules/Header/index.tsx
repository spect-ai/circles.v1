import React, { ReactElement } from "react";
import { Box, Button, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ConnectModal from "@/app/modules/Header/ConnectModal";
import ProfileModal from "./ProfileModal";
import { CircleType, ProjectType, UserType } from "@/app/types";
import ProjectSettings from "../Project/ProjectSettings";
import Link from "next/link";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { DoubleRightOutlined } from "@ant-design/icons";
import { useGlobalContext } from "@/app/context/globalContext";
import BatchPay from "../Project/BatchPay";
import styled from "styled-components";

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
    credentials: "include",
  });
  return await res.json();
};

export const SlideButtonContainer = styled(Box)`
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function Header(): ReactElement {
  const { setIsSidebarExpanded, isSidebarExpanded } = useGlobalContext();
  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser);
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  const { canDo } = useRoleGate();

  console.log("host", process.env.API_HOST);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      borderBottomWidth="0.375"
      padding="3"
      paddingX="4"
      transitionDuration="1000"
      backgroundColor="background"
    >
      <Stack direction="horizontal" align="center">
        {!isSidebarExpanded && cId && (
          <SlideButtonContainer
            transitionDuration="300"
            style={{
              transform: isSidebarExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
            marginLeft="-3"
            marginRight="-2"
            cursor="pointer"
            color="textSecondary"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          >
            <DoubleRightOutlined style={{ fontSize: "1.1rem" }} />
          </SlideButtonContainer>
        )}
        {isSidebarExpanded && <Box />}
        {!cId && <Heading>Circles</Heading>}
        {cId && !pId && <Heading>{circle?.name}</Heading>}
        {pId && project?.name && (
          <Heading>
            <Link href={`/${cId}/${pId}`}>{project?.name}</Link>
          </Heading>
        )}
        <Stack direction="horizontal" align="center" space="1">
          {pId && project?.name && canDo(["steward"]) && <ProjectSettings />}
          {pId && !tId && project?.name && canDo(["steward"]) && <BatchPay />}
        </Stack>
        <Box marginLeft="4" />
      </Stack>
      <Stack direction="horizontal">
        {currentUser?.id ? <ProfileModal /> : <ConnectModal />}
      </Stack>
    </Box>
  );
}

export default Header;
