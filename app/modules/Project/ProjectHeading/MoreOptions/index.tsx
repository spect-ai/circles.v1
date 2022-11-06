import { Box, Stack, Text, useTheme } from "degen";
import { memo, useCallback } from "react";
import styled from "styled-components";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { CardType } from "@/app/types";
import Filter from "./Filter";
import { useGlobal } from "@/app/context/globalContext";
import CardComponent from "@/app/modules/Project/CardComponent/index";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { SortBy } from "./Sort";
import { GroupBy } from "./Group";
import { SearchByTitle } from "./Search";
import { Show } from "./Show";

type ColumnProps = {
  cards: CardType[];
  column: {
    columnId: string;
    name: string;
    cards: string[];
    defaultCardType: "Task" | "Bounty";
    access?: {
      canCreateCard: string;
    };
  };
};

const BoundingBox = styled(Box)<{ mode: string }>`
  padding: 0.2rem 1rem;
  margin: 0.3rem;
  border-radius: 0.5rem;
  background-color: ${({ mode }) =>
    mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)"};
`;

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

export function AssigneeColumn({ cards, column }: ColumnProps) {
  const CardDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Box>
        {cards?.map((card, idx) => {
          if (card) {
            return <CardComponent card={card} index={idx} key={card.id} />;
          }
        })}
      </Box>
      {provided.placeholder}
    </ScrollContainer>
  );

  const CardDraggableCallback = useCallback(CardDraggable, [cards]);

  return (
    <Container
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
          <Text variant="large" size="large">
            {column.name}
          </Text>
        </Stack>
      </Box>
      <Droppable
        droppableId={
          column.columnId.length < 1 ? "unassigned" : column.columnId
        }
        type="task"
      >
        {CardDraggableCallback}
      </Droppable>
    </Container>
  );
}

function AdvancedOptions() {
  const { advFilters, localProject: project } = useLocalProject();
  const { mode } = useTheme();
  const hide = project.defaultView == "Gantt" || project.defaultView == "Table";
  const show = project.defaultView == "Board" || project.defaultView == "List";
  return (
    <Box display="flex" flexDirection="column" width="full">
      <BoundingBox
        width="full"
        height="10"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mode={mode}
      >
        <SearchByTitle />
        <Box
          display="flex"
          flexDirection="row"
          width={hide ? "76" : advFilters.sortBy == "none" ? "1/2" : "168"}
          gap={project.defaultView == "Gantt" ? "4" : "10"}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Filter />
          <SortBy />
          {show && <GroupBy />}
          {show && <Show />}
        </Box>
      </BoundingBox>
    </Box>
  );
}

export default memo(AdvancedOptions);
