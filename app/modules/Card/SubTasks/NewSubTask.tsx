import { Box, Stack } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useCardService from "@/app/services/Card/useCardService";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import SubTaskAssignee from "./SubTaskAssignee";

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
  caret-color: rgb(255, 255, 255, 0.8);
  color: rgb(255, 255, 255, 0.8);

  ::placeholder {
    color: rgb(255, 255, 255, 0.25);
  }
`;

const Container = styled(Box)<{ editing: boolean }>`
  color: rgb(255, 255, 255, 0.85);
  border: ${(props) =>
    props.editing
      ? "2px solid rgb(191, 90, 242, 1)"
      : "2px solid rgb(255, 255, 255, 0.02)"};
  background: rgb(255, 255, 255, 0.01);
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

  return (
    <Container paddingX="4" editing={editing}>
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
                  console.log({ data });
                  setTitle("");
                  setAssignees([]);
                  setCard(data.parentCard);
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
