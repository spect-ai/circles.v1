import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { monthMap } from "@/app/common/utils/constants";
import { CardType, ColumnType, MemberDetails } from "@/app/types";
import { Avatar, Box, IconEth, Stack, Tag, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

type Props = {
  cards: CardType[];
  column: ColumnType;
};

const TaskContainer = styled(Box)<{ mode: string }>`
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  }
`;

const CardList = ({ card }: { card: CardType }) => {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const { mode } = useTheme();

  const deadline = useMemo(() => new Date(card.deadline), [card.deadline]);

  return (
    <TaskContainer
      padding="4"
      borderBottomWidth="0.375"
      cursor="pointer"
      onClick={() => {
        void router.push(`/${cId}/${pId}/${card.slug}`);
      }}
      transitionDuration="500"
      backgroundColor="background"
      mode={mode}
    >
      <Box marginLeft="3">
        <Stack direction="horizontal" justify="space-between">
          <Stack direction="horizontal" justify="space-between">
            {card.assignee.length > 0 && card.assignee[0] ? (
              <Avatar
                src={
                  memberDetails?.memberDetails &&
                  memberDetails.memberDetails[card.assignee[0]]?.avatar
                }
                label=""
                size="6"
                address={
                  memberDetails?.memberDetails &&
                  memberDetails.memberDetails[card.assignee[0]]?.ethAddress
                }
              />
            ) : (
              <Box marginLeft="6" />
            )}
            <Text weight="semiBold">{card.title}</Text>
          </Stack>
          <Box display="flex">
            <Stack direction="horizontal" space="2" align="center" wrap>
              {card.status.paid && (
                <Tag size="small">
                  <Text color="green">Paid</Text>
                </Tag>
              )}
              {card.type === "Bounty" && (
                <Tag size="small" tone="accent">
                  {card.type}
                </Tag>
              )}
              {card.reward.value ? (
                <Tag size="small" tone="accent">
                  <Stack direction="horizontal" space="0" align="center">
                    <IconEth size="3.5" />
                    {card.reward.value} {card.reward.token.symbol}
                  </Stack>
                </Tag>
              ) : null}
              {card.deadline && (
                <Tag size="small" tone="accent">
                  {deadline.getDate()}{" "}
                  {monthMap[deadline.getMonth() as keyof typeof monthMap]}
                </Tag>
              )}
              {card.priority ? <PriorityIcon priority={card.priority} /> : null}
              {card?.labels?.map((label) => (
                <Tag size="small" key={label}>
                  {label}
                </Tag>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </TaskContainer>
  );
};

export default function ListSection({ cards, column }: Props) {
  return (
    <Box width="full">
      <Box
        backgroundColor="foregroundSecondary"
        width="full"
        padding="2"
        borderBottomWidth="0.375"
      >
        <Box marginLeft="3">
          <Text weight="semiBold" size="large">
            {column.name}
          </Text>
        </Box>
      </Box>
      {cards.map((card) => {
        if (card) {
          return <CardList key={card.id} card={card} />;
        }
        return null;
      })}
    </Box>
  );
}
