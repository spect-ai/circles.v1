import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { monthMap } from "@/app/common/utils/constants";
import { CardType, MemberDetails } from "@/app/types";
import { Avatar, Box, IconEth, Stack, Tag, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import QuickActions from "./QuickActions";
type Props = {
  card: CardType;
  index: number;
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-width: 2px;
  border-color: ${(props) =>
    props.isDragging
      ? "rgb(191, 90, 242, 1)"
      : props.mode === "dark"
      ? "rgb(255, 255, 255, 0.05)"
      : "rgb(20,20,20,0.05)"};
  };
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
`;

function CardComponent({ card, index }: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const [hover, setHover] = useState(false);

  const { projectCardActions } = useLocalProject();
  const { mode } = useTheme();

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding="4"
      marginBottom="2"
      borderRadius="large"
      isDragging={snapshot.isDragging}
      onClick={(e) => {
        void router.push(`/${cId}/${pId}/${card.slug}`);
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      mode={mode}
    >
      <Box>
        <Box marginTop="1" marginBottom="4">
          <Stack direction="horizontal" space="2" justify="space-between">
            <Text weight="semiBold">{card.title}</Text>
            {card.assignee.length > 0 && card.assignee[0] && (
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
                placeholder={
                  !(
                    memberDetails?.memberDetails &&
                    memberDetails.memberDetails[card.assignee[0]]?.avatar
                  )
                }
              />
            )}
          </Stack>
        </Box>
        {/* <MemberAvatarGroup
              memberIds={card.assignee}
              memberDetails={space.memberDetails}
            /> */}
        <Stack direction="horizontal" wrap space="2">
          {card.status.paid && (
            <Tag size="small" tone="green">
              <Text color="green">Paid</Text>
            </Tag>
          )}
          {card.type === "Bounty" && (
            <Tag size="small">
              <Text color="accent">{card.type}</Text>
            </Tag>
          )}
          {card.reward.value ? (
            <Tag size="small">
              <Text color="accent">
                <Stack direction="horizontal" space="0" align="center">
                  <IconEth size="3.5" />
                  {card.reward.value} {card.reward.token.symbol}
                </Stack>
              </Text>
            </Tag>
          ) : null}
          {card.deadline && (
            <Tag size="small">
              <Text color="accent">
                {deadline.getDate()}{" "}
                {monthMap[deadline.getMonth() as keyof typeof monthMap]}
              </Text>
            </Tag>
          )}
          {card.priority ? <PriorityIcon priority={card.priority} /> : null}
          {card?.labels?.map((label) => (
            <Tag size="small" key={label}>
              {label}
            </Tag>
          ))}
        </Stack>
        <QuickActions card={card} hover={hover} />
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
    hover,
    projectCardActions,
    mode,
  ]);

  return (
    <Draggable draggableId={card.id} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
}

export default memo(CardComponent);
