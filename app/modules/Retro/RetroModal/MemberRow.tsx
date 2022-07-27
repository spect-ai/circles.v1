import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { RetroType } from "@/app/types";
import { Avatar, Box, Input, Stack, Tag, Text } from "degen";
import React from "react";
import { MemberDetails } from ".";
import Feedback from "./Feedback";

type Props = {
  retroId: string;
  details: MemberDetails;
  votesGiven: { [key: string]: number };
  setVotesGiven: (votesGiven: { [key: string]: number }) => void;
  votesRemaining: number;
  handleVotesRemaining: (memberId: string, newVoteVal: number) => void;
  feedbackGiven: { [key: string]: string };
  setRetro: (retro: RetroType) => void;
};

export default function MemberRow({
  retroId,
  details,
  votesGiven,
  setVotesGiven,
  votesRemaining,
  handleVotesRemaining,
  feedbackGiven,
  setRetro,
}: Props) {
  const { getMemberDetails } = useModalOptions();
  console.log({ votesGiven });
  return (
    <Box>
      <Stack direction="horizontal" align="center" justify="space-between">
        <Box width="1/4">
          <Stack direction="horizontal" align="center" space="2">
            <Avatar
              src={getMemberDetails(details.owner)?.avatar}
              address={getMemberDetails(details.owner)?.ethAddress}
              label=""
              size="9"
            />
            <Text weight="semiBold" ellipsis>
              {getMemberDetails(details.owner)?.username}
            </Text>
          </Stack>
        </Box>
        <Box width="1/3">
          <Feedback
            memberDetails={details}
            retroId={retroId}
            feedbackGiven={feedbackGiven}
            setRetro={setRetro}
          />
        </Box>
        <Input
          label=""
          type="number"
          units="votes"
          placeholder="5"
          width="1/4"
          value={votesGiven[details.owner]}
          error={votesRemaining < 0}
          onChange={(e) => {
            if (e.target.value) {
              const newVotesGiven = { ...votesGiven };
              newVotesGiven[details.owner] = parseInt(e.target.value);
              setVotesGiven(newVotesGiven);
              handleVotesRemaining(details.owner, parseInt(e.target.value));
            }
          }}
        />
      </Stack>
    </Box>
  );
}
