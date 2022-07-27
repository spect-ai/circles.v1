import CheckBox from "@/app/common/components/Table/Checkbox";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { Avatar, Box, Input, Stack, Tag, Text } from "degen";
import React from "react";
import { MemberDetails } from "./RetroMembers";

type Props = {
  memberStats: MemberDetails[];
  details: MemberDetails;
  index: number;
  setMemberStats: (memberStats: MemberDetails[]) => void;
};

export default function MemberRow({
  details,
  setMemberStats,
  index,
  memberStats,
}: Props) {
  const { getMemberDetails } = useModalOptions();
  return (
    <Box>
      <Stack direction="horizontal" align="center" justify="space-between">
        <CheckBox
          isChecked={details.isChecked}
          onClick={() => {
            const newMemberStats = [...memberStats];
            newMemberStats[index].isChecked = !newMemberStats[index].isChecked;
            newMemberStats[index].canGive = newMemberStats[index].isChecked;
            newMemberStats[index].canReceive = newMemberStats[index].isChecked;
            setMemberStats(newMemberStats);
          }}
        />
        <Box width="1/4">
          <Stack direction="horizontal" align="center" space="2">
            <Avatar
              src={getMemberDetails(details.member)?.avatar}
              address={getMemberDetails(details.member)?.ethAddress}
              label=""
              size="9"
            />
            <Text weight="semiBold" ellipsis>
              {getMemberDetails(details.member)?.username}
            </Text>
          </Stack>
        </Box>
        <Box width="1/3">
          <Stack direction="horizontal">
            <Box
              cursor={details.isChecked ? "pointer" : "not-allowed"}
              onClick={() => {
                if (details.isChecked) {
                  const newMemberStats = [...memberStats];
                  newMemberStats[index].canGive =
                    !newMemberStats[index].canGive;
                  setMemberStats(newMemberStats);
                }
              }}
            >
              <Tag
                hover={details.isChecked}
                tone={details.canGive ? "accent" : "secondary"}
              >
                Can Give
              </Tag>
            </Box>
            <Box
              cursor={details.isChecked ? "pointer" : "not-allowed"}
              onClick={() => {
                if (details.isChecked) {
                  const newMemberStats = [...memberStats];
                  newMemberStats[index].canReceive =
                    !newMemberStats[index].canReceive;
                  setMemberStats(newMemberStats);
                }
              }}
            >
              <Tag
                hover={details.isChecked}
                tone={details.canReceive ? "accent" : "secondary"}
              >
                Can Receive
              </Tag>
            </Box>
          </Stack>
        </Box>
        <Input
          label=""
          type="number"
          units="votes"
          placeholder="100"
          width="1/4"
          value={details.allocation}
          onChange={(e) => {
            const newMemberStats = [...memberStats];
            newMemberStats[index].allocation = parseInt(e.target.value);
            setMemberStats(newMemberStats);
          }}
          disabled={!details.isChecked}
        />
      </Stack>
    </Box>
  );
}
