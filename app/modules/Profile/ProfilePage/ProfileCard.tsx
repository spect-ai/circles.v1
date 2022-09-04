import {
  Box,
  Avatar,
  Tag,
  Text,
  AvatarGroup,
  Button,
  Heading,
  useTheme,
} from "degen";
import styled from "styled-components";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { UserType, CircleType } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import { AnimatePresence } from "framer-motion";

interface Props {
  username: string;
}

const Profile = styled(Box)<{ mode: string }>`
  width: 23vw;
  height: 90vh;
  margin: 2rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0px 1px 6px
    ${(props) =>
      props.mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    box-shadow: 0px 3px 10px
      ${(props) =>
        props.mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.25)"};
    transition-duration: 0.7s;
  }
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: center;
  position: relative;
  transition: all 0.5s ease-in-out;
`;

const InfoBox = styled(Box)<{ gap: string }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${(props) => props.gap}rem;
  padding-bottom: 1rem;
  justify-content: center;
`;

const TextInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const Footer = styled(Box)`
  position: absolute;
  bottom: 1rem;
  width: 90%;
`;

const FollowCount = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1rem;
`;

const ProfileCard = ({ username }: Props) => {
  const { mode } = useTheme();
  const { isSidebarExpanded } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { data: user, refetch: fetchUser } = useQuery<UserType>(
    ["user", username],
    async () =>
      await fetch(`${process.env.API_HOST}/user/username/${username}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void fetchUser();
  }, [user, username, isOpen, fetchUser, isSidebarExpanded]);

  const { data: myCircles, refetch } = useQuery<CircleType[]>(
    "myOrganizations",
    () =>
      fetch(`${process.env.API_HOST}/circle/myOrganizations`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void refetch();
  }, [refetch, currentUser]);

  const circlesArray =
    myCircles?.map &&
    myCircles?.map((aCircle) => ({ label: aCircle.slug, src: aCircle.avatar }));

  return (
    <>
      <Profile mode={mode}>
        <Box cursor="pointer">
          <Avatar
            label="profile-pic"
            src={user?.avatar}
            size="28"
            address={user?.ethAddress}
          />
        </Box>
        <Box padding="0.5">
          <Heading>{user?.username}</Heading>
        </Box>
        {user?.ethAddress && (
          <Tag as="span" tone="purple" size="small">
            {user?.ethAddress?.substring(0, 6) +
              "..." +
              user?.ethAddress?.substring(user?.ethAddress?.length - 6)}
          </Tag>
        )}
        {/* <FollowCount>
          <Box alignItems="center" display="flex" flexDirection="column">
            <Text variant="large" weight="bold">
              {user?.followedByUsers?.length}
            </Text>
            <Text variant="label">Followers</Text>
          </Box>
          <Box alignItems="center" display="flex" flexDirection="column">
            <Text variant="large" weight="bold">
              {user?.followedUsers?.length}
            </Text>
            <Text variant="label">Following</Text>
          </Box>
        </FollowCount> */}
        <InfoBox gap="1">
          {user?.githubId && (
            <a
              href={`https://github.com/${user?.githubId}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <GithubOutlined style={{ color: "grey", fontSize: "1.2rem" }} />
            </a>
          )}
          {user?.twitterId && (
            <a
              href={`https://twitter.com/${user?.twitterId}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <TwitterOutlined style={{ color: "grey", fontSize: "1.2rem" }} />
            </a>
          )}
        </InfoBox>
        <Text variant="label"> Skills </Text>
        <InfoBox gap="0.5" paddingTop="1">
          {user?.skills?.map((tag) => (
            <Tag as="span" tone="accent" hover size="small" key={tag}>
              {tag}
            </Tag>
          ))}
        </InfoBox>
        <TextInfo>
          <Text variant="label"> Bio </Text>
          <Text variant="small" align="center" as="div">
            {user?.bio}
          </Text>
          <Text variant="label"> Circles </Text>
          <AvatarGroup
            limit={9}
            members={
              circlesArray?.length
                ? circlesArray
                : [{ label: "Noun 97", src: "/og.jpg" }]
            }
          />
        </TextInfo>
        <Footer>
          {currentUser?.id == user?.id && (
            <Button
              variant="secondary"
              size="small"
              width="full"
              onClick={() => setIsOpen(true)}
            >
              Edit
            </Button>
          )}
          {/* : (
            <Button variant="secondary" size="small" width="full">
              Follow
            </Button>
          )} */}
        </Footer>
      </Profile>
      <AnimatePresence>
        {isOpen && <ProfileModal setIsOpen={setIsOpen} />}
      </AnimatePresence>
    </>
  );
};

export default ProfileCard;
