import React, { memo, useCallback, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconTrash, Stack, useTheme, Button } from "degen";
import styled from "styled-components";
import Card from "./card";
import { CircleType, ProjectType, RetroType } from "@/app/types";
import { deleteFolder, updateFolder } from "@/app/services/Folders";
import { useCircle } from "../../CircleContext";
import { Container, Row, Col } from "react-grid-system";
import CreateFolderItem from "./CreateFolderItem";

interface Props {
  content: string[];
  avatar: string;
  name: string;
  id: string;
  index: number;
  projects: { [key: string]: ProjectType };
  workstreams: { [key: string]: CircleType };
  retros: {
    [key: string]: RetroType;
  };
}

const NameInput = styled.input<{ mode: string }>`
  width: 15rem;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.3rem;
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
`;

const Folder = ({
  content,
  avatar,
  id,
  name,
  index,
  projects,
  workstreams,
  retros,
}: Props) => {
  const { canDo } = useRoleGate();
  const { mode } = useTheme();
  const { localCircle: circle, setCircleData } = useCircle();
  const [folderTitle, setFolderTitle] = useState(name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ondeleteFolder = async () => {
    const res = await deleteFolder(circle.id, id);
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
      circle.id,
      id
    );
    console.log({ updatedCircle });
    if (updatedCircle?.id) {
      setCircleData(updatedCircle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderTitle]);

  const CardDraggable = (provided: DroppableProvided) => (
    <ScrollContainer
      {...provided.droppableProps}
      ref={provided.innerRef}
      mode={mode}
    >
      <Container style={{ marginLeft: "0px" }}>
        <Row>
          {content?.map((card, i) => {
            if (projects?.[card] && card) {
              return (
                <Card card={card} index={i} key={card} projects={projects} />
              );
            }
            if (workstreams?.[card] && card) {
              return (
                <Card
                  card={card}
                  index={i}
                  key={card}
                  workstreams={workstreams}
                />
              );
            }
            if (retros?.[card] && card) {
              return <Card card={card} index={i} key={card} retros={retros} />;
            }
          })}
        </Row>
      </Container>
      {provided.placeholder}
    </ScrollContainer>
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const CardDraggableCallback = useCallback(CardDraggable, [
    content,
    projects,
    retros,
    workstreams,
    circle,
  ]);

  function DraggableContent(provided: DraggableProvided) {
    return (
      <Box
        paddingY={"2"}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Stack direction={"horizontal"} align={"center"}>
          <NameInput
            placeholder="Add Title"
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
            onBlur={() => updateTitle()}
            mode={mode}
            maxLength={20}
          />
          {canDo("manageCircleSettings") && <CreateFolderItem folderId={id} />}
          {avatar !== "All" &&
            content.length == 0 &&
            canDo("manageCircleSettings") && (
              <Button
                data-tour="circle-create-folder-button"
                size="small"
                variant="transparent"
                shape="circle"
                onClick={ondeleteFolder}
              >
                <IconTrash size={"5"} />
              </Button>
            )}
        </Stack>
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={id} type="content">
            {CardDraggableCallback}
          </Droppable>
        </Box>
      </Box>
    );
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [
    CardDraggableCallback,
    canDo,
    circle,
    circle?.folderOrder,
    circle?.folderDetails,
  ]);

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={true}>
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Folder);
