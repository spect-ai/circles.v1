import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { addVotes, endRetro } from "@/app/services/Retro";
import { Box, Stack, Text } from "degen";
import React, { useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import MemberRow from "./MemberRow";

type Props = {
  handleClose: () => void;
};

export type MemberDetails = {
  owner: string;
  canGive: boolean;
  canReceive: boolean;
  votesAllocated: number;
  votesGiven: {
    [key: string]: number;
  };
  votesRemaining: number;
};

export default function RetroModal({ handleClose }: Props) {
  const { connectedUser } = useGlobal();
  const { retro, setRetro } = useCircle();
  const [votesGiven, setVotesGiven] = useState(
    retro.stats[connectedUser]?.votesGiven
  );
  const [votesRemaining, setVotesRemaining] = useState(
    retro.stats[connectedUser]?.votesRemaining
  );

  const handleVotesRemaining = React.useCallback(
    (memberId: string, newVoteVal: number) => {
      if (newVoteVal) {
        if (retro.strategy === "Quadratic Voting") {
          // let tempReceived = votesRemaining;
          // const val = newVoteVal || 0;
          // tempReceived = tempReceived - val ** 2 + votesGiven[memberId] ** 2;
          // setVotesRemaining(tempReceived);
          let totalVotesGiven = 0;
          for (const member in votesGiven) {
            if (member !== memberId) {
              totalVotesGiven += votesGiven[member] ** 2;
            }
          }
          setVotesRemaining(
            retro.stats[connectedUser].votesAllocated -
              totalVotesGiven -
              newVoteVal ** 2
          );
        } else {
          let totalVotesGiven = 0;
          for (const member in votesGiven) {
            if (member !== memberId) {
              totalVotesGiven += votesGiven[member];
            }
          }
          setVotesRemaining(
            retro.stats[connectedUser].votesAllocated -
              totalVotesGiven -
              newVoteVal
          );
        }
      }
    },
    [connectedUser, retro.stats, retro.strategy, votesGiven]
  );
  return (
    <Modal handleClose={handleClose} title={retro.title} size="large">
      <Box
        padding="8"
        style={{
          maxHeight: "calc(100vh - 8rem)",
        }}
      >
        <Stack>
          <Text weight="semiBold" size="large">
            {retro.description}
          </Text>
          <Box>
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <Box width="1/4">
                <Text variant="label">Member</Text>
              </Box>
              <Box width="1/3">
                <Text variant="label">Feedback</Text>
              </Box>
              <Box width="1/4">
                <Stack direction="horizontal">
                  <Text variant="label">Votes Given</Text>
                </Stack>
              </Box>
            </Stack>
          </Box>
          {retro.members?.map((member) => {
            if (retro.stats[member].canReceive && connectedUser !== member) {
              return (
                <MemberRow
                  key={retro.stats[member].owner}
                  details={retro.stats[member]}
                  votesGiven={votesGiven}
                  setVotesGiven={setVotesGiven}
                  votesRemaining={votesRemaining}
                  handleVotesRemaining={handleVotesRemaining}
                  feedbackGiven={
                    retro.feedbackGiven && retro.feedbackGiven[connectedUser]
                  }
                  retroId={retro.id}
                  setRetro={setRetro}
                />
              );
            }
          })}
          <Stack direction="horizontal" justify="space-between">
            <Box />
            <Text variant="label">Remaining Votes: {votesRemaining}</Text>
          </Stack>
          <Stack direction="horizontal">
            <Box width="full">
              <PrimaryButton
                onClick={async () => {
                  const res = await addVotes(retro.id, {
                    votes: votesGiven,
                  });
                  if (res) {
                    handleClose();
                  }
                }}
              >
                Save Votes
              </PrimaryButton>
            </Box>
            <Box width="full">
              <PrimaryButton
                variant="tertiary"
                onClick={async () => {
                  const res = await endRetro(retro.id);
                  if (res) {
                    handleClose();
                  }
                }}
              >
                End Retro
              </PrimaryButton>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
