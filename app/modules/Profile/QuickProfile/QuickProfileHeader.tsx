import { Box, Avatar, Tag, Text, Button } from "degen";
import { useDisconnect } from "wagmi";
import { useGlobal } from "@/app/context/globalContext";
import { UserType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import React  from "react";
import queryClient from "@/app/common/utils/queryClient";

export const QuickProfileHeader = React.memo(({ userData }: { userData: UserType }) => {
  const { setIsProfilePanelExpanded, disconnectUser } = useGlobal();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { disconnect } = useDisconnect();
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
          {userData?.username}
        </Text>
        <Tag tone="purple" size="small">
          {userData?.ethAddress?.substring(0, 20) + "..."}
        </Tag>
      </Box>
      <Box
        style={{ position: "absolute", right: "1rem" }}
        display="flex"
        flexDirection="row"
        gap="1.5"
      >
        <Link href={`/profile/${userData?.id}`}>
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
              disconnectUser();
            }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
});

QuickProfileHeader.displayName = "QuickProfileHeader";
