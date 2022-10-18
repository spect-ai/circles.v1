import { CircleType, UserType, CardDetails } from "@/app/types";
import { Avatar, Box, Stack, Text, useTheme } from "degen";
import { Row, Col, Container } from "react-grid-system";
import styled from "styled-components";
import Link from "next/link";
import Logo from "@/app/common/components/Logo";
import { useState } from "react";
import { Toggle } from "../Profile/TaskWallet/TaskWalletTab/Work";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { GigInfo, TextBox } from "../Profile/TaskWallet/TaskWalletTab";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-top: 1rem;
  height: calc(100vh - 10rem);
  overflow-y: auto;
`;

const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  padding: 0.6rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
  }
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

const groupByCircles = (
  currentUser: UserType,
  id: string,
  cardsArray: string[]
) => {
  const res = Object.values(currentUser.cardDetails)?.filter((card: any) => {
    if (card === undefined) return currentUser.cardDetails;
    let assigneeFilt = false;
    const circleId = card.circle.id;

    if (circleId == id && cardsArray.includes(card.id)) {
      assigneeFilt = true;
    }

    if (assigneeFilt == true) {
      return card;
    } else {
      return null;
    }
  });

  return res;
};

const Cards = ({ cards, toggle }: { cards: CardDetails[]; toggle: string }) => {
  const { mode } = useTheme();
  return (
    <Container
      style={{
        padding: "0px",
        marginTop: "1rem",
        marginLeft: "0px",
      }}
    >
      <Row gutterWidth={10}>
        {cards
          ?.slice(0)
          .reverse()
          .map((card) => {
            const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
            return (
              <Col key={card.id} xs={10} sm={6} md={4}>
                <Link href={cardLink}>
                  <Card mode={mode}>
                    <Box width="60">
                      <Text
                        weight="medium"
                        variant="base"
                        wordBreak="break-word"
                        ellipsis
                      >
                        {card?.title}
                      </Text>
                    </Box>
                    <GigInfo>
                      {card?.priority > 0 && (
                        <PriorityIcon priority={card?.priority} />
                      )}
                      {toggle == "Reviewer" ? (
                        <>
                          {card?.assignee?.map((person) => (
                            <Avatar
                              label="profile-pic"
                              src={person?.avatar}
                              size="6"
                              key={person.id}
                              address={person.ethAddress}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {card?.reviewer?.map((person) => (
                            <Avatar
                              label="profile-pic"
                              src={person?.avatar}
                              size="6"
                              key={person.id}
                              address={person.ethAddress}
                            />
                          ))}{" "}
                        </>
                      )}
                    </GigInfo>
                  </Card>
                </Link>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

function YourCards({
  circles,
  isLoading,
  currentUser,
}: {
  circles: CircleType[];
  isLoading: boolean;
  currentUser: UserType;
}) {
  const [toggle, setToggle] = useState("Assignee");

  return (
    <ScrollContainer>
      <Box display={"flex"} flexDirection="column">
        <Toggle toggle={toggle} setToggle={setToggle} />
      </Box>
      {!isLoading &&
        circles.map((circle) => {
          const ReviewingCards = groupByCircles(
            currentUser,
            circle.id,
            currentUser.reviewingCards
          );
          const AssignedCards = groupByCircles(
            currentUser,
            circle.id,
            currentUser.assignedCards
          );
          const ApplicationIds = currentUser.activeApplications.map(
            (appl) => appl.cardId
          );
          const Applications = groupByCircles(
            currentUser,
            circle.id,
            ApplicationIds
          );

          if (ReviewingCards.length > 0 && toggle == "Reviewer")
            return (
              <Box key={circle?.id} marginBottom="5">
                <Stack direction={"horizontal"} align="center">
                  <Logo
                    key={circle.id}
                    href={`/${circle.slug}`}
                    src={circle.avatar}
                    gradient={circle.gradient}
                  />
                  <Text variant="extraLarge">{circle?.name}</Text>
                </Stack>
                <Cards cards={ReviewingCards as any} toggle={toggle} />
              </Box>
            );
          if (AssignedCards.length > 0 && toggle == "Assignee")
            return (
              <Box key={circle?.id} marginBottom="5">
                <Stack direction={"horizontal"} align="center">
                  <Logo
                    key={circle.id}
                    href={`/${circle.slug}`}
                    src={circle.avatar}
                    gradient={circle.gradient}
                  />
                  <Text variant="extraLarge">{circle?.name}</Text>
                </Stack>
                <Cards cards={AssignedCards as any} toggle={toggle} />
              </Box>
            );
          if (Applications.length > 0 && toggle == "Applicant")
            return (
              <Box key={circle?.id} marginBottom="5">
                <Stack direction={"horizontal"} align="center">
                  <Logo
                    key={circle.id}
                    href={`/${circle.slug}`}
                    src={circle.avatar}
                    gradient={circle.gradient}
                  />
                  <Text variant="extraLarge">{circle?.name}</Text>
                </Stack>
                <Cards cards={Applications as any} toggle={toggle} />
              </Box>
            );
        })}
    </ScrollContainer>
  );
}

export default YourCards;
