import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { addVotes, endRetro } from "@/app/services/Retro";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { RetroType } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Heading, IconClose, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { retroSlug } = router.query;
  const { canDo } = useRoleGate();
  const { setIsBatchPayOpen } = useCircle();

  const {
    data: retro,
    refetch: fetchRetro,
    isLoading,
  } = useQuery<RetroType>(
    ["retro", retroSlug],
    () =>
      fetch(`${process.env.API_HOST}/retro/slug/${retroSlug as string}`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  const [votesGiven, setVotesGiven] = useState({} as any);
  const [votesRemaining, setVotesRemaining] = useState(0);

  useEffect(() => {
    if (retroSlug) {
      if (connectedUser) {
        void fetchRetro();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }
    }
  }, [retroSlug]);

  useEffect(() => {
    if (retro) {
      console.log({ retro });
      setVotesGiven(retro.stats[connectedUser]?.votesGiven);
      setVotesRemaining(retro.stats[connectedUser]?.votesRemaining);
    }
  }, [connectedUser, retro]);

  const handleVotesRemaining = React.useCallback(
    (memberId: string, newVoteVal: number) => {
      if (retro) {
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
      }
    },
    [connectedUser, retro, votesGiven]
  );

  if (!retro || isLoading) {
    return <Loader loading text="" />;
  }

  return (
    <Modal handleClose={handleClose} title={retro.title} size="large">
      {retro.members.includes(connectedUser) ? (
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
              if (
                (retro.status.active &&
                  retro.stats[member]?.canReceive &&
                  connectedUser !== member) ||
                (!retro.status.active && connectedUser !== member)
              ) {
                return (
                  <MemberRow
                    key={member}
                    member={member}
                    votesGiven={votesGiven}
                    setVotesGiven={setVotesGiven}
                    votesRemaining={votesRemaining}
                    handleVotesRemaining={handleVotesRemaining}
                    feedbackGiven={
                      retro.feedbackGiven && retro.feedbackGiven[member]
                    }
                    feedbackReceived={
                      retro.feedbackReceived && retro.feedbackReceived[member]
                    }
                    retroId={retro.id}
                  />
                );
              }
            })}
            <Stack direction="horizontal" justify="space-between">
              <Box />
              {retro.status.active && (
                <Text variant="label">Remaining Votes: {votesRemaining}</Text>
              )}
            </Stack>
            <Stack direction="horizontal">
              <Box width="full">
                {retro.status.active && (
                  <PrimaryButton
                    icon={<SaveOutlined style={{ fontSize: "1.3rem" }} />}
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      const res = await addVotes(retro.id, {
                        votes: votesGiven,
                      });
                      console.log({ res });
                      setLoading(false);
                      if (res) {
                        handleClose();
                      }
                    }}
                  >
                    Save
                  </PrimaryButton>
                )}
              </Box>
              <Box width="full">
                {retro.status.active && canDo(["steward"]) && (
                  <PrimaryButton
                    icon={<IconClose />}
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
                )}
                {!retro.status.active &&
                  !retro.status.paid &&
                  canDo(["steward"]) && (
                    <PrimaryButton
                      onClick={() => {
                        handleClose();
                        setIsBatchPayOpen(true);
                      }}
                    >
                      Payout
                    </PrimaryButton>
                  )}
              </Box>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack align="center" justify="center">
          <Box marginTop="4" />
          <Text variant="label">You are not a member of this retro</Text>
        </Stack>
      )}
    </Modal>
  );
}
