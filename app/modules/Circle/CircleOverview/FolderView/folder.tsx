import React, { memo, useCallback, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconTrash, Stack, useTheme, Button, Text } from "degen";
import styled from "styled-components";
import Card from "./card";
import { CircleType, ProjectType, RetroType } from "@/app/types";
import { deleteFolder, updateFolder } from "@/app/services/Folders";
import { useCircle } from "../../CircleContext";
import { toast } from "react-toastify";

interface Props {
  content: string[];
  avatar: string;
  name: string;
  id: string;
  index: number;
  projects?: { [key: string]: ProjectType };
  workstreams?: { [key: string]: CircleType };
  retros?: {
    [key: string]: RetroType;
  };
  collections?: {
    [key: string]: {
      id: string;
      name: string;
      slug: string;
      viewType?: string;
      collectionType: 0 | 1;
      archived: boolean;
    };
  };
}

const NameInput = styled.input<{ mode: string }>`
  @media (max-width: 768px) {
    width: 5rem;
  }
  width: 12rem;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.5)" : "rgb(20, 20, 20, 0.5)"};
  font-weight: 500;
  margin-left: 0.1rem;
`;

const ScrollContainer = styled(Box)<{ mode: string }>`
  margin-top: 0.3rem;
  padding: 0.5rem;
  min-height: 7rem;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Folder = ({
  content,
  avatar,
  id,
  name,
  index,
  projects,
  workstreams,
  collections,
}: Props) => {
  const { canDo } = useRoleGate();
  const { mode } = useTheme();
  const { circle, setCircleData } = useCircle();
  const [folderTitle, setFolderTitle] = useState(name);
  const [hover, setHover] = useState(false);
  const ondeleteFolder = async () => {
    const unarchivedContent = content.filter(
      (card) =>
        (projects?.[card] && projects?.[card].archived !== true) ||
        (workstreams?.[card] && workstreams?.[card].archived !== true) ||
        (collections?.[card] && collections?.[card].archived !== true)
    );
    if (unarchivedContent.length > 0) {
      toast.error(
        "Please archive/move all cards from the folder before deleting it."
      );
      return;
    }
    const res = await deleteFolder(circle?.id || "", id);
    console.log({ res });

    if (res?.id) {
      console.log("Folder deleted successfully");
      setCircleData(res);
    }
  };

  const updateTitle = useCallback(async () => {
    if (folderTitle.length == 0) {
      setFolderTitle(name);
      return;
    }
    const updatedCircle = await updateFolder(
      { name: folderTitle },
      circle?.id || "",
      id
    );
    if (updatedCircle?.id) {
      setCircleData(updatedCircle);
    }
  }, [folderTitle]);

  const CardDraggable = (provided: DroppableProvided) => (
    <ScrollContainer
      {...provided.droppableProps}
      ref={provided.innerRef}
      mode={mode}
      id="scroll-container"
    >
      {content?.map((card, i) => {
        if (projects?.[card] && card) {
          return <Card card={card} index={i} projects={projects} />;
        }
        if (workstreams?.[card] && card) {
          return (
            <Card card={card} index={i} key={card} workstreams={workstreams} />
          );
        }
        if (
          card &&
          collections?.[card] &&
          collections?.[card].archived !== true
        ) {
          return (
            <Card card={card} index={i} key={card} collections={collections} />
          );
        }
      })}
      {provided.placeholder}
    </ScrollContainer>
  );

  const CardDraggableCallback = useCallback(CardDraggable, [
    content,
    workstreams,
    circle,
    collections,
  ]);

  function DraggableContent(provided: DraggableProvided) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Stack direction={"horizontal"} align={"center"} space="1">
          <NameInput
            placeholder="Add Title"
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
            onBlur={() => updateTitle()}
            mode={mode}
            maxLength={20}
          />
          {canDo("manageCircleSettings") && hover && (
            <Box onClick={ondeleteFolder} cursor="pointer">
              <Text variant="label">
                <IconTrash size={"5"} />
              </Text>
            </Box>
          )}
        </Stack>
        <Droppable droppableId={id} type="content" direction="horizontal">
          {CardDraggableCallback}
        </Droppable>
      </Box>
    );
  }
  const DraggableContentCallback = useCallback(DraggableContent, [
    CardDraggableCallback,
    canDo,
    circle,
  ]);

  return (
    <Draggable draggableId={id} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Folder);
