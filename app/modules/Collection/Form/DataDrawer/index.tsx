/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { MemberDetails } from "@/app/types";
import {
  Box,
  Button,
  IconChevronRight,
  Stack,
  Tag,
  Text,
  Avatar as DefaultAvatar,
  useTheme,
  Avatar as DegenAvatar,
} from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ExternalLink } from "react-feather";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import SnapshotVoting from "./VotingOnSnapshot";
import Avatar from "@/app/common/components/Avatar";
import { timeSince, smartTrim } from "@/app/common/utils/utils";
import DataActivity from "./DataActivity";

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
  const { mode } = useTheme();

  const { registry } = useCircle();

  const router = useRouter();
  const { dataId: dataSlug, circle: cId } = router.query;
  const [data, setData] = useState({} as any);
  const [dataIdx, setDataIdx] = useState(0);

  useEffect(() => {
    if (dataId && collection.data) {
      setTimeout(() => {
        setData(collection?.data?.[dataId]);
      }, 0);

      const idx = Object.keys(collection.data).indexOf(dataId);
      setDataIdx(idx + 1);
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
            {/* <VotingActions dataId={dataId} data={data} col={false} /> */}
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
              <Stack direction="horizontal" align="center" space="2">
                <Box
                  display="flex"
                  flexDirection="column"
                  marginX="10"
                  marginBottom="4"
                  gap="2"
                >
                  <Text color="accentText" weight="semiBold">
                    Response {dataIdx}
                  </Text>
                  {collection.dataActivities &&
                    collection.dataActivityOrder &&
                    collection.dataActivities[dataId]?.[
                      collection.dataActivityOrder?.[dataId]?.[0]
                    ]?.timestamp && (
                      <Text ellipsis size="label" color="textTertiary">
                        Added{" "}
                        {timeSince(
                          new Date(
                            collection.dataActivities[dataId][
                              collection.dataActivityOrder?.[dataId]?.[0]
                            ].timestamp
                          )
                        )}{" "}
                        ago
                      </Text>
                    )}
                </Box>
              </Stack>

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
                  {collection.propertyOrder.map((propertyId: string) => {
                    const property = collection.properties[propertyId];
                    if (property.isPartOfFormView === false) return null;
                    if (property.type === "readonly") return null;
                    if (!data[property.id])
                      return (
                        <Stack key={property.id} space="1">
                          <Text
                            weight="semiBold"
                            variant="large"
                            color="accent"
                          >
                            {property.name}
                          </Text>
                          <Text variant="label">No value added</Text>
                        </Stack>
                      );
                    return (
                      <Stack key={property.id} space="1">
                        <Stack
                          space={"2"}
                          direction="horizontal"
                          wrap
                          align={"center"}
                        >
                          <Text
                            weight="semiBold"
                            variant="large"
                            color="accent"
                          >
                            {property.name}
                          </Text>
                          {/* {property.description && (
                            <Text
                              weight="medium"
                              variant="small"
                              color={"textTertiary"}
                            >
                              {property.description}
                            </Text>
                          )} */}
                        </Stack>
                        <ResponseFieldCard
                          mode={mode}
                          backgroundColor="foregroundTertiary"
                        >
                          {[
                            "shortText",
                            "ethAddress",
                            "email",
                            "number",
                            "slider",
                          ].includes(property.type) && (
                            <Text size="small">{data[property.id]}</Text>
                          )}
                          {property?.type === "longText" && (
                            <Editor
                              value={data[property.id]}
                              disabled
                              version={collection.editorVersion}
                            />
                          )}
                          {property?.type == "singleURL" && (
                            <Box
                              onClick={() =>
                                window.open(data[property.id], "_blank")
                              }
                              cursor="pointer"
                            >
                              <Text>{data[property.id]}</Text>
                            </Box>
                          )}
                          {property?.type == "multiURL" && (
                            <Stack direction="vertical">
                              {data[property.id]?.map((url: OptionType) => (
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
                            <Text>{data[property.id]?.label}</Text>
                          )}
                          {property?.type === "multiSelect" && (
                            <Stack space="2" direction="horizontal" wrap>
                              {data[property.id]?.map((option: OptionType) => (
                                <Tag key={option.value} tone="accent" hover>
                                  {option.label}
                                </Tag>
                              ))}
                            </Stack>
                          )}
                          {property?.type === "user" && (
                            <Text>{data[property.id]?.label}</Text>
                          )}
                          {property?.type === "user[]" && (
                            <Stack
                              space="2"
                              direction="horizontal"
                              align="baseline"
                              wrap
                            >
                              {data[property.id]?.map((option: OptionType) => (
                                <Tag key={option.value} tone="accent" hover>
                                  {option.label}
                                </Tag>
                              ))}
                            </Stack>
                          )}
                          {property?.type === "date" && (
                            <Text>{data[property.id]?.toString()}</Text>
                          )}
                          {property?.type === "reward" && (
                            <Text>
                              {data[property.id]?.value ? (
                                <>
                                  {data[property.id]?.value}{" "}
                                  {data[property.id]?.token?.label} on{" "}
                                  {data[property.id]?.chain?.label}
                                </>
                              ) : (
                                "No value added"
                              )}
                            </Text>
                          )}
                          {property?.type === "payWall" && (
                            <Stack>
                              {[data[property.id || property.id]]?.map(
                                (payment: {
                                  token: OptionType;
                                  chain: OptionType;
                                  value: number;
                                  txnHash: string;
                                }) => {
                                  return (
                                    <Text key={payment.token.label}>
                                      <Stack
                                        direction="horizontal"
                                        align="center"
                                        space="0"
                                      >
                                        Paid {payment.value}{" "}
                                        {payment.token.label} on{" "}
                                        {payment.chain.label}
                                        <a
                                          href={`${
                                            registry?.[payment.chain.value]
                                              .blockExplorer
                                          }tx/${payment.txnHash}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{
                                            marginLeft: "8px",
                                          }}
                                        >
                                          <ExternalLink size={20} />
                                        </a>
                                      </Stack>
                                    </Text>
                                  );
                                }
                              )}
                              {data[propertyId].length == 0 && "Unpaid"}
                            </Stack>
                          )}
                          {property?.type === "milestone" && (
                            <Stack>
                              {data[property.id]?.map(
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
                                      <Text
                                        weight="semiBold"
                                        color="textPrimary"
                                      >
                                        {milestone.title}
                                      </Text>
                                    </Stack>
                                    <Editor
                                      value={
                                        milestone.description ||
                                        "No description added"
                                      }
                                      disabled
                                      version={collection.editorVersion}
                                    />
                                    <Stack
                                      direction="horizontal"
                                      align="baseline"
                                      wrap
                                    >
                                      <Text variant="label">Reward</Text>
                                      <Text
                                        weight="semiBold"
                                        color="textPrimary"
                                      >
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
                                      <Text
                                        weight="semiBold"
                                        color="textPrimary"
                                      >
                                        {milestone.dueDate ||
                                          "No due date added"}
                                      </Text>
                                    </Stack>
                                  </Stack>
                                )
                              )}
                            </Stack>
                          )}
                          {property?.type === "discord" && (
                            <Box padding="0">
                              <Stack direction="horizontal" align="center">
                                <DefaultAvatar
                                  label="Discord Avatar"
                                  src={`https://cdn.discordapp.com/avatars/${data[propertyId].id}/${data[propertyId].avatar}.png`}
                                />
                                <Box>
                                  <Text
                                    size="extraSmall"
                                    font="mono"
                                    weight="bold"
                                  >
                                    {data[propertyId].username}
                                  </Text>
                                </Box>
                              </Stack>
                            </Box>
                          )}
                          {property?.type === "github" && (
                            <a
                              href={data[propertyId].html_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Box padding="0">
                                <Stack direction="horizontal" align="center">
                                  <DefaultAvatar
                                    label="Discord Avatar"
                                    src={data[propertyId].avatar_url}
                                  />
                                  <Box>
                                    <Text
                                      size="extraSmall"
                                      font="mono"
                                      weight="bold"
                                    >
                                      {data[propertyId].login}
                                    </Text>
                                  </Box>
                                </Stack>
                              </Box>
                            </a>
                          )}
                          {property?.type === "telegram" && (
                            // <a
                            //   href={data[propertyId].html_url}
                            //   target="_blank"
                            //   rel="noreferrer"
                            // >
                            <Box padding="0">
                              <Stack direction="horizontal" align="center">
                                <Box>
                                  <Text
                                    size="extraSmall"
                                    font="mono"
                                    weight="bold"
                                  >
                                    {data[propertyId].username}
                                  </Text>
                                </Box>
                              </Stack>
                            </Box>
                            // </a>
                          )}{" "}
                        </ResponseFieldCard>
                      </Stack>
                    );
                  })}
                  {collection.data?.[dataId]?.["anonymous"] === false &&
                    collection.dataOwner[data.slug] &&
                    collection.profiles[collection.dataOwner[data.slug]] && (
                      <Stack space="1">
                        <Text weight="semiBold" variant="large" color="accent">
                          Responder
                        </Text>

                        <Stack direction="horizontal" align="center" space="2">
                          <Avatar
                            src={
                              collection.profiles[
                                collection.dataOwner[data.slug]
                              ].avatar
                            }
                            address={
                              collection.profiles[
                                collection.dataOwner[data.slug]
                              ].ethAddress
                            }
                            label=""
                            size="6"
                            username={
                              collection.profiles[
                                collection.dataOwner[data.slug]
                              ].username
                            }
                            userId={
                              collection.profiles[
                                collection.dataOwner[data.slug]
                              ].id
                            }
                            profile={
                              collection.profiles[
                                collection.dataOwner[data.slug]
                              ]
                            }
                          />
                          <Text color="accentText" weight="semiBold">
                            {
                              collection.profiles[
                                collection.dataOwner[data.slug]
                              ].username
                            }
                          </Text>
                        </Stack>
                      </Stack>
                    )}
                  {collection.data?.[dataId]?.["__lookup__"] && (
                    <Stack space="1">
                      {/* <Text weight="semiBold" variant="large" color="accent">
                        On Chain token balance
                      </Text> */}
                      <Stack direction="horizontal" wrap space="2">
                        {collection.data?.[dataId]?.["__lookup__"].map(
                          (token: any) => (
                            <Box
                              key={token.contractAddress}
                              borderWidth="0.375"
                              borderRadius="2xLarge"
                              cursor="pointer"
                              padding="2"
                              style={{
                                width: "32%",
                              }}
                            >
                              <Stack align="center" space="2">
                                <DegenAvatar
                                  src={
                                    token.metadata.image ||
                                    `https://api.dicebear.com/5.x/initials/svg?seed=${token.metadata.id}`
                                  }
                                  label=""
                                  shape="square"
                                />
                                <Text align="center">
                                  {smartTrim(token.metadata.id, 20)}
                                </Text>
                                <Text align="center">{token.balance}</Text>
                              </Stack>
                            </Box>
                          )
                        )}
                      </Stack>
                    </Stack>
                  )}
                </Box>
                {/* {!collection.voting?.periods?.[dataId]?.snapshot
                  ?.proposalId && <SpectVoting dataId={dataId} />} */}
                {collection.voting?.snapshot?.[dataId]?.proposalId && (
                  <SnapshotVoting dataId={dataId} />
                )}
              </Box>
            </Stack>
            <Box
              width="full"
              borderTopWidth="0.375"
              marginY="4"
              borderRadius="full"
              marginTop="24"
            />
            <Box paddingBottom="0">
              {collection.dataActivities?.[dataId] &&
                collection.dataActivityOrder && (
                  <DataActivity
                    activities={collection.dataActivities[dataId]}
                    activityOrder={collection.dataActivityOrder[dataId]}
                    getMemberDetails={getMemberDetails}
                    dataId={dataId}
                    collectionId={collection.id}
                    dataOwner={
                      collection.profiles[collection.dataOwner[data.slug]]
                    }
                    setForm={updateCollection}
                    collection={collection}
                  />
                )}
            </Box>
          </ScrollContainer>
        </motion.div>
      )}
    </Drawer>
  );
}

const ScrollContainer = styled(Box)`.
  height: calc(100vh - 4rem);
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
    border-radius: 0rem;
  }
`;

const ResponseFieldCard = styled(Box)<{
  mode: string;
  width?: string;
  height?: string;
}>`
  @media (max-width: 1420px) {
    width: 100%;
    padding: 0.5rem;
    margin: 0;
    height: auto;
    margin-top: 0.5rem;
    align-items: flex-start;
  }
  height: ${(props) => props.height || "auto"};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0px 1px 6px
    ${(props) =>
      props.mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    box-shadow: 0px 3px 10px
      ${(props) =>
        props.mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.25)"};
    transition-duration: 0.7s;
  }
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: flex-start;
  position: relative;
  transition: all 0.5s ease-in-out;
`;
