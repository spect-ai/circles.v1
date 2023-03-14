import { Box, Avatar, Tag, Text, Button, Stack } from "degen";
import { UserType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import React, { memo } from "react";
import Logout from "@/app/common/components/LogoutButton";
import { smartTrim } from "@/app/common/utils/utils";
import { isProfilePanelExpandedAtom } from "@/app/state/global";
import { useAtom } from "jotai";

const TaskWalletHeader = () => {
  const [isProfilePanelExpanded, setIsProfilePanelExpanded] = useAtom(
    isProfilePanelExpandedAtom
  );
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  return (
    <Stack direction="horizontal" justify="space-between">
      <Stack direction="horizontal" space="2">
        <Avatar
          label="profile-pic"
          src={
            currentUser?.avatar ||
            `https://api.dicebear.com/5.x/thumbs/svg?seed=${currentUser?.username}`
          }
          size="16"
          address={currentUser?.ethAddress}
        />
        <Stack space="1">
          <Text variant="extraLarge" weight="semiBold">
            {smartTrim(currentUser?.username || "", 16)}
          </Text>
          <Tag tone="purple" size="small">
            {smartTrim(currentUser?.ethAddress || "", 12)}
          </Tag>
        </Stack>
      </Stack>
      <Stack direction="horizontal">
        <Link href={`/profile/${currentUser?.username}`}>
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
        {currentUser?.id == currentUser?.id && <Logout />}
      </Stack>
    </Stack>
  );
};

export default memo(TaskWalletHeader);
