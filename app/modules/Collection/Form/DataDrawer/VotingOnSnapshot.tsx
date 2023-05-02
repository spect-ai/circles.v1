import Tabs from "@/app/common/components/Tabs";
import { MemberDetails, UserType } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { useQuery as useApolloQuery, gql } from "@apollo/client";
import { useAccount } from "wagmi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useSnapshot from "@/app/services/Snapshot/useSnapshot";
import { useLocation } from "react-use";
import { smartTrim } from "@/app/common/utils/utils";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useCircle } from "@/app/modules/Circle/CircleContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Vote {
  voter: string;
  vp: number;
  choice: number;
}

export const Votes = gql`
  query Votes($proposal: String!) {
    votes(where: { proposal: $proposal }) {
      voter
      vp
      choice
    }
  }
`;

export const UserVote = gql`
  query Votes($proposal: String!, $voter: String!) {
    votes(where: { proposal: $proposal, voter: $voter }) {
      voter
      vp
      choice
    }
  }
`;

export const Proposal = gql`
  query Proposal($proposal: String!) {
    proposal(id: $proposal) {
      id
      title
      end
      snapshot
      state
      scores
      scores_by_strategy
      scores_total
      choices
    }
  }
`;

export default function SnapshotVoting({
  dataId,
  proposalId,
}: {
  dataId?: string;
  proposalId?: string;
}) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { address } = useAccount();
  const { circle } = useCircle();

  const { castVote } = useSnapshot();
  const { hostname } = useLocation();

  const router = useRouter();
  const { dataId: dataSlug, circle: cId } = router.query;

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const proposal = proposalId
    ? proposalId
    : collection?.voting?.snapshot?.[dataId as string]?.proposalId;

  const {
    data: votesData,
    refetch: refetchVotes,
    loading: votesLoading,
  } = useApolloQuery(Votes, {
    variables: { proposal: proposal },
  });

  const {
    data: proposalData,
    refetch: refetchProposal,
    loading: proposalLoading,
  } = useApolloQuery(Proposal, {
    variables: { proposal: proposal },
  });

  const {
    data: userVotes,
    refetch: refetchUserChoices,
    loading: userVotesLoading,
  } = useApolloQuery(UserVote, {
    variables: { proposal: proposal, voter: currentUser?.ethAddress },
  });

  const [data, setData] = useState({} as any);
  const [vote, setVote] = useState(-1);

  useEffect(() => {
    if (dataId && collection.data) {
      setData({});
      setTimeout(() => {
        setData(collection?.data?.[dataId]);
      }, 0);
    }
  }, [collection?.data, dataId]);

  useEffect(() => {
    refetchVotes();
    refetchProposal();
    refetchUserChoices();
    if (
      userVotes &&
      userVotes?.votes &&
      userVotes?.votes?.[0]?.voter.toLowerCase() ===
        currentUser?.ethAddress.toLowerCase()
    ) {
      setVote(userVotes?.votes?.[0]?.choice - 1);
    } else setVote(-1);
  }, [userVotes, currentUser?.id, data, dataId, vote]);

  const getVotes = () => {
    const res =
      proposalData.proposal.choices.map((choices: string, index: number) => {
        return votesData?.votes?.filter(
          (vote: any) => vote.choice - 1 === index
        ).length;
      }) || [];
    return res;
  };

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const getMemberDetailsUsingEthAddress = React.useCallback(
    (ethAddress: string) => {
      return Object.values(
        (memberDetails as MemberDetails)?.memberDetails as any
      )?.filter(
        (member: any) =>
          member?.ethAddress.toLowerCase() === ethAddress.toLowerCase()
      );
    },
    [memberDetails]
  );

  const hub = hostname?.startsWith("circles")
    ? "https://snapshot.org"
    : "https://demo.snapshot.org";

  return (
    <Box display="flex" flexDirection="column" gap="2">
      <Box
        onClick={() => {
          window.open(`${hub}/#/${circle?.snapshot?.id}/proposal/${proposal}`);
        }}
        cursor="pointer"
        display="flex"
        flexDirection={"row"}
        alignItems={"center"}
        gap="2"
      >
        <Text variant="large" color={"accent"} weight={"semiBold"}>
          Go to Snapshot
        </Text>
        <ArrowUpOutlined
          rotate={45}
          style={{ color: "rgb(191, 90, 242, 1)", fontSize: "1rem" }}
        />
      </Box>
      {!votesLoading &&
        !proposalLoading &&
        !userVotesLoading &&
        (proposalId ||
          (collection.voting?.snapshot &&
            collection.voting?.snapshot?.[data.slug]?.proposalId)) && (
          <>
            {(proposalData?.proposal?.state !== "closed" ||
              votesData?.votes?.length > 0) && (
              <Stack space="1">
                <Box
                  borderColor="foregroundSecondary"
                  borderWidth="0.375"
                  padding="2"
                  borderRadius="medium"
                  width={"80"}
                >
                  <Text weight="semiBold" variant="large" color="accent">
                    Your Vote
                  </Text>
                  <Box marginTop="4">
                    <Tabs
                      tabs={proposalData && proposalData?.proposal?.choices}
                      selectedTab={vote}
                      onTabClick={async (tab) => {
                        if (!address) {
                          toast.error("Please unlock your wallet");
                          return;
                        }
                        if (
                          address.toLowerCase() !==
                          currentUser?.ethAddress.toLowerCase()
                        ) {
                          toast.error(
                            "Please switch to the account you have connected with Spect"
                          );
                          return;
                        }
                        if (
                          !collection?.voting?.snapshot?.[data.slug]
                            ?.proposalId &&
                          !proposalId
                        )
                          return;
                        if (proposalData?.proposal?.state == "closed") {
                          toast.error("Voting window is closed");
                          return;
                        }
                        const tempTab = tab;
                        const res: any = await castVote(
                          collection?.voting?.snapshot?.[data.slug]
                            ?.proposalId || (proposalId as string),
                          tempTab + 1
                        );
                        if (res.id) {
                          setVote(tempTab);
                          toast.success("Vote casted successfully");
                        } else {
                          toast.error(
                            "Couldn't cast vote : " +
                              res?.error +
                              " " +
                              res?.error_description
                          );
                        }
                      }}
                      orientation="horizontal"
                      unselectedColor="transparent"
                      selectedColor="secondary"
                    />
                  </Box>
                </Box>
              </Stack>
            )}

            {proposalData && proposalData.proposal.choices.length > 0 && (
              <Box
                width={{
                  xs: "full",
                  md: "full",
                }}
                height={{
                  xs: "32",
                  md: "48",
                }}
                borderColor="foregroundSecondary"
                borderWidth="0.375"
                padding="2"
                borderRadius="medium"
              >
                <Text weight="semiBold" variant="large" color="accent">
                  Results
                </Text>
                <Bar
                  options={{
                    indexAxis: "y",
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    responsive: true,
                    // maintainAspectRatio: false,
                    scales: {
                      y: {
                        ticks: {
                          color: "rgb(191,90,242,0.8)",
                        },
                      },
                      x: {
                        beginAtZero: true,

                        ticks: {
                          stepSize: 1,
                          color: "rgb(191,90,242,0.8)",
                        },
                      },
                    },
                  }}
                  data={{
                    labels: proposalData.proposal.choices,
                    datasets: [
                      {
                        label: " Votes ",
                        data: getVotes(),
                        backgroundColor: "rgb(191,90,242, 0.1)",
                        borderColor: "rgb(191,90,242,0.1)",
                        borderWidth: 1,
                        borderRadius: 5,
                        barPercentage: 0.5,
                      },
                    ],
                  }}
                />
              </Box>
            )}
            {votesData?.votes?.length > 0 && (
              <Box
                borderColor="foregroundSecondary"
                borderWidth="0.375"
                padding="2"
                borderRadius="medium"
                marginTop="8"
              >
                <Text weight="semiBold" variant="large" color="accent">
                  Votes
                </Text>

                {votesData?.votes?.map((vote: Vote) => {
                  const user: any = getMemberDetailsUsingEthAddress(
                    vote.voter
                  )?.[0];

                  return (
                    <Box
                      display="flex"
                      flexDirection="row"
                      key={vote.voter}
                      marginTop="4"
                      gap="4"
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        width="1/3"
                        alignItems="center"
                      >
                        <a
                          href={`/profile/${
                            user?.username == undefined
                              ? "fren"
                              : user?.username
                          }`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Stack
                            direction="horizontal"
                            align="center"
                            space="2"
                          >
                            <Avatar
                              src={user?.avatar}
                              address={vote.voter}
                              label=""
                              size="8"
                            />
                            <Text color="accentText" weight="semiBold">
                              {user?.username == undefined
                                ? smartTrim(vote.voter, 5)
                                : user?.username}
                            </Text>
                          </Stack>
                        </a>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        width="1/3"
                        alignItems="center"
                      >
                        <Text variant="base" weight="semiBold">
                          {proposalData.proposal.choices?.[vote.choice - 1] ||
                            "No vote"}
                        </Text>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        width="1/3"
                        alignItems="center"
                      >
                        <Text variant="base" weight="semiBold">
                          {vote.vp.toFixed(1) + " " + circle?.snapshot?.symbol}
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </>
        )}
    </Box>
  );
}
