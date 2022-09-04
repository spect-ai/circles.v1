import { useState, FunctionComponent, useEffect } from "react";
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
import Link from "next/link";
import { useQuery } from "react-query";
import { updateNotificationStatus } from "@/app/services/ProfileNotifications";
import { useGlobal } from "@/app/context/globalContext";

interface Props {
  toggle: string;
  setToggle: (toggle: string) => void;
  userData?: UserType;
}

interface UserProps {
  userData: UserType;
  tab: string;
}

interface NotifProps {
  userData: UserType;
  notifIds: string[];
  setNotifIds: (notifIds: string[]) => void;
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

const Notifications = ({ userData, notifIds, setNotifIds }: NotifProps) => {
  const { setNotifSeen } = useGlobal();

  setNotifSeen(true);

  if (notifIds.length > 0) {
    const update = async () => {
      await updateNotificationStatus({ notificationIds: notifIds });
    };
    void update();
  }

  return (
    <Box gap="0.5" display="flex" flexDirection="column" marginTop="5">
      {userData?.notifications?.length == 0 && (
        <Box style={{ margin: "14rem 14rem" }}>
          <Text color="accent" align="center">
            No Notifications as of now.
          </Text>
        </Box>
      )}
      {userData?.notifications
        ?.slice(0)
        .reverse()
        .map((notif) => {
          let link = "";
          if (notif.type == "circle") {
            link = `/${notif?.linkPath?.[0]}`;
          } else if (notif.type == "project") {
            link = `/${notif?.linkPath?.[0]}/${notif?.linkPath?.[1]}`;
          } else if (notif.type == "card") {
            const card = userData?.cardDetails?.[notif?.entityId as string];
            link = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
          } else if (notif.type == "retro") {
            link = `/${notif?.linkPath?.[0]}?retroSlug=${notif?.linkPath?.[1]}`;
          }
          return (
            <Link href={link} key={notif?.id}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "1rem",
                  width: "39rem",
                  borderRadius: "0.5rem",
                }}
                backgroundColor={
                  notif?.read == false ? "accentTertiary" : "transparent"
                }
              >
                {notif?.actor && userData?.userDetails?.[notif?.actor] && (
                  <Avatar
                    label="profile-pic"
                    src={userData?.userDetails[notif?.actor]?.avatar}
                    address={userData?.userDetails[notif?.actor]?.ethAddress}
                    size="5"
                  />
                )}
                <Text>{notif?.content}</Text>
                <Text variant="label">
                  {new Date(notif?.timestamp).toLocaleDateString() ==
                  new Date().toLocaleDateString()
                    ? new Date(notif?.timestamp).toLocaleTimeString()
                    : new Date(notif?.timestamp).toLocaleDateString()}
                </Text>
              </Box>
            </Link>
          );
        })}
    </Box>
  );
};

const BookMarks = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();
  return (
    <Box marginTop="2" cursor="pointer">
      {userData?.bookmarks?.length == 0 && (
        <Box style={{ margin: "15rem 16rem" }}>
          <Text color="accent" align="center">
            No Bookmarks.
          </Text>
        </Box>
      )}
      {userData?.bookmarks?.map((book) => {
        const card = userData?.cardDetails?.[book];
        return (
          <Card mode={mode} key={book}>
            <Text weight="semiBold" variant="large">
              {card?.title}
            </Text>
            <GigInfo>
              <Avatar label="circle-pic" src={card?.circle?.avatar} size="6" />
              <StarFilled
                style={{ fontSize: "18px", color: "rgb(191,90,242)" }}
              />
            </GigInfo>
          </Card>
        );
      })}
    </Box>
  );
};

const QuickProfileTabs = ({ userData, tab }: UserProps) => {
  const [notifIds, setNotifIds] = useState([] as string[]);
  const [panelTab, setPanelTab] = useState(tab);
  const [toggle, setToggle] = useState("Assignee");

  useEffect(() => {
    if (userData?.notifications?.length > 0) {
      userData?.notifications?.map((notif) => {
        if (notif.read == false) setNotifIds([...notifIds, notif.id]);
      });
    }
  }, [userData, userData?.notifications]);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        width="72"
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
        {currentUser?.id == userData?.id && (
          <>
            <Button
              size="small"
              prefix={<FieldTimeOutlined />}
              variant={
                panelTab === "Notifications" ? "tertiary" : "transparent"
              }
              onClick={() => setPanelTab("Notifications")}
            >
              Notifications{" "}
              {notifIds.length > 0
                ? "(" + notifIds.length.toString() + ")"
                : ""}
            </Button>
            {/* <Button
              size="small"
              prefix={<StarOutlined />}
              variant={panelTab === "Bookmarks" ? "tertiary" : "transparent"}
              onClick={() => setPanelTab("Bookmarks")}
            >
              Bookmarks
            </Button> */}
          </>
        )}
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
      {panelTab == "Notifications" && (
        <ScrollContainer overflow={"auto"}>
          <Notifications
            userData={userData}
            notifIds={notifIds}
            setNotifIds={setNotifIds}
          />
        </ScrollContainer>
      )}
      {panelTab == "Bookmarks" && (
        <ScrollContainer overflow={"auto"}>
          <BookMarks userData={userData} />
        </ScrollContainer>
      )}
    </>
  );
};

export default QuickProfileTabs;
