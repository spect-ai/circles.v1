import { Box, Text, Tag, Avatar, useTheme } from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { UserType, CardDetails, KudosType, KudoOfUserType } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import useCredentials from "@/app/services/Credentials";
import Image from "next/image";

interface Props {
  username: string;
}

const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  max-width: 60vw;
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
  margin-right: 7rem;
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
      {userData?.assignedCards?.length +
        userData?.reviewingCards?.length +
        userData?.assignedClosedCards?.length +
        userData?.reviewingClosedCards?.length ==
        0 && (
        <Box style={{ margin: "30vh 25vw" }}>
          <Text color="accent" align="center">
            Woah, such empty.
          </Text>
        </Box>
      )}
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

const Retro = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();

  return (
    <ScrollContainer>
      {userData?.retro?.length == 0 && (
        <Box style={{ margin: "30vh 25vw" }}>
          <Text color="accent" align="center">
            No Retros to show.
          </Text>
        </Box>
      )}
      {userData?.retro?.map((ret) => {
        const retroInfo = userData?.retroDetails?.[ret];
        return (
          <Card
            mode={mode}
            key={ret}
            onClick={() =>
              window.open(
                `/${retroInfo?.circle?.slug}?retroSlug=${retroInfo?.slug}`
              )
            }
          >
            <TextBox>
              <Text variant="extraLarge">{retroInfo?.title}</Text>
            </TextBox>
            <Tags>
              <Tag>
                {Object.keys(retroInfo?.circle?.memberRoles).length}{" "}
                participants
              </Tag>
            </Tags>
            <GigInfo>
              <Tag size="medium" hover>
                {retroInfo?.status?.active == true ? "Active" : "Ended"}{" "}
              </Tag>
              <Avatar
                label="profile-pic"
                src={retroInfo?.circle?.avatar}
                address={retroInfo?.circle?.id}
                size="8"
              />
            </GigInfo>
          </Card>
        );
      })}
    </ScrollContainer>
  );
};

const Kudos = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();
  const { getKudosOfUser } = useCredentials();
  const [kudos, setKudos] = useState([] as KudoOfUserType[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?.ethAddress) {
      setLoading(true);
      getKudosOfUser(userData.ethAddress)
        .then((res) => {
          console.log(res);
          setKudos(res.data);
          setLoading(false);
          console.log(kudos);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <ScrollContainer>
      {kudos?.length == 0 && !loading && (
        <Box style={{ margin: "30vh 25vw" }}>
          <Text color="accent" align="center">
            No Kudos to show.
          </Text>
        </Box>
      )}
      <Box paddingTop="4">
        {!loading &&
          kudos.length > 0 &&
          kudos?.map((kudo, index) => {
            console.log(kudo);
            if (kudo.claimStatus === "claimed")
              return (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="row"
                  width="full"
                  height="full"
                >
                  <Box width="1/2" padding="4">
                    <Image
                      src={kudo.assetUrl}
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="contain"
                      alt="Kudos img"
                    />
                  </Box>
                </Box>
              );
          })}
      </Box>
    </ScrollContainer>
  );
};

const ProfileTabs = ({ username }: Props) => {
  const [tab, setProfileTab] = useState("Activity");
  const [userData, setUserData] = useState({} as UserType);

  const fetchUser = async () => {
    const res = await fetch(
      `${process.env.API_HOST}/user/username/${username}`,
      {
        credentials: "include",
      }
    );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, tab]);

  return (
    <Box width="max">
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
        <PrimaryButton
          variant={tab === "Kudos" ? "tertiary" : "transparent"}
          onClick={() => setProfileTab("Kudos")}
        >
          Kudos
        </PrimaryButton>
      </Box>
      <Box width="144">
        {tab === "Activity" && <Activity userData={userData} />}
        {tab === "Retro" && <Retro userData={userData} />}
        {tab === "Kudos" && <Kudos userData={userData} />}
      </Box>
    </Box>
  );
};

export default ProfileTabs;
