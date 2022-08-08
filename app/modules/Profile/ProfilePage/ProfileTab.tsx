import { Box, Text, Tag, Avatar, useTheme } from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { UserType, CardDetails } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { useQuery } from "react-query";

interface Props {
  userId: string;
}

const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  width: 60vw;
  min-height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
`;

const Tags = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50vw;
  padding: 1rem 0rem;
  gap: 0.7rem;
`;

const GigInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  right: 0.7rem;
  gap: 1rem;
`;

const TextBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  width: 50vw;
`;

const ScrollContainer = styled(Box)`
  overflow: auto;
  max-height: 85vh;
  padding-right: 2rem;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Activity = React.memo(({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();

  return (
    <ScrollContainer>
      {userData?.assignedCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
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
                <Tag hover>Working On</Tag>
                <Avatar
                  label="profile-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
              </GigInfo>
            </Card>
          );
        })}
      {userData?.reviewingCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
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
                <Tag hover>Reviewing</Tag>
                <Avatar
                  label="profile-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
              </GigInfo>
            </Card>
          );
        })}
      {userData?.assignedClosedCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
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
                <Tag hover>Worked On</Tag>
                <Avatar
                  label="profile-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
              </GigInfo>
            </Card>
          );
        })}
      {userData?.reviewingClosedCards
        ?.slice(0)
        .reverse()
        .map((cardId) => {
          const card: CardDetails = userData?.cardDetails?.[cardId]!;
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
                <Tag hover>Reviewed</Tag>
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
  );
});

Activity.displayName = "Activity";

const Retro = () => {
  const { mode } = useTheme();

  return (
    <Card mode={mode}>
      <Text variant="extraLarge"> </Text>
      <Text variant="small"> </Text>
      <GigInfo>
        <Text variant="label"> </Text>
        <Avatar label="profile-pic" src="/og.jpg" size="8" />
      </GigInfo>
    </Card>
  );
};

const ProfileTabs = ({ userId }: Props) => {
  const [tab, setProfileTab] = useState("Activity");
  const [userData, setUserData] = useState({} as UserType);

  const fetchUser = async () => {
    const res = await fetch(`${process.env.API_HOST}/user/${userId}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUserData(data);
      return data;
    } else {
      return false;
    }
  };

  useEffect(() => {
    void fetchUser();
  }, [userId, tab]);

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        width="44"
        paddingTop="10"
        justifyContent="space-between"
      >
        <PrimaryButton
          variant={tab === "Activity" ? "tertiary" : "transparent"}
          onClick={() => setProfileTab("Activity")}
        >
          Activity
        </PrimaryButton>
        <PrimaryButton
          variant={tab === "Retro" ? "tertiary" : "transparent"}
          onClick={() => setProfileTab("Retro")}
        >
          Retro
        </PrimaryButton>
      </Box>
      <Box>
        {tab === "Activity" && <Activity userData={userData} />}
        {tab === "Retro" && <Retro />}
      </Box>
    </Box>
  );
};

export default ProfileTabs;
