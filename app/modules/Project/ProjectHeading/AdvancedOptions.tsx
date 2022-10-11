import { Box, Stack, Tag, Text, useTheme, IconSearch } from "degen";
import { useState, memo, useCallback } from "react";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CardType, CardsType } from "@/app/types";
import { PopoverOption } from "../../Card/OptionPopover";
import Popover from "@/app/common/components/Popover";
import Filter from "../Filter";
import { useGlobal } from "@/app/context/globalContext";
import CardComponent from "@/app/modules/Project/CardComponent/index";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";

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

const Input = styled.input`
  background-color: transparent;
  border: none;
  margin: 0.4rem;
  padding: 0.4rem;
  display: flex;
  border-style: none;
  border-color: transparent;
  border-radius: 0.4rem;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 400;
  opacity: "40%";
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

export function titleFilter(cards: CardType[], inputTitle: string): CardType[] {
  if (!inputTitle) return cards;

  const filteredCards = Object.values(cards)?.filter((card) => {
    const { title } = card;
    if (inputTitle.length > 0) {
      const searchString = inputTitle.toLowerCase();
      const titleToSearch = title.toLowerCase();
      const titleSearch = titleToSearch.includes(searchString);
      if (titleSearch == true) {
        return card;
      } else {
        return false;
      }
    }
  });

  let ProjectCards = filteredCards.reduce(
    (rest, card) => [...rest, card],
    [{} as CardType]
  );

  ProjectCards = ProjectCards.filter((i) => i?.id !== undefined);

  return ProjectCards;
}

export function groupByAssignee(assigneeId: string, cards: CardsType) {
  const res = Object.values(cards)?.filter((card) => {
    if (card === undefined) return false;
    let assigneeFilt = false;
    const { assignee } = card;

    if (assignee.length == 0 && assigneeId.length == 0) return card;

    for (let i = 0; i < assignee.length; i += 1) {
      if (assigneeId == assignee[i]) {
        assigneeFilt = true;
        break;
      }
    }

    if (assigneeFilt == true) {
      return card;
    } else {
      return null;
    }
  });

  return res;
}

export function sortBy(
  field: string,
  cards: CardType[],
  order?: string
): CardType[] {
  if (field == "none" || !field) return cards;
  const vcards = cards.slice(0);
  if (field == "Deadline") {
    if (order == "asc") {
      vcards.sort(function (a, b) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else {
      vcards.sort(function (a, b) {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      });
    }
  }
  if (field == "Priority") {
    if (order == "asc") {
      vcards.sort(function (a, b) {
        return a.priority - b.priority;
      });
    } else {
      vcards.sort(function (a, b) {
        return b.priority - a.priority;
      });
    }
  }
  return vcards;
}

function AdvancedOptions() {
  const { advFilters, setAdvFilters } = useLocalProject();
  const { view } = useGlobal();
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [groupByIsOpen, setGroupByIsOpen] = useState(false);
  const { mode } = useTheme();

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
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          paddingLeft="3"
        >
          <IconSearch size="4" color="foreground" />
          <Input
            placeholder="Search Card"
            value={advFilters.inputTitle}
            onChange={(e) => {
              setAdvFilters({
                ...advFilters,
                inputTitle: e.target.value,
              });
            }}
          />
          {advFilters.inputTitle.length > 0 && (
            <Box
              onClick={() =>
                setAdvFilters({
                  ...advFilters,
                  inputTitle: "",
                })
              }
              style={{
                cursor: "pointer",
              }}
            >
              <Tag size="medium" hover>
                Clear
              </Tag>
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          width={
            advFilters.sortBy == "none"
              ? view === 2 || view === 3
                ? "64"
                : "112"
              : view === 2 || view === 3
              ? "76"
              : "128"
          }
          gap={view === 2 ? "4" : "10"}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Filter />
          <Popover
            butttonComponent={
              <Box display="flex" flexDirection="row" gap="2">
                <Box
                  data-tour="sortby-options-button"
                  cursor="pointer"
                  onClick={() => setSortIsOpen(!sortIsOpen)}
                  color="foreground"
                  display="flex"
                  flexDirection="row"
                  gap="3"
                >
                  <Text whiteSpace="nowrap">Sort By</Text>
                  <Tag size="medium" hover>
                    {advFilters.sortBy}
                  </Tag>
                </Box>
                {advFilters.sortBy !== "none" && (
                  <Box
                    data-tour="order-options-button"
                    cursor="pointer"
                    onClick={() => {
                      if (advFilters.order == "asc") {
                        setAdvFilters({
                          ...advFilters,
                          order: "des",
                        });
                      } else {
                        setAdvFilters({
                          ...advFilters,
                          order: "asc",
                        });
                      }
                    }}
                    color="foreground"
                    display="flex"
                    flexDirection="row"
                    gap="3"
                  >
                    <Tag size="medium" hover tone="accent">
                      {advFilters.order}
                    </Tag>
                  </Box>
                )}
              </Box>
            }
            isOpen={sortIsOpen}
            setIsOpen={setSortIsOpen}
          >
            <Box
              backgroundColor="background"
              borderWidth="0.5"
              borderRadius="2xLarge"
              width="36"
            >
              <PopoverOption
                tourId="sortby-none-button"
                onClick={() => {
                  setSortIsOpen(false);
                  setAdvFilters({
                    ...advFilters,
                    sortBy: "none",
                  });
                }}
              >
                None (default)
              </PopoverOption>
              <PopoverOption
                tourId="sortby-priority-button"
                onClick={() => {
                  setSortIsOpen(false);
                  setAdvFilters({
                    ...advFilters,
                    sortBy: "Priority",
                  });
                }}
              >
                Priority
              </PopoverOption>
              <PopoverOption
                tourId="sortby-deadline-button"
                onClick={() => {
                  setSortIsOpen(false);
                  setAdvFilters({
                    ...advFilters,
                    sortBy: "Deadline",
                  });
                }}
              >
                Deadline
              </PopoverOption>
            </Box>
          </Popover>

          {(view == 0 || view == 1) && (
            <Popover
              butttonComponent={
                <Box
                  data-tour="group-options-button"
                  cursor="pointer"
                  onClick={() => setGroupByIsOpen(!sortIsOpen)}
                  color="foreground"
                  display="flex"
                  flexDirection="row"
                  gap="3"
                >
                  <Text whiteSpace="nowrap">Group By</Text>
                  <Tag size="medium" hover>
                    {advFilters.groupBy}
                  </Tag>
                </Box>
              }
              isOpen={groupByIsOpen}
              setIsOpen={setGroupByIsOpen}
            >
              <Box
                backgroundColor="background"
                borderWidth="0.5"
                borderRadius="2xLarge"
                width="36"
              >
                <PopoverOption
                  tourId="default-button"
                  onClick={() => {
                    setGroupByIsOpen(false);
                    setAdvFilters({
                      ...advFilters,
                      groupBy: "Status",
                    });
                  }}
                >
                  Status (default)
                </PopoverOption>
                <PopoverOption
                  tourId="groupby-assignee-button"
                  onClick={() => {
                    setGroupByIsOpen(false);
                    setAdvFilters({
                      ...advFilters,
                      groupBy: "Assignee",
                    });
                  }}
                >
                  Assignee
                </PopoverOption>
              </Box>
            </Popover>
          )}
        </Box>
      </BoundingBox>
    </Box>
  );
}

export default memo(AdvancedOptions);
