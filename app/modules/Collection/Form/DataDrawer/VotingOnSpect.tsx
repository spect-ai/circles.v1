import Tabs from "@/app/common/components/Tabs";
import { voteCollectionData } from "@/app/services/Collection";
import { CollectionType, MemberDetails, UserType } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpectVoting = ({
  dataId,
  col,
}: {
  dataId: string;
  col?: CollectionType;
}) => {
  const { localCollection, updateCollection } = useLocalCollection();

  const [collection, setCollection] = useState(col || localCollection);

  const router = useRouter();
  const { circle: cId } = router.query;

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [data, setData] = useState<Record<string, unknown>>();
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
    if (
      data &&
      collection.voting?.periods &&
      collection.voting?.periods[dataId] &&
      collection.voting?.periods[dataId]?.votes?.[currentUser?.id || ""] !==
        undefined
    ) {
      setVote(
        collection.voting?.periods[dataId].votes?.[
          currentUser?.id || ""
        ] as number
      );
    } else setVote(-1);
  }, [collection.voting, currentUser?.id, data, dataId]);

  const getVotes = () => {
    const dataVotes =
      collection.voting?.periods && collection.voting?.periods?.[dataId]?.votes;
    return (
      collection.voting?.periods?.[dataId]?.options?.map(
        (option, index) =>
          Object.values(dataVotes || {}).filter((vote2) => vote2 === index)
            .length
      ) || []
    );
  };

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const getMemberDetails = React.useCallback(
    (id: string) => memberDetails?.memberDetails[id],
    [memberDetails]
  );

  return (
    <Box display="flex" flexDirection="column" gap="2">
      {data &&
        collection.voting?.periods &&
        collection.voting?.periods[data.slug as string] &&
        (collection.voting?.periods[data.slug as string].active ||
          Object.keys(collection.voting?.periods[dataId]?.votes || {})?.length >
            0) &&
        collection.voting?.periods[data.slug as string].options && (
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
                    collection.voting?.periods[
                      data.slug as string
                    ].options?.map((option) => option.label) || []
                  }
                  selectedTab={vote}
                  onTabClick={async (tab) => {
                    if (
                      !collection?.voting?.periods?.[data.slug as string]
                        ?.active
                    ) {
                      toast.error("Voting is not active");
                      return;
                    }
                    const tempTab = tab;
                    setVote(tab);
                    const res = await voteCollectionData(
                      collection.id,
                      dataId,
                      tab
                    );
                    if (!res.id) {
                      toast.error("Something went wrong");
                      setVote(tempTab);
                    } else {
                      col ? setCollection(res) : updateCollection(res);
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

      {data &&
        collection.voting?.periods &&
        collection.voting?.periods[data.slug as string] &&
        collection.voting?.periods[data.slug as string].options &&
        collection.voting?.periods[data.slug as string].votes &&
        collection.voting?.periods[data.slug as string].votes?.[
          currentUser?.id || ""
        ] !== undefined && (
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
                labels: collection.voting?.periods[
                  data.slug as string
                ]?.options?.map((option) => option.label),
                datasets: [
                  {
                    label: "Votes",
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
      {data &&
        collection.voting?.periods &&
        Object.keys(
          collection.voting?.periods[data.slug as string]?.votes || {}
        ).length > 0 &&
        collection.voting?.periods[data.slug as string]?.votesArePublic && (
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

            {data &&
              collection.voting?.periods &&
              collection.voting?.periods[data.slug as string] &&
              Object.entries(
                collection.voting?.periods[data.slug as string]?.votes || {}
              ).map(([voterId, vote2]) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  key={voterId}
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
                      href={`/profile/${getMemberDetails(voterId)?.username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Stack direction="horizontal" align="center" space="2">
                        <Avatar
                          src={getMemberDetails(voterId)?.avatar}
                          address={getMemberDetails(voterId)?.ethAddress}
                          label=""
                          size="8"
                        />
                        <Text color="accentText" weight="semiBold">
                          {getMemberDetails(voterId)?.username}
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
                      collection?.voting?.periods[data.slug as string]
                        ? collection?.voting?.periods[data.slug as string]
                            ?.options?.[vote2]?.label
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
                      {collection?.voting?.votesAreWeightedByTokens
                        ? `${1} votes`
                        : "1 vote"}
                    </Text>
                  </Box>
                </Box>
              ))}
          </Box>
        )}
    </Box>
  );
};

export default SpectVoting;
