import { CardType, ColumnType } from "@/app/types";
import {
  Box,
  Button,
  IconCog,
  IconPlus,
  IconPlusSmall,
  Input,
  Stack,
  Tag,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import CardComponent from "../CardComponent";
import CreateCardModal from "../CreateCardModal";

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
  height: calc(100vh - 7.4rem);
  overflow-y: none;
  width: 22rem;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 12rem);
  border-radius: 0.5rem;
  overflow-y: auto;
`;

const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.1rem;
  caret-color: rgb(255, 255, 255, 0.85);
  color: rgb(255, 255, 255, 0.85);
  font-weight: 400;
  margin-left: 0.1rem;
`;

export default function ColumnComponent({ cards, id, column, index }: Props) {
  const router = useRouter();

  const [showCreateTask, setShowCreateTask] = useState(false);
  // const [showCreateGithubTask, setShowCreateGithubTask] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const handleTaskClose = () => setIsTaskOpen(false);
  const [taskId, setTaskId] = useState("");
  const [currentColumnTitle, setCurrentColumnTitle] = useState(column.name);
  const [columnTitle, setColumnTitle] = useState(column.name);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleCreateCardClose = () => {
    setShowCreateTask(false);
  };

  function updateColumn() {
    //   if (currentColumnTitle !== columnTitle) {
    //     runMoralisFunction('updateColumnName', {
    //       boardId: bid,
    //       columnId: id,
    //       newName: columnTitle,
    //     })
    //       .then((res: BoardData) => {
    //         console.log(res);
    //         setSpace(res);
    //       })
    //       .catch((err: any) => {
    //         notify(
    //           'Sorry! There was an error while updating column name',
    //           'error'
    //         );
    //       });
    //   }
  }

  // useEffect(() => {
  //   setColumnTitle(space.columns[column.id].title);
  // }, [space]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <CreateCardModal column={id} handleClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
      <Draggable
        draggableId={id}
        index={index}
        // isDragDisabled={space.roles[user?.id as string] !== 3}
      >
        {(provided) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            borderWidth="0.375"
            borderRadius="2xLarge"
            padding="2"
            borderColor="backgroundTertiary"
            backgroundColor="foregroundTertiary"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Stack direction="horizontal">
                <NameInput
                  placeholder="Add Title"
                  value={columnTitle}
                  onChange={(e) => setColumnTitle(e.target.value)}
                  onBlur={() => updateColumn()}
                  //   disabled={space.roles[user?.id as string] !== 3}
                />

                {/* <Button shape="circle" size="small" variant="transparent">
                    <IconCog size="5" />
                  </Button> */}
                {/* <ColumnSettings column={column} /> */}
                <Button
                  shape="circle"
                  size="small"
                  variant="transparent"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <IconPlusSmall />
                </Button>
              </Stack>
            </Box>
            <Droppable droppableId={id} type="task">
              {(provided2) => (
                <ScrollContainer
                  {...provided2.droppableProps}
                  ref={provided2.innerRef}
                >
                  <Box>
                    {cards?.map((card, idx) => {
                      if (card) {
                        return (
                          <CardComponent
                            card={card}
                            index={idx}
                            column={column}
                          />
                        );
                      }
                      return <div key="key" />;
                    })}
                    {provided2.placeholder}
                  </Box>
                </ScrollContainer>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    </>
  );
}
