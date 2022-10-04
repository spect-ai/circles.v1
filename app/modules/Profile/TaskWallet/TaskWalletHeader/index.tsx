import { Box, Avatar, Tag, Text, Button } from "degen";
import { useDisconnect } from "wagmi";
import { useGlobal } from "@/app/context/globalContext";
import { UserType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import React, { memo } from "react";
import queryClient from "@/app/common/utils/queryClient";
import { smartTrim } from "@/app/common/utils/utils";
import { useAtom } from "jotai";
import { authStatusAtom } from "@/pages/_app";

const TaskWalletHeader = ({ userData }: { userData: UserType }) => {
  const { setIsProfilePanelExpanded, disconnectUser } = useGlobal();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { disconnect } = useDisconnect();
  const [authenticationStatus, setAuthenticationStatus] =
    useAtom(authStatusAtom);

  return (
    <Box
      paddingBottom="4"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        position: "relative",
        alignItems: "center",
        width: "650px",
        borderBottom: "1px solid rgba(255, 255, 255, .1)",
      }}
    >
      <Avatar
        label="profile-pic"
        src={userData?.avatar}
        size="16"
        address={userData?.ethAddress}
      />
      <Box style={{ gap: "1.5rem" }}>
        <Text variant="extraLarge" weight="semiBold">
          {smartTrim(userData?.username, 16)}
        </Text>
        <Tag tone="purple" size="small">
          {smartTrim(userData?.ethAddress, 12)}
        </Tag>
      </Box>
      <Box
        style={{ position: "absolute", right: "1rem" }}
        display="flex"
        flexDirection="row"
        gap="1.5"
      >
        <Link href={`/profile/${userData?.username}`}>
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              setIsProfilePanelExpanded(false);
            }}
          >
            View Profile
          </Button>
        </Link>
        {currentUser?.id == userData?.id && (
          <Button
            size="small"
            variant="tertiary"
            onClick={async () => {
              setIsProfilePanelExpanded(false);
              await fetch(`${process.env.API_HOST}/auth/disconnect`, {
                method: "POST",
                credentials: "include",
              });
              disconnect();
              queryClient.setQueryData("getMyUser", null);
              void queryClient.invalidateQueries("getMyUser");
              localStorage.removeItem("connectorIndex");
              setAuthenticationStatus("unauthenticated");
              disconnectUser();
            }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default memo(TaskWalletHeader);
