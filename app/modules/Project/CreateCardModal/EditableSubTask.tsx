import { Avatar, Box, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import { useCreateCard } from "./hooks/createCardContext";
const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: rgb(255, 255, 255, 0.85);
  color: rgb(255, 255, 255, 0.85);
  font-weight: 400;
`;

type Props = {
  subTaskIndex: number;
};

export default function EditableSubTask({ subTaskIndex }: Props) {
  const { subTasks, setSubTasks } = useCreateCard();

  return (
    <Box
      display="flex"
      borderWidth="0.375"
      width="full"
      padding="2"
      borderRadius="large"
      justifyContent="space-between"
      alignItems="center"
      // backgroundColor="foregroundTertiary"
    >
      <NameInput
        placeholder="Enter title"
        value={subTasks[subTaskIndex]?.title}
        onChange={(e) => {
          setSubTasks(
            subTasks.map((subTask, index) => {
              if (index === subTaskIndex) {
                return {
                  ...subTask,
                  name: e.target.value,
                };
              }
              return subTask;
            })
          );
        }}
      />
      <Stack direction="horizontal">
        {/* <Tag>3rd June</Tag>
        <Tag tone="green">120 Matic</Tag>
        <Tag>Feature</Tag>
        <Avatar size="6" placeholder label="avatar" /> */}
        {/* <SubTaskTagModal
          name={
            space.memberDetails[subTasks[subTaskIndex]?.assignee]?.username ||
            'Assignee'
          }
          label={subTasks[subTaskIndex]?.assignee ? 'Change' : 'Add'}
          subTaskIndex={subTaskIndex}
        /> */}
      </Stack>
    </Box>
  );
}
