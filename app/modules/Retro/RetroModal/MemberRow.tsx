import Loader from "@/app/common/components/Loader";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { Avatar, Box, Input, Stack, Text } from "degen";
import React from "react";
import { useCircle } from "../../Circle/CircleContext";
import Feedback from "./Feedback";
import ClickableAvatar from "@/app/common/components/Avatar";

type Props = {
  retroId: string;
  member: string;
  votesGiven: { [key: string]: number } | undefined;
  setVotesGiven: (votesGiven: { [key: string]: number }) => void;
  votesRemaining: number | undefined;
  handleVotesRemaining: (memberId: string, newVoteVal: number) => void;
  feedbackGiven: string;
  feedbackReceived: string;
};

export default function MemberRow({
  retroId,
  member,
  votesGiven,
  setVotesGiven,
  votesRemaining,
  handleVotesRemaining,
  feedbackGiven,
  feedbackReceived,
}: Props) {
  const { getMemberDetails } = useModalOptions();
  const { retro } = useCircle();

  if (!retro) {
    return <Loader loading text="" />;
  }

  return (
    <Box>
      <Stack direction="horizontal" align="center" justify="space-between">
        <Box width="1/4">
          <Stack direction="horizontal" align="center" space="2">
            <ClickableAvatar
              src={getMemberDetails(member)?.avatar as string}
              address={getMemberDetails(member)?.ethAddress}
              label=""
              size="9"
              userId={getMemberDetails(member)?.id as string}
              username={getMemberDetails(member)?.username as string}
            />
            <Text weight="semiBold" ellipsis>
              {getMemberDetails(member)?.username}
            </Text>
          </Stack>
        </Box>
        <Box width="1/3">
          <Feedback
            member={member}
            retroId={retroId}
            feedback={retro.status.active ? feedbackGiven : feedbackReceived}
          />
        </Box>
        {retro.status.active ? (
          <Input
            label=""
            type="number"
            units="votes"
            placeholder="5"
            width="1/4"
            value={votesGiven && votesGiven[member]}
            error={(votesRemaining || 0) < 0}
            onChange={(e) => {
              if (e.target.value) {
                const newVotesGiven = { ...votesGiven };
                newVotesGiven[member] = parseInt(e.target.value);
                setVotesGiven(newVotesGiven);
                handleVotesRemaining(member, parseInt(e.target.value));
              }
            }}
          />
        ) : (
          <Box width="1/4">
            <Text weight="semiBold" size="large" align="left">
              {votesGiven && votesGiven[member]}
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
