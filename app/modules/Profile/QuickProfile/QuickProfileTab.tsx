import { useState, FunctionComponent } from "react";
import { Box, Avatar, Text, Button, useTheme } from "degen";
import {
  ProjectOutlined,
  StarOutlined,
  FieldTimeOutlined,
  StarFilled,
} from "@ant-design/icons";
import styled from "styled-components";
import { UserType, CardDetails } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";

interface Props {
  toggle: string;
  setToggle: (toggle: string) => void;
  userData?: UserType;
}

interface UserProps {
  userData: UserType;
}

const ScrollContainer = styled(Box)`
  overflow: auto;
  padding-right: 1rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 630px;
  // max-height: 300px;
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

const GigInfo = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 1rem;
  gap: 0.4rem;
`;

const TextBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  width: 510px;
`;

const Toggle: FunctionComponent<Props> = ({ toggle, setToggle }) => {
  const { mode } = useTheme();

  return (
    <>
      <Box
        backgroundColor={mode === "dark" ? "background" : "white"}
        style={{
          display: "block",
          padding: "0.2rem",
          borderRadius: "2rem",
          margin: "0.7rem 200px",
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
      </Box>
    </>
  );
};

const WorkCards: FunctionComponent<Props> = ({ toggle, userData }) => {
  const { mode } = useTheme();

  return (
    <Box gap="2" display="flex" flexDirection="column">
      {toggle == "Assignee"
        ? userData?.assignedCards
            ?.slice(0)
            .reverse()
            .map((cardId) => {
              const card: CardDetails = userData?.cardDetails[cardId];
              const cardLink = `${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
              return (
                <Card
                  mode={mode}
                  key={cardId}
                  onClick={() => window.open(`/${cardLink}`)}
                >
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
              );
            })
        : userData?.reviewingCards
            ?.slice(0)
            .reverse()
            .map((cardId) => {
              const card: CardDetails = userData?.cardDetails[cardId];
              const cardLink = `${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
              return (
                <Card
                  mode={mode}
                  key={cardId}
                  onClick={() => window.open(`/${cardLink}`)}
                >
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
              );
            })}
    </Box>
  );
};

const Notifications = ({ userData }: { userData: UserType }) => {
  return (
    <Box gap="2" display="flex" flexDirection="column" paddingTop={"5"}>
      {userData?.notifications?.map((notif) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.4rem",
              alignItems: "center",
              cursor: "pointer",
            }}
            key={notif.timestamp}
            onClick={() => window.open(`/${notif?.linkPath?.[0]}/`)}
          >
            <Avatar label="profile-pic" size="4" />
            <Text>{notif.content}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

const BookMarks = () => {
  const { mode } = useTheme();

  return (
    <Box marginTop="2" cursor="pointer">
      <Card mode={mode}>
        <Text weight="semiBold" variant="large">
          Bookmarks Card
        </Text>
        <GigInfo>
          <Text variant="label">02:45pm</Text>
          <Avatar label="profile-pic" src="/og.jpg" size="8" />
          <StarFilled style={{ fontSize: "24px", color: "rgb(191,90,242)" }} />
        </GigInfo>
      </Card>
    </Box>
  );
};

const QuickProfileTabs = ({ userData }: UserProps) => {
  const [panelTab, setPanelTab] = useState("Work");
  const [toggle, setToggle] = useState("Assignee");

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        width="112"
        paddingTop="2"
        justifyContent="space-between"
      >
        <Button
          size="small"
          prefix={<ProjectOutlined />}
          variant={panelTab === "Work" ? "tertiary" : "transparent"}
          onClick={() => setPanelTab("Work")}
        >
          Work
        </Button>
        <Button
          size="small"
          prefix={<FieldTimeOutlined />}
          variant={panelTab === "Notification" ? "tertiary" : "transparent"}
          onClick={() => setPanelTab("Notification")}
        >
          Notification
        </Button>
        <Button
          size="small"
          prefix={<StarOutlined />}
          variant={panelTab === "Bookmarks" ? "tertiary" : "transparent"}
          onClick={() => setPanelTab("Bookmarks")}
        >
          Bookmarks
        </Button>
      </Box>
      {panelTab === "Work" && (
        <>
          <Toggle toggle={toggle} setToggle={setToggle} />
          <ScrollContainer>
            <WorkCards
              toggle={toggle}
              setToggle={setToggle}
              userData={userData}
            />
          </ScrollContainer>
        </>
      )}
      {panelTab == "Notification" && (
        <ScrollContainer overflow={"auto"}>
          <Notifications userData={userData} />
        </ScrollContainer>
      )}
      {panelTab == "Bookmarks" && (
        <ScrollContainer overflow={"auto"}>
          <BookMarks />
        </ScrollContainer>
      )}
    </>
  );
};

export default QuickProfileTabs;
