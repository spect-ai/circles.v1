import { Avatar, Box, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

type Props = {
  task: any;
  index: number;
  column: any;
};

const Container = styled(Box)`
  border-width: 2px;
  border-color: rgb(255, 255, 255, 0.04);
  &:hover {
    // background-color: rgb(255, 255, 255, 0.05);
    border-color: rgb(175, 82, 222, 1);
  }
`;

export default function CardComponent({ task, index, column }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const router = useRouter();
  const { id, bid } = router.query;
  console.log({ task });
  return (
    <Draggable draggableId={task.taskId} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          backgroundColor="background"
          padding="2"
          marginBottom="2"
          borderRadius="large"
          transitionDuration="700"
        >
          <Box>
            <Box
              marginTop="1"
              marginBottom="6"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text>{task.title}</Text>
              {/* {task.assignee[0] !== '' && (
                <Avatar
                  src={getAvatar(space.memberDetails[task.assignee[0]])}
                  label=""
                  size="8"
                  placeholder={
                    !getAvatar(space.memberDetails[task.assignee[0]])
                  }
                />
              )} */}
            </Box>
            {/* <MemberAvatarGroup
                memberIds={task.assignee}
                memberDetails={space.memberDetails}
              /> */}
            <Box display="flex" flexWrap="wrap">
              {task.type === "Bounty" && (
                <Box marginRight="2" marginBottom="2">
                  <Tag size="small">
                    <Text>{task.type}</Text>
                  </Tag>
                </Box>
              )}
              {task.value ? (
                <Box marginRight="2" marginBottom="2">
                  <Tag size="small">
                    <Text>
                      {task.value} {task.token.symbol}
                    </Text>
                  </Tag>
                </Box>
              ) : null}
              {/* {task.deadline && (
                <Box marginRight="2" marginBottom="2">
                  <Tag size="small">
                    <Text>
                      {task.deadline.getDate()}{' '}
                      {
                        monthMap[
                          task.deadline.getMonth() as keyof typeof monthMap
                        ]
                      }
                    </Text>
                  </Tag>
                </Box>
              )} */}
              {task.status === 300 && <Tag>{task.type}</Tag>}
              {/* {task?.tags?.map((tag) => (
                <Box marginRight="2" marginBottom="2">
                  <Tag size="small" tone="accent">
                    <Text>{tag}</Text>
                  </Tag>
                </Box>
              ))} */}
            </Box>
          </Box>
        </Container>
      )}
    </Draggable>
  );
}
