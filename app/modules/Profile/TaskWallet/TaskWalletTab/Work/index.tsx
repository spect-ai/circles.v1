import { FunctionComponent } from "react";
import { Box, Avatar, Text, useTheme } from "degen";
import styled from "styled-components";
import { UserType, CardDetails } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import Link from "next/link";
import { Card, GigInfo, TextBox } from "../index";

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
  color: ${(props) => (props.bgcolor ? "white" : "rgb(191,90,242)")};
  background-color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242)" : "transparent"};
`;

export const Toggle: FunctionComponent<Props> = ({ toggle, setToggle }) => {
  const { mode } = useTheme();

  return (
    <>
      <Box
        backgroundColor={mode === "dark" ? "background" : "white"}
        style={{
          display: "block",
          padding: "0.2rem",
          borderRadius: "2rem",
          margin: "0.7rem 140px",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
        }}
      >
        <ToggleButton
          onClick={() => setToggle("Assignee")}
          bgcolor={toggle == "Assignee" ? true : false}
        >
          As Assignee
        </ToggleButton>
        <ToggleButton
          onClick={() => setToggle("Reviewer")}
          bgcolor={toggle == "Reviewer" ? true : false}
        >
          As Reviewer
        </ToggleButton>
        <ToggleButton
          onClick={() => setToggle("Applicant")}
          bgcolor={toggle == "Applicant" ? true : false}
        >
          As Applicant
        </ToggleButton>
      </Box>
    </>
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

  return (
    <Box gap="2" display="flex" flexDirection="column">
      {toggle == "Assignee" && userData?.assignedCards?.length == 0 && (
        <EmptyText emptyText="assigned cards" />
      )}
      {toggle == "Reviewer" && userData?.reviewingCards?.length == 0 && (
        <EmptyText emptyText="reviewing cards" />
      )}
      {toggle == "Applicant" && userData?.activeApplications?.length == 0 && (
        <EmptyText emptyText="applications" />
      )}
      {toggle == "Assignee" &&
        userData?.assignedCards
          ?.slice(0)
          .reverse()
          .map((cardId) => {
            const card: CardDetails = userData?.cardDetails[cardId];
            const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
            return (
              <Link href={cardLink} key={cardId}>
                <Card mode={mode}>
                  <TextBox>
                    <Text weight="medium" variant="base" wordBreak="break-word">
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
          .map((cardId) => {
            const card: CardDetails = userData?.cardDetails[cardId];
            const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
            return (
              <Link href={cardLink} key={cardId}>
                <Card mode={mode} onClick={() => console.log({ cardLink })}>
                  <TextBox>
                    <Text weight="medium" variant="base" wordBreak="break-word">
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
          .map((cardid) => {
            const card: CardDetails = userData?.cardDetails[cardid.cardId];
            const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
            return (
              <Link href={cardLink} key={cardid.cardId}>
                <Card mode={mode} onClick={() => console.log({ cardLink })}>
                  <TextBox>
                    <Text weight="medium" variant="base" wordBreak="break-word">
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
    </Box>
  );
};

export default WorkCards;
