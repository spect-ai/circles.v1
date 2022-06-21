import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { monthMap } from "@/app/common/utils/constants";
import { CardType, ColumnType, MemberDetails } from "@/app/types";
import { Avatar, Box, IconEth, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import styled from "styled-components";

type Props = {
  card: CardType;
  index: number;
  column: ColumnType;
};

const Container = styled(Box)<{ isDragging: boolean }>`
  border-width: 4px;
  border-color: ${(props) =>
    props.isDragging ? "rgb(175, 82, 222, 1)" : "rgb(255, 255, 255, 0)"};
  &:hover {
    border-color: rgb(255, 255, 255, 0.1);
  }
`;

export default function CardComponent({ card, index, column }: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const deadline = new Date(card.deadline);
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          backgroundColor="foregroundTertiary"
          padding="2"
          marginBottom="2"
          borderRadius="2xLarge"
          isDragging={snapshot.isDragging}
          onClick={() => router.push(`/${cId}/${pId}/${card.slug}`)}
        >
          <Box>
            <Box
              marginTop="1"
              marginBottom="4"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text>{card.title}</Text>
              {card.assignee.length > 0 && (
                <Avatar
                  src={
                    memberDetails &&
                    memberDetails.memberDetails[card.assignee[0]]?.avatar
                  }
                  label=""
                  size="6"
                  placeholder={
                    !(
                      memberDetails &&
                      memberDetails.memberDetails[card.assignee[0]]?.avatar
                    )
                  }
                />
              )}
            </Box>
            {/* <MemberAvatarGroup
                memberIds={card.assignee}
                memberDetails={space.memberDetails}
              /> */}
            <Stack direction="horizontal" wrap space="2">
              {card.type === "Bounty" && (
                <Tag size="small">
                  <Text>{card.type}</Text>
                </Tag>
              )}
              {card.reward.value ? (
                <Tag size="small" tone="accent">
                  <Stack direction="horizontal" space="0" align="center">
                    <IconEth size="4" />
                    <Text>
                      {card.reward.value} {card.reward.token.symbol}
                    </Text>
                  </Stack>
                </Tag>
              ) : null}
              {card.deadline && (
                <Tag size="small" tone="accent">
                  <Text>
                    {deadline.getDate()}{" "}
                    {monthMap[deadline.getMonth() as keyof typeof monthMap]}
                  </Text>
                </Tag>
              )}
              {card.priority ? <PriorityIcon priority={card.priority} /> : null}
              {card?.labels?.map((label) => (
                <Tag size="small" key={label}>
                  <Text>{label}</Text>
                </Tag>
              ))}
            </Stack>
          </Box>
        </Container>
      )}
    </Draggable>
  );
}
