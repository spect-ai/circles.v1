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
import {
  CircleType,
  CollectionType,
  ProjectType,
  RetroType,
} from "@/app/types";
import { deleteFolder, updateFolder } from "@/app/services/Folders";
import { useCircle } from "../../CircleContext";
import { Col, Container, Row } from "react-grid-system";
import CreateFolderItem from "./CreateFolderItem";
import CreateProjectModal from "@/app/modules/Circle/CreateProjectModal";
import CreateSpaceModal from "@/app/modules/Circle/CreateSpaceModal";
import CreateRetroModal from "@/app/modules/Retro/CreateRetro";
import { AnimatePresence } from "framer-motion";
import CreateCollectionModal from "../../CreateCollectionModal";

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
  collections: {
    [key: string]: CollectionType;
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
  collections,
}: Props) => {
  const { canDo } = useRoleGate();
  const { mode } = useTheme();
  const { localCircle: circle, setCircleData } = useCircle();
  const [folderTitle, setFolderTitle] = useState(name);
  const [projectModal, setProjectModal] = useState(false);
  const [workstreamModal, setWorkstreamModal] = useState(false);
  const [retroOpen, setRetroOpen] = useState(false);
  const [collectionModal, setCollectionModal] = useState(false);

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
      <Container style={{ marginLeft: "-1rem" }}>
        <Row>
          {content?.map((card, i) => {
            if (projects?.[card] && card) {
              return (
                <Col
                  sm={6}
                  md={4}
                  lg={2}
                  key={card}
                  style={{
                    margin: "0.5rem 0",
                  }}
                >
                  <Card card={card} index={i} projects={projects} />
                </Col>
              );
            }
            if (workstreams?.[card] && card) {
              return (
                <Col
                  sm={6}
                  md={4}
                  lg={2}
                  key={card}
                  style={{
                    margin: "0.5rem 0",
                  }}
                >
                  <Card
                    card={card}
                    index={i}
                    key={card}
                    workstreams={workstreams}
                  />
                </Col>
              );
            }
            if (retros?.[card] && card) {
              return <Card card={card} index={i} key={card} retros={retros} />;
            }
            if (collections?.[card] && card) {
              return (
                <Col
                  sm={6}
                  md={4}
                  lg={2}
                  key={card}
                  style={{
                    margin: "0.5rem 0",
                  }}
                >
                  <Card
                    card={card}
                    index={i}
                    key={card}
                    collections={collections}
                  />
                </Col>
              );
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
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
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
          {(canDo("createNewCircle") ||
            canDo("createNewProject") ||
            canDo("createNewRetro")) && (
            <CreateFolderItem
              setProjectModal={setProjectModal}
              setWorkstreamModal={setWorkstreamModal}
              setRetroOpen={setRetroOpen}
              setCollectionModal={setCollectionModal}
            />
          )}
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
        <Droppable droppableId={id} type="content">
          {CardDraggableCallback}
        </Droppable>
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
    <>
      <Draggable draggableId={id} index={index}>
        {DraggableContentCallback}
      </Draggable>
      {projectModal && (
        <AnimatePresence>
          <CreateProjectModal folderId={id} setModalOpen={setProjectModal} />
        </AnimatePresence>
      )}
      {workstreamModal && (
        <AnimatePresence>
          <CreateSpaceModal
            folderId={id}
            setWorkstreamModal={setWorkstreamModal}
          />
        </AnimatePresence>
      )}
      {retroOpen && (
        <AnimatePresence>
          <CreateRetroModal
            folderId={id}
            handleClose={() => setRetroOpen(false)}
          />
        </AnimatePresence>
      )}
      {collectionModal && (
        <AnimatePresence>
          <CreateCollectionModal
            folderId={id}
            setCollectionModal={setCollectionModal}
          />
        </AnimatePresence>
      )}
    </>
  );
};

export default memo(Folder);
