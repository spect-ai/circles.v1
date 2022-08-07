import { Box, Stack, useTheme } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useCardService from "@/app/services/Card/useCardService";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import SubTaskAssignee from "./SubTaskAssignee";

const TitleInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};

  ::placeholder {
    color: rgb(255, 255, 255, 0.25);
  }
`;

const Container = styled(Box)<{ editing: boolean; mode: string }>`
  border: ${(props) =>
    props.editing
      ? "2px solid rgb(191, 90, 242, 1)"
      : "2px solid rgb(255, 255, 255, 0.02)"};
  background: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(247, 247, 247)"};
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
`;

type Props = {
  createCard: boolean;
};

export default function NewSubTask({ createCard }: Props) {
  const { card, setCard, subTasks, setSubTasks } = useLocalCard();
  const [title, setTitle] = useState("");
  const { callCreateCard, creating } = useCardService();

  const [editing, setEditing] = useState(false);
  const [assignees, setAssignees] = useState<string[]>([]);

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { mode } = useTheme();

  return (
    <Container paddingX="4" editing={editing} mode={mode}>
      <Stack direction="horizontal">
        <TitleInput
          placeholder="New Sub Task"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onFocus={() => {
            setEditing(true);
          }}
          onBlur={() => {
            setEditing(false);
          }}
          mode={mode}
        />

        <Box paddingY="1">
          <Stack direction="horizontal" space="1">
            <SubTaskAssignee
              assignees={assignees}
              setAssignees={setAssignees}
            />
            {createCard ? (
              <PrimaryButton
                disabled={!title}
                onClick={() => {
                  // add to subtasks
                  setSubTasks([
                    ...subTasks,
                    {
                      title,
                      assignee: assignees,
                    },
                  ]);
                  setTitle("");
                  setAssignees([]);
                }}
              >
                Add
              </PrimaryButton>
            ) : (
              <PrimaryButton
                disabled={!title}
                loading={creating}
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
                    assignee: assignees,
                  });
                  setTitle("");
                  setAssignees([]);
                  setCard(data.card);
                }}
              >
                Save
              </PrimaryButton>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
