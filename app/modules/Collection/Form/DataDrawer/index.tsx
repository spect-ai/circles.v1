/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer, { slideHorizontal } from "@/app/common/components/Drawer";
import { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Tabs from "@/app/common/components/Tabs";
import { voteCollectionData } from "@/app/services/Collection";
import { MemberDetails, UserType } from "@/app/types";
import { Avatar, Box, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DataActivity from "./DataActivity";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type props = {
  expandedDataSlug: string;
  setExpandedDataSlug: React.Dispatch<React.SetStateAction<string>>;
};

export default function DataDrawer({
  expandedDataSlug: dataId,
  setExpandedDataSlug,
}: props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const router = useRouter();
  const { dataId: dataSlug, circle: cId } = router.query;

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [data, setData] = useState({} as any);
  const [vote, setVote] = useState(-1);

  useEffect(() => {
    if (dataId) {
      setData({});
      setTimeout(() => {
        setData(collection?.data[dataId]);
      }, 0);
    }
  }, [collection?.data, dataId]);

  useEffect(() => {
    if (
      data &&
      collection.voting.votes &&
      collection.voting.votes[dataId] &&
      collection.voting.votes[dataId][currentUser?.id || ""] !== undefined
    ) {
      setVote(collection.voting.votes[dataId][currentUser?.id || ""]);
    } else setVote(-1);
  }, [collection.voting, currentUser?.id, data, dataId]);

  const getVotes = () => {
    const dataVotes =
      collection.voting.votes && collection.voting.votes[dataId];
    // sump up all the votes for each option
    return (
      collection.voting?.options?.map((option, index) => {
        return Object.values(dataVotes || {}).filter((vote) => vote === index)
          .length;
      }) || []
    );
  };

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const getMemberDetails = React.useCallback(
    (id: string) => {
      return memberDetails?.memberDetails[id];
    },
    [memberDetails]
  );

  return (
    <Drawer
      title={collection.name}
      handleClose={async () => {
        setExpandedDataSlug("");
        dataSlug && (await router.push(`/${cId}/r/${collection.slug}`));
      }}
    >
      {Object.keys(data).length !== 0 && (
        <motion.div
          variants={slideHorizontal}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ScrollContainer paddingX="4" paddingY="2">
            <Stack space="5">
              <a
                href={`/profile/${
                  collection.profiles[collection.dataOwner[data.slug]].username
                }`}
                target="_blank"
                rel="noreferrer"
              >
                <Stack direction="horizontal" align="center" space="2">
                  <Avatar
                    src={
                      collection.profiles[collection.dataOwner[data.slug]]
                        .avatar
                    }
                    label=""
                    size="8"
                  />
                  <Text color="accentText" weight="semiBold">
                    {
                      collection.profiles[collection.dataOwner[data.slug]]
                        .username
                    }
                  </Text>
                </Stack>
              </a>
              <Box
                marginLeft={{
                  xs: "0",
                  md: "10",
                }}
                marginTop={{
                  xs: "0",
                  md: "-4",
                }}
              >
                <Stack>
                  {collection.propertyOrder.map((propertyName: string) => {
                    const property = collection.properties[propertyName];
                    return (
                      <Stack key={property.name} space="1">
                        <Text weight="bold" variant="extraLarge" color="accent">
                          {property.name}
                        </Text>
                        {property?.type === "shortText" && (
                          <Text>{data[property.name]}</Text>
                        )}
                        {property?.type === "ethAddress" && (
                          <Text ellipsis>{data[property.name]}</Text>
                        )}
                        {property?.type === "email" && (
                          <Text>{data[property.name]}</Text>
                        )}
                        {property?.type === "longText" && (
                          <Editor value={data[property.name]} disabled />
                        )}
                        {property?.type === "singleSelect" && (
                          <Text>{data[property.name]?.label}</Text>
                        )}
                        {property?.type === "multiSelect" && (
                          <Stack space="2" direction="horizontal" wrap>
                            {data[property.name]?.map((option: OptionType) => (
                              <Tag key={option.value} tone="accent" hover>
                                {option.label}
                              </Tag>
                            ))}
                          </Stack>
                        )}
                        {property?.type === "user" && (
                          <Text>{data[property.name]?.label}</Text>
                        )}
                        {property?.type === "user[]" && (
                          <Stack
                            space="2"
                            direction="horizontal"
                            align="baseline"
                            wrap
                          >
                            {data[property.name]?.map((option: OptionType) => (
                              <Tag key={option.value} tone="accent" hover>
                                {option.label}
                              </Tag>
                            ))}
                          </Stack>
                        )}
                        {property?.type === "date" && (
                          <Text>{data[property.name]?.toString()}</Text>
                        )}
                        {property?.type === "number" && (
                          <Text>{data[property.name]}</Text>
                        )}
                        {property?.type === "reward" && (
                          <Text>
                            {data[property.name]?.value}{" "}
                            {data[property.name]?.token.label} on{" "}
                            {data[property.name]?.chain.label}
                          </Text>
                        )}
                        {property?.type === "milestone" && (
                          <Stack>
                            {data[property.name]?.map(
                              (milestone: any, index: number) => (
                                <Stack key={milestone.id} space="2">
                                  <Stack
                                    direction="horizontal"
                                    align="baseline"
                                    wrap
                                  >
                                    <Text variant="label">
                                      Milestone {index + 1}
                                    </Text>
                                    <Text weight="semiBold" color="textPrimary">
                                      {milestone.title}
                                    </Text>
                                  </Stack>
                                  <Editor
                                    value={milestone.description}
                                    disabled
                                  />
                                  <Stack
                                    direction="horizontal"
                                    align="baseline"
                                    wrap
                                  >
                                    <Text variant="label">Reward</Text>
                                    <Text weight="semiBold" color="textPrimary">
                                      {milestone.reward?.value}{" "}
                                      {milestone.reward?.token.label} on{" "}
                                      {milestone.reward?.chain.label}
                                    </Text>
                                  </Stack>
                                  <Stack
                                    direction="horizontal"
                                    align="baseline"
                                    wrap
                                  >
                                    <Text variant="label">Due date</Text>
                                    <Text weight="semiBold" color="textPrimary">
                                      {milestone.dueDate}
                                    </Text>
                                  </Stack>
                                </Stack>
                              )
                            )}
                          </Stack>
                        )}
                      </Stack>
                    );
                  })}
                  {collection.voting?.enabled && collection.voting.options && (
                    <Stack space="1">
                      <Text weight="bold" variant="extraLarge" color="accent">
                        Your Vote
                      </Text>
                      <Text>{collection.voting.message}</Text>
                      <Tabs
                        tabs={collection.voting.options.map(
                          (option) => option.label
                        )}
                        selectedTab={vote}
                        onTabClick={async (tab) => {
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
                          } else updateCollection(res);
                        }}
                        orientation="horizontal"
                        unselectedColor="transparent"
                        selectedColor="secondary"
                      />
                      {collection.voting?.enabled &&
                        collection.voting.options &&
                        collection.voting.votes &&
                        collection.voting.votes[data.slug] &&
                        collection.voting.votes[data.slug][
                          currentUser?.id || ""
                        ] !== undefined && (
                          <Box
                            width={{
                              xs: "full",
                              md: "1/2",
                            }}
                            height={{
                              xs: "32",
                              md: "48",
                            }}
                          >
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
                                labels: collection.voting.options.map(
                                  (option) => option.label
                                ),
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
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>
            <Box
              width="full"
              borderTopWidth="0.375"
              marginY="4"
              borderRadius="full"
            />
            <Box paddingBottom="8">
              <Stack>
                <DataActivity
                  activities={collection.dataActivities[dataId]}
                  activityOrder={collection.dataActivityOrder[dataId]}
                  getMemberDetails={getMemberDetails}
                  dataId={dataId}
                  collectionId={collection.id}
                />
              </Stack>
            </Box>
          </ScrollContainer>
        </motion.div>
      )}
    </Drawer>
  );
}

const ScrollContainer = styled(Box)`
  height: calc(100vh - 4rem);
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
    border-radius: 0rem;
  }
`;
