/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer, { slideHorizontal } from "@/app/common/components/Drawer";
import { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Tabs from "@/app/common/components/Tabs";
import {
  endVotingPeriod,
  startVotingPeriod,
  voteCollectionData,
} from "@/app/services/Collection";
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
import Link from "next/link";
import PrimaryButton from "@/app/common/components/PrimaryButton";

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

  console.log({ collection });

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
      collection.voting?.periods && collection.voting?.periods[dataId].votes;
    // sump up all the votes for each option
    return (
      collection.voting?.periods?.[dataId]?.options?.map((option, index) => {
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
      handleClose={async () => {
        setExpandedDataSlug("");
        dataSlug && (await router.push(`/${cId}/r/${collection.slug}`));
      }}
    >
      {!collection.voting?.periods?.[dataId]?.active && (
        <Box
          display="flex"
          flexDirection="row"
          width="full"
          justifyContent="flex-end"
          paddingRight="8"
        >
          <Box display="flex" flexDirection="column" gap="2">
            {collection.voting?.periods?.[dataId]?.votes &&
              Object.keys(collection.voting?.periods[dataId]?.votes || {})
                ?.length > 0 && <Text variant="base"> Voting has ended</Text>}
            {collection.voting?.enabled &&
              Object.keys(collection.voting?.periods?.[dataId]?.votes || {})
                ?.length === 0 && (
                <PrimaryButton
                  variant="secondary"
                  onClick={async () => {
                    const res = await startVotingPeriod(collection.id, dataId);
                    if (!res.id) {
                      toast.error("Something went wrong");
                    } else updateCollection(res);
                  }}
                >
                  Start Voting Period
                </PrimaryButton>
              )}
          </Box>
        </Box>
      )}
      {collection.voting?.enabled &&
        collection.voting?.periods &&
        collection.voting?.periods[dataId]?.active && (
          <Box
            display="flex"
            flexDirection="row"
            width="full"
            justifyContent="flex-end"
            paddingRight="8"
          >
            <Box display="flex" flexDirection="column" gap="2">
              <Text variant="base"> Voting is active</Text>
              <PrimaryButton
                variant="tertiary"
                onClick={async () => {
                  const res = await endVotingPeriod(collection.id, dataId);
                  if (!res.id) {
                    toast.error("Something went wrong");
                  } else updateCollection(res);
                }}
              >
                End Voting Period
              </PrimaryButton>
            </Box>
          </Box>
        )}
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
                  collection?.profiles?.[collection?.dataOwner[data?.slug]]
                    ?.username
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
                    address={
                      collection.profiles[collection.dataOwner[data.slug]]
                        .ethAddress
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
                display="flex"
                flexDirection={{
                  xs: "column",
                  md: "row",
                }}
                marginLeft={{
                  xs: "0",
                  md: "10",
                }}
                marginTop={{
                  xs: "0",
                  md: "-4",
                }}
                gap={{
                  xs: "8",
                  md: "0",
                }}
              >
                <Box display="flex" flexDirection="column" width="3/4" gap="4">
                  {collection.propertyOrder.map((propertyName: string) => {
                    const property = collection.properties[propertyName];
                    if (!data[property.name])
                      return (
                        <Stack key={property.name} space="1">
                          <Text
                            weight="semiBold"
                            variant="large"
                            color="accent"
                          >
                            {property.name}
                          </Text>{" "}
                          <Text variant="label">No value added</Text>
                        </Stack>
                      );
                    return (
                      <Stack key={property.name} space="1">
                        <Stack
                          space={"2"}
                          direction="horizontal"
                          wrap
                          align={"center"}
                        >
                          <Text
                            weight="bold"
                            variant="extraLarge"
                            color="accent"
                          >
                            {property.name}
                          </Text>
                          {property.description && (
                            <Text
                              weight="medium"
                              variant="small"
                              color={"textTertiary"}
                            >
                              {property.description}
                            </Text>
                          )}
                        </Stack>
                        {[
                          "shortText",
                          "ethAddress",
                          "email",
                          "number",
                        ].includes(property.type) && (
                          <Text size="small">{data[property.name]}</Text>
                        )}
                        {property?.type === "longText" && (
                          <Editor value={data[property.name]} disabled />
                        )}
                        {property?.type == "singleURL" && (
                          <Box
                            onClick={() =>
                              window.open(data[property.name], "_blank")
                            }
                            cursor="pointer"
                          >
                            <Text>{data[property.name]}</Text>
                          </Box>
                        )}
                        {property?.type == "multiURL" && (
                          <Stack direction="vertical">
                            {data[property.name]?.map((url: OptionType) => (
                              <Box key={url.value}>
                                <Stack direction={"horizontal"}>
                                  <Text>{url.label}</Text>
                                  <Text>-</Text>
                                  <Box
                                    key={url.value}
                                    onClick={() =>
                                      window.open(url.value, "_blank")
                                    }
                                    cursor="pointer"
                                  >
                                    <Text>{url.value}</Text>
                                  </Box>
                                </Stack>
                              </Box>
                            ))}
                          </Stack>
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
                        {property?.type === "reward" && (
                          <Text>
                            {data[property.name]?.value}{" "}
                            {data[property.name]?.token?.label} on{" "}
                            {data[property.name]?.chain?.label}
                          </Text>
                        )}
                        {property?.type === "payWall" && (
                          <Stack>
                            {data[property.name]?.map(
                              (payment: {
                                token: OptionType;
                                chain: OptionType;
                                value: number;
                              }) => {
                                return (
                                  <Text key={payment.token.label}>
                                    Paid {payment.value} {payment.token.label}{" "}
                                    on {payment.chain.label}
                                  </Text>
                                );
                              }
                            )}
                            {console.log(data[property.name])}
                            {data[propertyName].length == 0 && "Unpaid"}
                          </Stack>
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
                                    value={
                                      milestone.description ||
                                      "No description added"
                                    }
                                    disabled
                                  />
                                  <Stack
                                    direction="horizontal"
                                    align="baseline"
                                    wrap
                                  >
                                    <Text variant="label">Reward</Text>
                                    <Text weight="semiBold" color="textPrimary">
                                      {milestone.reward?.value &&
                                      milestone.reward?.token.label &&
                                      milestone.reward?.chain.label
                                        ? `${milestone.reward?.value} ${milestone.reward?.token.label} on ${milestone.reward?.chain.label}`
                                        : "No reward added"}
                                    </Text>
                                  </Stack>
                                  <Stack
                                    direction="horizontal"
                                    align="baseline"
                                    wrap
                                  >
                                    <Text variant="label">Due date</Text>
                                    <Text weight="semiBold" color="textPrimary">
                                      {milestone.dueDate || "No due date added"}
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
                </Box>
                <Box display="flex" flexDirection="column" gap="2">
                  {collection.voting?.periods &&
                    collection.voting?.periods[data.slug] &&
                    (collection.voting?.periods[data.slug].active ||
                      Object.keys(
                        collection.voting?.periods[dataId]?.votes || {}
                      )?.length > 0) &&
                    collection.voting?.periods[data.slug].options && (
                      <Stack space="1">
                        <Box
                          borderColor="foregroundSecondary"
                          borderWidth="0.375"
                          padding="2"
                          borderRadius="medium"
                        >
                          <Text
                            weight="semiBold"
                            variant="large"
                            color="accent"
                          >
                            Your Vote
                          </Text>
                          <Text>{collection.voting?.message}</Text>
                          <Box marginTop="4">
                            <Tabs
                              tabs={
                                collection.voting?.periods[
                                  data.slug
                                ].options?.map((option) => option.label) || []
                              }
                              selectedTab={vote}
                              onTabClick={async (tab) => {
                                if (
                                  !collection?.voting?.periods?.[data.slug]
                                    ?.active
                                )
                                  return;
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
                          </Box>
                        </Box>
                      </Stack>
                    )}

                  {collection.voting?.periods &&
                    collection.voting?.periods[data.slug] &&
                    collection.voting?.periods[data.slug].options &&
                    collection.voting?.periods[data.slug].votes &&
                    collection.voting?.periods[data.slug].votes?.[
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
                              data.slug
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
                  {collection.voting?.periods &&
                    Object.keys(
                      collection.voting?.periods[data.slug]?.votes || {}
                    ).length > 0 &&
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
                          collection.voting?.periods[data.slug] &&
                          Object.entries(
                            collection.voting?.periods[data.slug]?.votes || {}
                          ).map(([voterId, vote]) => {
                            return (
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
                                    href={`/profile/${
                                      getMemberDetails(voterId)?.username
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
                                        src={getMemberDetails(voterId)?.avatar}
                                        address={
                                          getMemberDetails(voterId)?.ethAddress
                                        }
                                        label=""
                                        size="8"
                                      />
                                      <Text
                                        color="accentText"
                                        weight="semiBold"
                                      >
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
                                    collection?.voting?.periods[data.slug]
                                      ? collection?.voting?.periods[data.slug]
                                          ?.options?.[vote]?.label
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
                                    {collection?.voting
                                      ?.votesAreWeightedByTokens
                                      ? `${1} votes`
                                      : `1 vote`}
                                  </Text>
                                </Box>
                              </Box>
                            );
                          })}
                      </Box>
                    )}
                </Box>
              </Box>
            </Stack>
            <Box
              width="full"
              borderTopWidth="0.375"
              marginY="4"
              borderRadius="full"
              marginTop="8"
            />
            <Box paddingBottom="0">
              <DataActivity
                activities={collection.dataActivities[dataId]}
                activityOrder={collection.dataActivityOrder[dataId]}
                getMemberDetails={getMemberDetails}
                dataId={dataId}
                collectionId={collection.id}
                dataOwner={collection.profiles[collection.dataOwner[data.slug]]}
              />
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
