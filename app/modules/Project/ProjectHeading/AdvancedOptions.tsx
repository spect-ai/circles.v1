import { Box, Stack, Tag, Text, useTheme, IconSearch } from "degen";
import { useState, memo } from "react";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CardType, CardsType } from "@/app/types";
import { PopoverOption } from "../../Card/OptionPopover";
import Popover from "@/app/common/components/Popover";
import CardComponent from "@/app/modules/Project/CardComponent";

type ColumnProps = {
  cards: CardType[];
  column: any;
};

const Input = styled.input`
  background-color: transparent;
  border: none;
  padding: 0.8rem;
  display: flex;
  border-style: none;
  border-color: transparent;
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
  height: calc(100vh - 5rem);
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
      <ScrollContainer>
        <Box>
          {cards?.map((card, idx) => {
            if (card) {
              return <CardComponent card={card} index={idx} key={card.id} />;
            }
          })}
        </Box>
      </ScrollContainer>
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

  const ProjectCards = filteredCards.reduce(
    (rest, card) => [...rest, card],
    [{} as CardType]
  );

  return ProjectCards;
}

export function groupByAssignee(assigneeId: string, cards: CardsType) {
  const res = Object.values(cards)?.filter((card) => {
    if (card === undefined) return false;
    const { assignee } = card;

    if (assignee.length == 0 && assigneeId.length == 0) return card;

    for (let i = 0; i < assignee.length; i += 1) {
      if (assigneeId == assignee[i]) {
        return card;
      } else {
        return false;
      }
    }
  });

  return res;
}

function AdvancedOptions() {
  const { advFilters, setAdvFilters } = useLocalProject();
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useTheme();

  return (
    <Box
      width="full"
      height="10"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{
        padding: "0.5rem",
        borderRadius: "0.5rem",
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        paddingLeft="4"
      >
        <IconSearch size="4" color="foreground" />
        <Input
          placeholder="Search Card"
          value={advFilters.inputTitle}
          onChange={(e) => {
            setAdvFilters({
              inputTitle: e.target.value,
              groupBy: advFilters.groupBy,
            });
          }}
        />
        {advFilters.inputTitle.length > 0 && (
          <Box
            onClick={() =>
              setAdvFilters({
                inputTitle: "",
                groupBy: advFilters.groupBy,
              })
            }
            style={{
              cursor: "pointer",
            }}
          >
            <Tag size="medium">Clear</Tag>
          </Box>
        )}
      </Box>
      <Box>
        <Popover
          butttonComponent={
            <Box
              data-tour="group-options-button"
              cursor="pointer"
              onClick={() => setIsOpen(!isOpen)}
              color="foreground"
            >
              <Stack direction="horizontal" space="2">
                Group By :{" "}
                <Tag size="medium" tone="accent">
                  {advFilters.groupBy}
                </Tag>
              </Stack>
            </Box>
          }
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <Box
            backgroundColor="background"
            borderWidth="0.5"
            borderRadius="2xLarge"
            width="36"
          >
            <PopoverOption
              tourId="project-settings-button"
              onClick={() => {
                setIsOpen(false);
                setAdvFilters({
                  inputTitle: advFilters.inputTitle,
                  groupBy: "Status",
                });
              }}
            >
              Status (default)
            </PopoverOption>
            <PopoverOption
              tourId="batch-pay-button"
              onClick={() => {
                setIsOpen(false);
                setAdvFilters({
                  inputTitle: advFilters.inputTitle,
                  groupBy: "Assignee",
                });
              }}
            >
              Assignee
            </PopoverOption>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}

export default memo(AdvancedOptions);
