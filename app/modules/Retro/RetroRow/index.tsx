import { timeSince } from "@/app/common/utils/utils";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { RetroType } from "@/app/types";
import { AvatarGroup, Box, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

type Props = {
  retro: RetroType;
};

const RowContainer = styled(Box)`
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
`;

export default function RetroRow({ retro }: Props) {
  const { getMemberDetails } = useModalOptions();
  const getMemberAvatars = React.useCallback(
    (members: string[]) => {
      return members.map((member) => {
        const memberDetails = getMemberDetails(member);
        return {
          src: memberDetails?.avatar,
          label: memberDetails?.username || "",
          address: memberDetails?.ethAddress,
        };
      });
    },
    [getMemberDetails]
  );

  return (
    <motion.div
      whileHover={{
        translateY: -4,
      }}
      whileTap={{
        scale: 0.98,
        translateY: -4,
      }}
    >
      <RowContainer
        width="full"
        borderWidth="0.375"
        borderRadius="2xLarge"
        paddingY="4"
        paddingX="8"
        transitionDuration="300"
      >
        <Stack direction="horizontal" align="center" justify="space-between">
          <Text weight="semiBold">{retro.title}</Text>
          <Stack direction="horizontal">
            {retro.status.active && <Tag tone="accent">Active</Tag>}
            <Tag>
              <Text color="green">
                {retro.reward.value} {retro.reward.token.symbol}
              </Text>
            </Tag>
            <Tag>{timeSince(new Date(retro.createdAt))} Ago</Tag>
            <AvatarGroup members={getMemberAvatars(retro.members)} hover />
          </Stack>
        </Stack>
      </RowContainer>
    </motion.div>
  );
}
