import {
  Box,
  Stack,
  Tag,
  Text,
  useTheme,
  IconSearch,
  IconEth,
  AvatarGroup,
} from "degen";
import { useState, memo, useMemo } from "react";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CardType, CardsType } from "@/app/types";
import { PopoverOption } from "../../Card/OptionPopover";
import Popover from "@/app/common/components/Popover";
import Filter from "../Filter";
import QuickActions from "@/app/modules/Project/CardComponent/QuickActions";
import { useRouter } from "next/router";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { monthMap } from "@/app/common/utils/constants";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { useGlobal } from "@/app/context/globalContext";

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

type Props = {
  card: CardType;
  index: number;
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

const CardContainer = styled(Box)<{ mode: string }>`
  border-width: 2px;
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
  cursor: pointer;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 6rem);
  border-radius: 0.5rem;
  overflow-y: auto;
`;

function CardComponent({ card, index }: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const [hover, setHover] = useState(false);
  const { mode } = useTheme();

  const { getMemberAvatars, getMemberDetails } = useModalOptions();

  const deadline = useMemo(() => new Date(card.deadline), [card.deadline]);

  return (
    <CardContainer
      padding="4"
      marginBottom="2"
      borderRadius="large"
      onClick={() => {
        void router.push(`/${cId}/${pId}/${card.slug}`);
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      mode={mode}
    >
      <Box>
        <Box marginTop="1" marginBottom="4">
          <Stack direction="horizontal" space="2" justify="space-between">
            <Text weight="semiBold">{card.title}</Text>
            {card.assignee.length > 0 &&
              card.assignee[0] &&
              getMemberDetails(card.assignee[0]) && (
                <AvatarGroup members={getMemberAvatars(card.assignee)} hover />
              )}
          </Stack>
        </Box>
        <Stack direction="horizontal" wrap space="2">
          {card.status.paid && (
            <Tag size="small" tone="green">
              <Text color="green">Paid</Text>
            </Tag>
          )}
          {card.type === "Bounty" && (
            <Tag size="small">
              <Text color="accent">{card.type}</Text>
            </Tag>
          )}
          {card.reward.value ? (
            <Tag size="small">
              <Text color="accent">
                <Stack direction="horizontal" space="0" align="center">
                  <IconEth size="3.5" />
                  {card.reward.value} {card.reward.token?.symbol}
                </Stack>
              </Text>
            </Tag>
          ) : null}
          {card.deadline && (
            <Tag size="small">
              <Text color="accent">
                {deadline.getDate()}{" "}
                {monthMap[deadline.getMonth() as keyof typeof monthMap]}
              </Text>
            </Tag>
          )}
          {card.priority ? <PriorityIcon priority={card.priority} /> : null}
          {card?.labels?.map((label) => (
            <Tag size="small" key={label}>
              {label}
            </Tag>
          ))}
        </Stack>
        <QuickActions card={card} hover={hover} />
      </Box>
    </CardContainer>
  );
}

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
  const { view, viewName } = useGlobal();
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [orderIsOpen, setOrderIsOpen] = useState(false);
  const [groupByIsOpen, setGroupByIsOpen] = useState(false);
  const { mode } = useTheme();

  return (
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
              inputTitle: e.target.value,
              groupBy: advFilters.groupBy,
              sortBy: advFilters.sortBy,
              order: advFilters.order,
            });
          }}
        />
        {advFilters.inputTitle.length > 0 && (
          <Box
            onClick={() =>
              setAdvFilters({
                inputTitle: "",
                groupBy: advFilters.groupBy,
                sortBy: advFilters.sortBy,
                order: advFilters.order,
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
            ? view === 2 || viewName !== ""
              ? "48"
              : "96"
            : view === 2 || viewName !== ""
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
                  inputTitle: advFilters.inputTitle,
                  groupBy: advFilters.groupBy,
                  sortBy: "none",
                  order: advFilters.order,
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
                  inputTitle: advFilters.inputTitle,
                  groupBy: advFilters.groupBy,
                  sortBy: "Priority",
                  order: advFilters.order,
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
                  inputTitle: advFilters.inputTitle,
                  groupBy: advFilters.groupBy,
                  sortBy: "Deadline",
                  order: advFilters.order,
                });
              }}
            >
              Deadline
            </PopoverOption>
          </Box>
        </Popover>
        {advFilters.sortBy !== "none" && (
          <Popover
            butttonComponent={
              <Box
                data-tour="order-options-button"
                cursor="pointer"
                onClick={() => setOrderIsOpen(!sortIsOpen)}
                color="foreground"
                display="flex"
                flexDirection="row"
                gap="3"
              >
                <Text whiteSpace="nowrap">Order</Text>
                <Tag size="medium" hover>
                  {advFilters.order}
                </Tag>
              </Box>
            }
            isOpen={orderIsOpen}
            setIsOpen={setOrderIsOpen}
          >
            <Box
              backgroundColor="background"
              borderWidth="0.5"
              borderRadius="2xLarge"
              width="36"
            >
              <PopoverOption
                tourId="asc-button"
                onClick={() => {
                  setOrderIsOpen(false);
                  setAdvFilters({
                    inputTitle: advFilters.inputTitle,
                    groupBy: advFilters.groupBy,
                    sortBy: advFilters.sortBy,
                    order: "asc",
                  });
                }}
              >
                Ascending
              </PopoverOption>
              <PopoverOption
                tourId="des-button"
                onClick={() => {
                  setOrderIsOpen(false);
                  setAdvFilters({
                    inputTitle: advFilters.inputTitle,
                    groupBy: advFilters.groupBy,
                    sortBy: advFilters.sortBy,
                    order: "des",
                  });
                }}
              >
                Descending
              </PopoverOption>
            </Box>
          </Popover>
        )}
        {view !== 2 && (
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
                    inputTitle: advFilters.inputTitle,
                    groupBy: "Status",
                    sortBy: advFilters.sortBy,
                    order: advFilters.order,
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
                    inputTitle: advFilters.inputTitle,
                    groupBy: "Assignee",
                    sortBy: advFilters.sortBy,
                    order: advFilters.order,
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
  );
}

export default memo(AdvancedOptions);
