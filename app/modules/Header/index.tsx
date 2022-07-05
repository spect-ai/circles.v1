import React, { ReactElement, useEffect } from "react";
import { Box, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ConnectModal from "@/app/modules/Header/ConnectModal";
import ProfileModal from "./ProfileModal";
import { CircleType, ProjectType, UserType } from "@/app/types";
import ProjectSettings from "../Project/ProjectSettings";
import Link from "next/link";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import BatchPay from "../Project/BatchPay";
import styled from "styled-components";
import { useGlobal } from "@/app/context/globalContext";

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
  const { isSidebarExpanded } = useGlobal();
  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;
  const { data: currentUser, refetch } = useQuery<UserType>(
    "getMyUser",
    getUser,
    {
      enabled: false,
    }
  );
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  const { canDo } = useRoleGate();

  useEffect(() => {
    void refetch();
  }, []);

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
        {isSidebarExpanded && <Box marginLeft="1" />}
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
