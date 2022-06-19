import { Box, Button, IconTrash, Stack } from "degen";
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocalCard } from "./hooks/LocalCardContext";

const TitleInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(255, 255, 255, 0.85);
  color: rgb(255, 255, 255, 0.85);
  font-weight: 600;
`;

type Props = {
  subTaskIndex: number;
};

const variants = {
  hidden: { opacity: 0, x: 0, y: "-10h" },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: {
    opacity: 0,
    x: 0,
    y: "10vh",
    transition: {
      duration: 0.3,
    },
  },
};

export default function EditableSubTask({ subTaskIndex }: Props) {
  const { subTasks, setSubTasks } = useLocalCard();
  return (
    <motion.main
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
    >
      <Stack direction="horizontal">
        <Box
          display="flex"
          borderWidth="0.375"
          width="full"
          padding="1"
          borderRadius="2xLarge"
          justifyContent="space-between"
          alignItems="center"
          // backgroundColor="foregroundTertiary"
        >
          <TitleInput
            placeholder="Enter title"
            value={subTasks[subTaskIndex]?.title}
            onChange={(e) => {
              console.log({ subTaskIndex });
              console.log();
              setSubTasks(
                subTasks.map((subTask, index) => {
                  if (index === subTaskIndex) {
                    return {
                      ...subTask,
                      title: e.target.value,
                    };
                  }
                  return subTask;
                })
              );
            }}
          />
        </Box>
        <Button
          shape="circle"
          size="small"
          tone="red"
          variant="secondary"
          onClick={() => {
            // delete sub task
            setSubTasks(subTasks.filter((_, index) => index !== subTaskIndex));
          }}
        >
          <IconTrash />
        </Button>
      </Stack>
    </motion.main>
  );
}
