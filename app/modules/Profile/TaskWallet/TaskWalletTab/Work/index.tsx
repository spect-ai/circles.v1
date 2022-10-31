import { FunctionComponent, useState, useEffect, memo } from "react";
import { Box, Avatar, Text, useTheme } from "degen";
import styled from "styled-components";
import { UserType, CardDetails } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import Link from "next/link";
import { Card, GigInfo, TextBox, ScrollContainer } from "../index";
import ReactPaginate from "react-paginate";

interface Props {
  toggle: string;
  setToggle: (toggle: string) => void;
  userData?: UserType;
}

const ToggleButton = styled.button<{ bgcolor: boolean }>`
  border-radius: 2rem;
  border: none;
  padding: 0.4rem 1rem;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  font-family: Inter;
  transition-duration: 0.4s;
  color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242)" : "rgb(191,90,242,0.8)"};
  background-color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242,0.1)" : "transparent"};
`;

export const Paginate = styled(ReactPaginate)<{ mode: string }>`
  display: flex;
  flex-direction: row;
  width: 24rem;
  margin: 1rem 30%;
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

export const Toggle: FunctionComponent<Props> = ({ toggle, setToggle }) => {
  const { mode } = useTheme();

  return (
    <Box
      backgroundColor={mode === "dark" ? "background" : "white"}
      style={{
        padding: "0.2rem",
        borderRadius: "2rem",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      <ToggleButton
        onClick={() => setToggle("Assignee")}
        bgcolor={toggle == "Assignee" ? true : false}
      >
        assignee
      </ToggleButton>
      <ToggleButton
        onClick={() => setToggle("Reviewer")}
        bgcolor={toggle == "Reviewer" ? true : false}
      >
        reviewer
      </ToggleButton>
      <ToggleButton
        onClick={() => setToggle("Applicant")}
        bgcolor={toggle == "Applicant" ? true : false}
      >
        applicant
      </ToggleButton>
    </Box>
  );
};

const EmptyText = ({ emptyText }: { emptyText: string }) => {
  return (
    <Box style={{ margin: "10rem 13rem" }}>
      <Text color="accent" align="center">
        Looks like you have no active {emptyText}.
      </Text>
    </Box>
  );
};

const WorkCards: FunctionComponent<Props> = ({ toggle, userData }) => {
  const { mode } = useTheme();
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(0);
  const [cardListLength, setCardListLength] = useState(0);

  useEffect(() => {
    if (toggle == "Assignee") {
      setCardListLength(userData?.assignedCards?.length as number);
    } else if (toggle == "Reviewer") {
      setCardListLength(userData?.reviewingCards?.length as number);
    } else if (toggle == "Applicant") {
      setCardListLength(userData?.activeApplications?.length as number);
    }
    setEndOffset(itemOffset + 7);
    if (cardListLength < 8) {
      setPageCount(Math.floor(cardListLength / 7));
    } else {
      setPageCount(Math.ceil(cardListLength / 7));
    }
  }, [toggle, endOffset, itemOffset, cardListLength, userData]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * 7) % cardListLength;
    setItemOffset(newOffset);
  };

  return (
    <Box
      style={{
        position: "relative",
        height: "70vh",
        alignItems: "center",
      }}
    >
      {toggle == "Assignee" && userData?.assignedCards?.length == 0 && (
        <EmptyText emptyText="assigned cards" />
      )}
      {toggle == "Reviewer" && userData?.reviewingCards?.length == 0 && (
        <EmptyText emptyText="reviewing cards" />
      )}
      {toggle == "Applicant" && userData?.activeApplications?.length == 0 && (
        <EmptyText emptyText="applications" />
      )}
      <ScrollContainer
        overflow="auto"
        gap="2"
        display="flex"
        flexDirection="column"
      >
        {toggle == "Assignee" &&
          userData?.assignedCards
            ?.slice(0)
            .reverse()
            .slice(itemOffset, endOffset)
            .map((cardId) => {
              const card: CardDetails = userData?.cardDetails[cardId];
              const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
              return (
                <Link href={cardLink} key={cardId}>
                  <Card mode={mode}>
                    <TextBox>
                      <Text
                        weight="medium"
                        variant="base"
                        wordBreak="break-word"
                      >
                        {card?.title}
                      </Text>
                    </TextBox>
                    <GigInfo>
                      {card?.priority > 0 && (
                        <PriorityIcon priority={card?.priority} />
                      )}
                      {card?.reviewer?.map((person) => (
                        <Avatar
                          label="profile-pic"
                          src={person?.avatar}
                          size="6"
                          key={person.id}
                          address={person.ethAddress}
                        />
                      ))}
                      <Avatar
                        label="profile-pic"
                        src={card?.circle?.avatar}
                        size="6"
                      />
                    </GigInfo>
                  </Card>
                </Link>
              );
            })}
        {toggle == "Reviewer" &&
          userData?.reviewingCards
            ?.slice(0)
            .reverse()
            .slice(itemOffset, endOffset)
            .map((cardId) => {
              const card: CardDetails = userData?.cardDetails[cardId];
              const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
              return (
                <Link href={cardLink} key={cardId}>
                  <Card mode={mode} onClick={() => console.log({ cardLink })}>
                    <TextBox>
                      <Text
                        weight="medium"
                        variant="base"
                        wordBreak="break-word"
                      >
                        {card?.title}
                      </Text>
                    </TextBox>
                    <GigInfo>
                      {card?.priority > 0 && (
                        <PriorityIcon priority={card?.priority} />
                      )}
                      {card?.assignee?.map((person) => (
                        <Avatar
                          label="profile-pic"
                          src={person?.avatar}
                          size="6"
                          key={person.id}
                        />
                      ))}
                      <Avatar
                        label="profile-pic"
                        src={card?.circle?.avatar}
                        size="6"
                      />
                    </GigInfo>
                  </Card>
                </Link>
              );
            })}
        {toggle == "Applicant" &&
          userData?.activeApplications
            ?.slice(0)
            .reverse()
            .slice(itemOffset, endOffset)
            .map((cardid) => {
              const card: CardDetails = userData?.cardDetails[cardid.cardId];
              const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
              return (
                <Link href={cardLink} key={cardid.cardId}>
                  <Card mode={mode} onClick={() => console.log({ cardLink })}>
                    <TextBox>
                      <Text
                        weight="medium"
                        variant="base"
                        wordBreak="break-word"
                      >
                        {card?.title}
                      </Text>
                    </TextBox>
                    <GigInfo>
                      {card?.priority > 0 && (
                        <PriorityIcon priority={card?.priority} />
                      )}
                      {card?.assignee?.map((person) => (
                        <Avatar
                          label="profile-pic"
                          src={person?.avatar}
                          size="6"
                          key={person.id}
                        />
                      ))}
                      <Avatar
                        label="profile-pic"
                        src={card?.circle?.avatar}
                        size="6"
                      />
                    </GigInfo>
                  </Card>
                </Link>
              );
            })}
      </ScrollContainer>
      <Box position="absolute" bottom="2">
        <Paginate
          breakLabel=".."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          pageCount={pageCount}
          previousLabel="Previous"
          renderOnZeroPageCount={() => null}
          mode={mode}
          key="WorkTab"
        />
      </Box>
    </Box>
  );
};

export default memo(WorkCards);
