/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer, { slideHorizontal } from "@/app/common/components/Drawer";
import { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { sendFormComment, voteCollectionData } from "@/app/services/Collection";
import { UserType } from "@/app/types";
import { SendOutlined } from "@ant-design/icons";
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
  const [comment, setComment] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [vote, setVote] = useState(-1);

  const [sendingComment, setSendingComment] = useState(false);

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

  // if (!isOpen) return null;

  // if (!dataId || !data) return null;

  return (
    <Drawer
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
          <ScrollContainer paddingX="8" paddingY="2">
            <Stack space="5">
              <a
                href={`/profile/${
                  collection.profiles[collection.dataOwner[data.slug]].username
                }`}
                target="_blank"
                rel="noreferrer"
              >
                <Stack direction="horizontal" align="center" space="4">
                  <Avatar
                    src={
                      collection.profiles[collection.dataOwner[data.slug]]
                        .avatar
                    }
                    label=""
                    size="10"
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
                  md: "14",
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
                        <Text
                          weight="semiBold"
                          variant="extraLarge"
                          color="accent"
                        >
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
                      <Text
                        weight="semiBold"
                        variant="extraLarge"
                        color="accent"
                      >
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
            <Stack>
              <Stack direction="horizontal">
                <Avatar
                  label=""
                  placeholder={!currentUser?.avatar}
                  src={currentUser?.avatar}
                  address={currentUser?.ethAddress}
                  size="10"
                />
                <Box width="full" gap="2" marginBottom="4">
                  <Editor
                    placeholder="Write a reply..."
                    value={comment}
                    onSave={(value) => {
                      setComment(value);
                    }}
                    isDirty={isDirty}
                    setIsDirty={setIsDirty}
                  />
                  {isDirty && currentUser && (
                    <Box width="1/4">
                      <PrimaryButton
                        loading={sendingComment}
                        icon={<SendOutlined style={{ fontSize: "1.3rem" }} />}
                        onClick={async () => {
                          setSendingComment(true);
                          const res = await sendFormComment(
                            collection.id,
                            dataId,
                            comment,
                            {
                              actor: {
                                id: currentUser.id,
                                refType: "user",
                              },
                            }
                          );
                          if (res.id) {
                            console.log({ res });
                            updateCollection(res);
                            setComment("");
                            setIsDirty(false);
                          } else toast.error("Something went wrong");
                          setSendingComment(false);
                        }}
                      >
                        Send
                      </PrimaryButton>
                    </Box>
                  )}
                </Box>
              </Stack>
              <DataActivity
                activities={collection.dataActivities[dataId]}
                activityOrder={collection.dataActivityOrder[dataId]}
              />
            </Stack>
          </ScrollContainer>
        </motion.div>
      )}
    </Drawer>
  );
}

const ScrollContainer = styled(Box)`
  height: calc(100vh - 5rem);
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
    border-radius: 0rem;
  }
`;
