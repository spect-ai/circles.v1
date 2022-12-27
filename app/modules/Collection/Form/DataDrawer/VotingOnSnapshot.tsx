import Tabs from "@/app/common/components/Tabs";
import { endVotingPeriod, voteCollectionData } from "@/app/services/Collection";
import { MemberDetails, UserType } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { useQuery as useApolloQuery, gql } from "@apollo/client";

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
    }
  }
`;

export default function SnapshotVoting({ dataId }: { dataId: string }) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const { castVote } = useSnapshot();
  const { hostname } = useLocation();

  const router = useRouter();
  const { dataId: dataSlug, circle: cId } = router.query;

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const proposal = collection?.voting?.periods?.[dataId]?.snapshot?.proposalId;

  const { data: votesData, refetch: refetchVotes } = useApolloQuery(Votes, {
    variables: { proposal: proposal },
  });

  const { data: proposalData, refetch: refetchProposal } = useApolloQuery(
    Proposal,
    {
      variables: { proposal: proposal },
    }
  );

  const { data: userVotes, refetch: refetchUserChoices } = useApolloQuery(
    UserVote,
    {
      variables: { proposal: proposal, voter: currentUser?.ethAddress },
    }
  );

  const [data, setData] = useState({} as any);
  const [vote, setVote] = useState(-1);

  useEffect(() => {
    if (dataId && collection.data) {
      setData({});
      setTimeout(() => {
        setData(collection?.data[dataId]);
      }, 0);
    }
  }, [collection?.data, dataId]);

  useEffect(() => {
    refetchVotes();
    refetchProposal();
    refetchUserChoices();
    if (
      proposalData?.proposal?.state === "closed" &&
      collection?.voting?.periods?.[data.slug]?.active
    ) {
      const endVoting = async () => {
        const res = await endVotingPeriod(collection.id, dataId);
        if (!res.id) {
          toast.error("Something went wrong");
        } else updateCollection(res);
      };
      endVoting();
    }
    if (
      userVotes &&
      userVotes?.votes &&
      userVotes?.votes?.[0]?.voter.toLowerCase() == currentUser?.ethAddress
    ) {
      setVote(userVotes?.votes?.[0]?.choice - 1);
    } else setVote(-1);
  }, [userVotes, currentUser?.id, data, dataId, vote]);

  const getVotes = () => {
    const res =
      collection.voting?.periods?.[dataId]?.options?.map((option, index) => {
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
          window.open(
            `${hub}/#/${collection?.voting?.snapshot?.id}/proposal/${proposal}`
          );
        }}
        cursor="pointer"
      >
        <Text variant="large" color={"accent"} weight={"semiBold"}>
          {proposalData?.proposal?.title}
        </Text>
      </Box>

      {collection.voting?.periods &&
        collection.voting?.periods[data.slug] &&
        (proposalData?.proposal?.state !== "closed" ||
          votesData?.votes?.length > 0) &&
        collection.voting?.periods[data.slug].options && (
          <Stack space="1">
            <Box
              borderColor="foregroundSecondary"
              borderWidth="0.375"
              padding="2"
              borderRadius="medium"
            >
              <Text weight="semiBold" variant="large" color="accent">
                Your Vote
              </Text>
              <Text>{collection.voting?.message}</Text>
              <Box marginTop="4">
                <Tabs
                  tabs={
                    collection.voting?.periods[data.slug].options?.map(
                      (option) => option.label
                    ) || []
                  }
                  selectedTab={vote}
                  onTabClick={async (tab) => {
                    if (
                      !collection?.voting?.periods?.[data.slug]?.active ||
                      !collection?.voting?.periods?.[data.slug]?.snapshot
                        ?.proposalId
                    )
                      return;
                    if (proposalData?.proposal?.state == "closed") {
                      toast.error("Voting window is closed");
                      return;
                    }
                    const tempTab = tab;
                    console.log(tempTab);
                    const res: any = await castVote(
                      collection?.voting?.periods?.[data.slug].snapshot
                        ?.proposalId as string,
                      tempTab + 1
                    );
                    if (res.id) {
                      setVote(tempTab);
                      toast.success("Vote casted successfully");
                    } else {
                      toast.error("Vote cast failed : " + res?.error);
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

      {collection.voting?.periods &&
        collection.voting?.periods[data.slug] &&
        collection.voting?.periods[data.slug].options && (
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
                maintainAspectRatio: false,
                scales: {
                  y: {
                    ticks: {
                      color: "rgb(191,90,242,0.8)",
                    },
                    grid: {
                      borderColor: "rgb(191,90,242,0.2)",
                    },
                  },
                  x: {
                    beginAtZero: true,

                    grid: {
                      borderColor: "rgb(191,90,242,0.2)",
                    },
                    ticks: {
                      stepSize: 1,
                      color: "rgb(191,90,242,0.8)",
                    },
                  },
                },
              }}
              data={{
                labels: collection.voting?.periods[data.slug]?.options?.map(
                  (option) => option.label
                ),
                datasets: [
                  {
                    label: " Votes ",
                    data: getVotes(),
                    backgroundColor: "rgb(191,90,242, 0.2)",
                    borderColor: "rgb(191,90,242)",
                    borderWidth: 1,
                    borderRadius: 5,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
          </Box>
        )}
      {collection.voting?.periods &&
        votesData?.votes?.length > 0 &&
        collection.voting?.periods[data.slug]?.votesArePublic && (
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

            {collection.voting?.periods &&
              votesData?.votes?.map((vote: Vote) => {
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
                          user?.username == undefined ? "fren" : user?.username
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Stack direction="horizontal" align="center" space="2">
                          <Avatar
                            src={user?.avatar}
                            address={vote.voter}
                            label=""
                            size="8"
                          />
                          <Text color="accentText" weight="semiBold">
                            {user?.username == undefined
                              ? "fren"
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
                        {collection?.voting?.periods &&
                        collection?.voting?.periods[data.slug]
                          ? collection?.voting?.periods[data.slug]?.options?.[
                              vote.choice - 1
                            ]?.label
                          : "No vote"}
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      width="1/3"
                      alignItems="center"
                    >
                      <Text variant="base" weight="semiBold">
                        {vote.vp.toFixed(1) +
                          " " +
                          collection?.voting?.snapshot?.symbol}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        )}
    </Box>
  );
}
