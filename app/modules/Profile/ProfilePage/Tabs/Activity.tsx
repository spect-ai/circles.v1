import { memo, useState, useEffect } from "react";
import { Box, Text, Tag, Avatar, useTheme } from "degen";
import { UserType, CardDetails } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { ScrollContainer, Card, TextBox, GigInfo, Tags } from "./index";

const Paginate = styled(ReactPaginate)<{ mode: string }>`
  display: flex;
  flex-direction: row;
  width: 30rem;
  margin: 1rem auto;
  justify-content: space-between;
  list-style-type: none;
  li a {
    border-radius: 7px;
    padding: 0.1rem 0.5rem;
    border: ${(props) =>
        props.mode === "dark"
          ? "rgb(255, 255, 255, 0.02)"
          : "rgb(20, 20, 20, 0.2)"}
      1px solid;
    cursor: pointer;
    color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(20, 20, 20, 0.5)"};
  }
  li.selected a {
    color: rgb(191, 90, 242, 1);
    border-color: rgb(191, 90, 242, 0.2);
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    border-color: transparent;
    color: rgb(191, 90, 242, 1);
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

const Activity = ({ userData }: { userData: UserType }) => {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(0);
  const { mode } = useTheme();

  const allcards = userData?.reviewingClosedCards?.concat(
    userData?.assignedClosedCards,
    userData?.reviewingCards,
    userData?.assignedCards
  );

  useEffect(() => {
    setEndOffset(itemOffset + 5);
    if (allcards?.length < 6) {
      setPageCount(Math.floor(allcards?.length / 5));
    } else {
      setPageCount(Math.ceil(allcards?.length / 5));
    }
  }, [allcards?.length, endOffset, itemOffset]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * 5) % allcards?.length;
    setItemOffset(newOffset);
  };

  return (
    <Box>
      <ScrollContainer>
        {allcards?.length == 0 && (
          <Box style={{ margin: "35vh 15vw" }}>
            <Text color="accent" align="center">
              Woah, such empty.
            </Text>
          </Box>
        )}
        {allcards
          ?.slice(0)
          .reverse()
          .slice(itemOffset, endOffset)
          .map((cardId: string) => {
            const card: CardDetails = userData?.cardDetails?.[cardId];
            const cardLink = `${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
            return (
              <Card
                mode={mode}
                key={cardId}
                onClick={() => window.open(`/${cardLink}`)}
              >
                <TextBox>
                  <Text variant="extraLarge" wordBreak="break-word">
                    {card?.title}
                  </Text>
                </TextBox>
                <Tags>
                  {card?.labels?.map((tag) => (
                    <Tag as="span" size="small" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                  {card?.priority > 0 && (
                    <PriorityIcon priority={card?.priority} />
                  )}
                </Tags>
                <GigInfo>
                  <Tag hover>
                    {userData?.reviewingClosedCards?.includes(cardId)
                      ? "Reviewed"
                      : userData?.assignedClosedCards?.includes(cardId)
                      ? "Worked On"
                      : userData?.reviewingCards?.includes(cardId)
                      ? "Reviewing"
                      : "Working On"}
                  </Tag>
                  <Avatar
                    label="profile-pic"
                    src={card?.circle?.avatar}
                    size="6"
                  />
                </GigInfo>
              </Card>
            );
          })}
      </ScrollContainer>
      <Paginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="< Previous"
        renderOnZeroPageCount={() => null}
        mode={mode}
      />
    </Box>
  );
};

export default memo(Activity);
