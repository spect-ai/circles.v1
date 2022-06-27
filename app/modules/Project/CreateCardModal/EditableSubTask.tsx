import { Box, Button, IconTrash, Stack } from "degen";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocalCard } from "./hooks/LocalCardContext";
import { SaveOutlined } from "@ant-design/icons";
import { callCreateCard } from "@/app/services/Card";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

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
  newSubTask?: boolean;
  subTaskIndex?: number;
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

export default function EditableSubTask({ subTaskIndex, newSubTask }: Props) {
  const { subTasks, setSubTasks, card } = useLocalCard();
  const [title, setTitle] = useState("");
  const [editable, setEditable] = useState(false);

  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  useEffect(() => {
    if (newSubTask) {
      setEditable(true);
    }
  }, []);

  return (
    <motion.main
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
    >
      <Stack>
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
            {subTaskIndex && (
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
            )}
            {newSubTask && (
              <TitleInput
                placeholder="Enter title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            )}
          </Box>
          {editable && (
            <Box paddingY="1" paddingRight="1">
              <Stack direction="horizontal" space="1">
                <Button
                  shape="circle"
                  size="small"
                  variant="secondary"
                  onClick={async () => {
                    const data = await callCreateCard({
                      title,
                      parent: card?.id,
                      columnId: card?.columnId,
                      project: card?.project.id,
                      circle: card?.circle,
                      reward: {
                        chain: circle?.defaultPayment.chain,
                        token: circle?.defaultPayment.token,
                        value: 0,
                      },
                    });
                    console.log({ data });
                  }}
                >
                  <SaveOutlined />
                </Button>
                <Button
                  shape="circle"
                  size="small"
                  tone="red"
                  variant="secondary"
                  onClick={() => {
                    // delete sub task
                    setSubTasks(
                      subTasks.filter((_, index) => index !== subTaskIndex)
                    );
                  }}
                >
                  <IconTrash />
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>
    </motion.main>
  );
}
