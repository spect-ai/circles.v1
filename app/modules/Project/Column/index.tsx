import { updateColumnDetails } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CardType, ColumnType } from "@/app/types";
import { Box, Button, IconCog, IconPlusSmall, Stack, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "react-toastify";
import styled from "styled-components";
import CardComponent from "../CardComponent";
import { useLocalProject } from "../Context/LocalProjectContext";
import CreateCardModal from "../CreateCardModal";
import ColumnSettings from "./ColumnSettings";

type Props = {
  cards: CardType[];
  id: string;
  column: ColumnType;
  index: number;
};

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 7.5rem);
  overflow-y: none;
  width: 22rem;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 6rem);
  border-radius: 0.5rem;
  overflow-y: auto;
`;

const NameInput = styled.input<{ mode: string }>`
  width: auto;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.1rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  font-weight: 400;
  margin-left: 0.1rem;
`;

function ColumnComponent({ cards, id, column, index }: Props) {
  const [columnTitle, setColumnTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { localProject: project, setLocalProject } = useLocalProject();
  const { canDo } = useRoleGate();
  const { mode } = useTheme();

  useHotkeys(
    'c',
    (e) => {
      e.preventDefault()
      if (!canDo(["steward", "contributor"])) {
        toast.error(
          "You don't have permission to add cards in this column",
          { theme: "dark" }
        );
        return;
      }
      setIsOpen(true);
    },
  );
  
  const updateColumn = useCallback(async () => {
    const updatedProject = await updateColumnDetails(
      project.id,
      column.columnId,
      {
        name: columnTitle,
      }
    );
    if (!updatedProject) {
      toast.error("Error updating column");
      setColumnTitle(project.columnDetails[column.columnId].name);
      return;
    }
    setLocalProject(updatedProject);
  }, [columnTitle]);

  const CardDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Box>
        {cards?.map((card, idx) => {
          if (card) {
            return <CardComponent card={card} index={idx} key={card.id} />;
          }
        })}
        {provided.placeholder}
      </Box>
    </ScrollContainer>
  );

  const CardDraggableCallback = useCallback(CardDraggable, [cards]);

  const DraggableContent = (provided: DraggableProvided) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding="2"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box marginBottom="2">
        <Stack
          direction="horizontal"
          space="0"
          align="center"
          justify="space-between"
        >
          <NameInput
            placeholder="Add Title"
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={() => updateColumn()}
            mode={mode}
            //   disabled={space.roles[user?.id as string] !== 3}
          />
          <Box paddingRight="1">
            {/* <Text variant="label">({column.cards.length})</Text> */}
          </Box>
          <Button
            data-tour={`add-card-button`}
            shape="circle"
            size="small"
            variant="transparent"
            onClick={() => {
              if (!canDo(["steward", "contributor"])) {
                toast.error(
                  "You don't have permission to add cards in this column",
                  { theme: "dark" }
                );
                return;
              }
              setIsOpen(true);
            }}
          >
            <IconPlusSmall />
          </Button>
          {canDo(["steward"]) && (
            <Button
              shape="circle"
              size="small"
              variant="transparent"
              onClick={() => {
                setIsSettingsOpen(true);
              }}
            >
              <IconCog />
            </Button>
          )}
        </Stack>
      </Box>
      <Droppable droppableId={id} type="task">
        {CardDraggableCallback}
      </Droppable>
    </Container>
  );

  const DraggableContentCallback = useCallback(DraggableContent, [
    CardDraggableCallback,
    canDo,
    column.cards.length,
    columnTitle,
    id,
    mode,
    updateColumn,
  ]);

  useEffect(() => {
    setColumnTitle(project.columnDetails[column.columnId]?.name);
  }, [project.columnDetails, column.columnId]);
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <CreateCardModal
            column={id}
            handleClose={() => {
              if (isDirty && !showConfirm) {
                setShowConfirm(true);
              } else {
                setIsOpen(false);
              }
            }}
            setIsDirty={setIsDirty}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            setIsOpen={setIsOpen}
          />
        )}
        {isSettingsOpen && (
          <ColumnSettings
            column={column}
            handleClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
      <Draggable
        draggableId={id}
        index={index}
        // isDragDisabled={space.roles[user?.id as string] !== 3}
      >
        {DraggableContentCallback}
      </Draggable>
    </>
  );
}

export default memo(ColumnComponent);
