import React, { ReactElement } from "react";
import { Box, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ConnectModal from "@/app/modules/Header/ConnectModal";
import ProfileModal from "./ProfileModal";
import { CircleType, ProjectType, UserType } from "@/app/types";
import ProjectSettings from "../Project/ProjectSettings";

const getUser = async () => {
  const res = await fetch("http://localhost:3000/user/me", {
    credentials: "include",
  });
  return await res.json();
};

function Header(): ReactElement {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser);
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

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
        {!cId && <Heading>Circles</Heading>}
        {cId && !pId && <Heading>{circle?.name}</Heading>}
        {pId && <Heading>{project?.name}</Heading>}
        {pId && project?.name && <ProjectSettings />}
        <Box marginLeft="4" />
      </Stack>
      <Stack direction="horizontal">
        {currentUser?.id ? <ProfileModal /> : <ConnectModal />}
      </Stack>
    </Box>
  );
}

export default Header;
