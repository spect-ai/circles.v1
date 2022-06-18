import { CardType, ColumnType } from "@/app/types";
import { Avatar, Box, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

type Props = {
  card: CardType;
  index: number;
  column: ColumnType;
};

const Container = styled(Box)`
  border-width: 4px;
  border-color: rgb(255, 255, 255, 0.04);
  &:hover {
    border-color: rgb(255, 255, 255, 0.1);
  }
`;

export default function CardComponent({ card, index, column }: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;

  console.log({ card });
  return (
    <Draggable draggableId={card.slug} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          backgroundColor="background"
          padding="2"
          marginBottom="2"
          borderRadius="2xLarge"
          onClick={() => router.push(`/${cId}/${pId}/${card.slug}`)}
        >
          <Box>
            <Box
              marginTop="1"
              marginBottom="6"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text>{card.title}</Text>
              {/* {card.assignee[0] !== '' && (
                <Avatar
                  src={getAvatar(space.memberDetails[card.assignee[0]])}
                  label=""
                  size="8"
                  placeholder={
                    !getAvatar(space.memberDetails[card.assignee[0]])
                  }
                />
              )} */}
            </Box>
            {/* <MemberAvatarGroup
                memberIds={card.assignee}
                memberDetails={space.memberDetails}
              /> */}
            <Box display="flex" flexWrap="wrap">
              {card.type === "Bounty" && (
                <Box marginRight="2" marginBottom="2">
                  <Tag size="small">
                    <Text>{card.type}</Text>
                  </Tag>
                </Box>
              )}
              {card.value ? (
                <Box marginRight="2" marginBottom="2">
                  <Tag size="small">
                    <Text>
                      {card.value} {card.token.symbol}
                    </Text>
                  </Tag>
                </Box>
              ) : null}
              {/* {card.deadline && (
                <Box marginRight="2" marginBottom="2">
                  <Tag size="small">
                    <Text>
                      {card.deadline.getDate()}{' '}
                      {
                        monthMap[
                          card.deadline.getMonth() as keyof typeof monthMap
                        ]
                      }
                    </Text>
                  </Tag>
                </Box>
              )} */}
              {card.status === 300 && <Tag>{card.type}</Tag>}
              {card?.labels?.map((label) => (
                <Box marginRight="2" marginBottom="2" key={label}>
                  <Tag size="small">
                    <Text>{label}</Text>
                  </Tag>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      )}
    </Draggable>
  );
}
