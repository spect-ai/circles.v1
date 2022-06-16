import React, { ReactElement } from "react";
import { Box, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ConnectModal from "@/app/common/layout/Header/ConnectModal";
import ProfileModal from "./ProfileModal";
import { CircleType, UserType } from "@/app/types";

const getUser = async () => {
  const res = await fetch("http://localhost:3000/users/me", {
    credentials: "include",
  });
  return await res.json();
};

function Header(): ReactElement {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser);
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      borderBottomWidth="0.375"
      padding="3"
      marginX="4"
      transitionDuration="1000"
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        {/* {id && !bid && tribe && (
          <Box marginRight="4">
            <Logo href={`/tribe/${tribe?.teamId}`} src={tribe?.logo} />
          </Box>
        )}
        {id && bid && space?.team && (
          <Box marginRight="4">
            <Logo
              href={`/tribe/${space.team[0].teamId}`}
              src={space.team[0].logo}
            />
          </Box>
        )} */}
        <Heading>{!cId && "Circles"}</Heading>
        <Heading>{cId && circle?.name}</Heading>
        {/* <Heading>
          {space?.name && bid && (
            <Link href={`/tribe/${id}/space/${bid}`} passHref>
              Dev Project
            </Link>
          )}
        </Heading> */}
        <Box marginLeft="4" />
        {/* <Stack direction="horizontal">
          <ProjectSettings />
          <PaymentModal />
        </Stack> */}
      </Box>
      <Stack direction="horizontal">
        {currentUser?.id ? <ProfileModal /> : <ConnectModal />}
      </Stack>
    </Box>
  );
}

export default Header;
