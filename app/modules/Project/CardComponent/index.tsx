import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { monthMap } from "@/app/common/utils/constants";
import { CardType, ColumnType, MemberDetails } from "@/app/types";
import { Avatar, Box, IconEth, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { memo, useCallback, useMemo } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { useQuery } from "react-query";
import styled from "styled-components";

type Props = {
  card: CardType;
  index: number;
  column: ColumnType;
};

const Container = styled(Box)<{ isDragging: boolean }>`
  border-width: 2px;
  border-color: ${(props) =>
    props.isDragging ? "rgb(191, 90, 242, 1)" : "rgb(255, 255, 255, 0)"};
  &:hover {
    border-color: rgb(255, 255, 255, 0.1);
  }
`;

function CardComponent({ card, index, column }: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      // backgroundColor="foregroundTertiary"
      backgroundColor="background"
      padding="4"
      marginBottom="2"
      borderRadius="large"
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
          <Text weight="semiBold">{card.title}</Text>
          {card.assignee.length > 0 && card.assignee[0] && (
            <Avatar
              src={
                memberDetails?.memberDetails &&
                memberDetails.memberDetails[card.assignee[0]]?.avatar
              }
              label=""
              size="6"
              placeholder={
                !(
                  memberDetails?.memberDetails &&
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
    </Container>
  );

  const deadline = useMemo(() => new Date(card.deadline), [card.deadline]);

  const DraggableContentCallback = useCallback(DraggableContent, [
    card.assignee,
    card.deadline,
    card?.labels,
    card.priority,
    card.reward.token.symbol,
    card.reward.value,
    card.status.paid,
    card.title,
    card.type,
    deadline,
    memberDetails?.memberDetails,
  ]);

  return (
    <Draggable draggableId={card.id} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
}

export default memo(CardComponent);
