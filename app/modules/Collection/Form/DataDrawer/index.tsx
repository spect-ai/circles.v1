/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer, { slideHorizontal } from "@/app/common/components/Drawer";
import { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import { MemberDetails, UserType } from "@/app/types";
import { Avatar, Box, Button, IconChevronRight, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import DataActivity from "./DataActivity";
import SpectVoting from "./VotingOnSpect";
import VotingActions from "./VotingActions";
import SnapshotVoting from "./VotingOnSnapshot";

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
  const [data, setData] = useState({} as any);

  console.log({ collection });

  useEffect(() => {
    if (dataId && collection.data) {
      setTimeout(() => {
        setData(collection?.data[dataId]);
      }, 0);
    }
  }, [collection?.data, dataId]);

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

  const handleClose = async () => {
    setExpandedDataSlug("");
    dataId && (await router.push(`/${cId}/r/${collection.slug}`));
  };

  return (
    <Drawer
      handleClose={handleClose}
      header={
        <Box marginLeft="-4">
          <Stack direction="horizontal" align="center" justify="space-between">
            <Button
              shape="circle"
              size="small"
              variant="transparent"
              onClick={handleClose}
            >
              <Stack direction="horizontal" align="center" space="0">
                <IconChevronRight />
                <Box marginLeft="-4">
                  <IconChevronRight />
                </Box>
              </Stack>
            </Button>
            <VotingActions dataId={dataId} data={data} />
          </Stack>
        </Box>
      }
    >
      {Object.keys(data).length !== 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
                {!collection.voting.periods?.[dataId]?.snapshot?.onSnapshot && (
                  <SpectVoting dataId={dataId} />
                )}
                {collection.voting.periods?.[dataId]?.snapshot?.onSnapshot && (
                  <SnapshotVoting dataId={dataId} />
                )}
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
                setForm={updateCollection}
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
