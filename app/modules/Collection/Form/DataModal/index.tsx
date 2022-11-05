/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { MemberDetails, UserType } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Avatar, Box, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

export default function DataModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection } = useLocalCollection();

  const router = useRouter();
  const { dataId, circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [data, setData] = useState({} as any);
  const [comment, setComment] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [vote, setVote] = useState(2);

  useEffect(() => {
    if (dataId) {
      setData(collection?.data[dataId as string]);
      setIsOpen(true);
    } else setIsOpen(false);
  }, [collection?.data, dataId]);

  if (!isOpen) return null;

  if (!dataId || !data) return null;

  return (
    <Drawer
      handleClose={async () => {
        await router.push(`/${cId}/r/${collection.slug}`);
        setIsOpen(false);
      }}
      title={collection.data[dataId].title}
    >
      <ScrollContainer paddingX="8" paddingY="2">
        <Stack space="5">
          {collection.propertyOrder.map((propertyName: string) => {
            const property = collection.properties[propertyName];
            return (
              <Stack key={property.name} space="1">
                <Text weight="semiBold" variant="extraLarge" color="accent">
                  {property.name}
                </Text>
                {property?.type === "shortText" && (
                  <Text>{data[property.name]}</Text>
                )}
                {property?.type === "ethAddress" && (
                  <Text>{data[property.name]}</Text>
                )}
                {property?.type === "email" && (
                  <Text>{data[property.name]}</Text>
                )}
                {property?.type === "longText" && (
                  <Editor value={data[property.name]} disabled />
                )}
                {property?.type === "singleSelect" && (
                  <Text>{data[property.name].label}</Text>
                )}
                {property?.type === "multiSelect" && (
                  <Stack space="2" direction="horizontal">
                    {data[property.name].map((option: OptionType) => (
                      <Tag key={option.value} tone="accent" hover>
                        {option.label}
                      </Tag>
                    ))}
                  </Stack>
                )}
                {property?.type === "user" && (
                  <Text>{data[property.name].label}</Text>
                )}
                {property?.type === "user[]" && (
                  <Stack space="2" direction="horizontal" align="baseline">
                    {data[property.name].map((option: OptionType) => (
                      <Tag key={option.value} tone="accent" hover>
                        {option.label}
                      </Tag>
                    ))}
                  </Stack>
                )}
                {property?.type === "date" && (
                  <Text>{data[property.name]}</Text>
                )}
                {property?.type === "number" && (
                  <Text>{data[property.name]}</Text>
                )}
                {property?.type === "reward" && (
                  <Text>
                    {data[property.name].value}{" "}
                    {data[property.name].token.label} on{" "}
                    {data[property.name].chain.label}
                  </Text>
                )}
                {property?.type === "milestone" && (
                  <Stack>
                    {data[property.name].map(
                      (milestone: any, index: number) => (
                        <Stack key={milestone.id} space="2">
                          <Stack direction="horizontal" align="baseline">
                            <Text variant="label">Milestone {index + 1}</Text>
                            <Text weight="semiBold" color="textPrimary">
                              {milestone.title}
                            </Text>
                          </Stack>
                          <Editor value={milestone.description} disabled />
                          <Stack direction="horizontal" align="baseline">
                            <Text variant="label">Reward</Text>
                            <Text weight="semiBold" color="textPrimary">
                              {milestone.reward?.value}{" "}
                              {milestone.reward?.token.label} on{" "}
                              {milestone.reward?.chain.label}
                            </Text>
                          </Stack>
                          <Stack direction="horizontal" align="baseline">
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
          <Text weight="semiBold" variant="extraLarge" color="accent">
            Your Vote
          </Text>
          <Tabs
            tabs={["For", "Against", "Abstain"]}
            selectedTab={vote}
            onTabClick={(tab) => setVote(tab)}
            orientation="horizontal"
            unselectedColor="transparent"
            selectedColor="secondary"
          />
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
            <Box width="full" gap="2">
              <Editor
                placeholder="Write a reply..."
                value={comment}
                onSave={(value) => {
                  setComment(value);
                }}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
              {isDirty && (
                <Box width="1/4">
                  <PrimaryButton
                    icon={<SaveOutlined style={{ fontSize: "1.3rem" }} />}
                  >
                    Save
                  </PrimaryButton>
                </Box>
              )}
            </Box>
          </Stack>
        </Stack>
      </ScrollContainer>
    </Drawer>
  );
}

const ScrollContainer = styled(Box)`
  height: calc(100vh - 5rem);
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.3rem;
    border-radius: 0rem;
  }
`;
