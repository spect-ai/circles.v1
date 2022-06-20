import React, { ReactElement } from "react";
import { Box, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ConnectModal from "@/app/modules/Header/ConnectModal";
import ProfileModal from "./ProfileModal";
import { CircleType, ProjectType, UserType } from "@/app/types";

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
      <Box display="flex" flexDirection="row" alignItems="center">
        <Heading>{!cId && "Circles"}</Heading>
        <Heading>{cId && !pId && circle?.name}</Heading>
        <Heading>{pId && project?.name}</Heading>

        <Box marginLeft="4" />
      </Box>
      <Stack direction="horizontal">
        {currentUser?.id ? <ProfileModal /> : <ConnectModal />}
      </Stack>
    </Box>
  );
}

export default Header;
