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
import { UserType } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import ProfileModal from "../../ProfileSettings";
import { AnimatePresence } from "framer-motion";
import { smartTrim } from "@/app/common/utils/utils";
import LensImportModal from "../LensImportModal";

interface Props {
  username: string;
}

const Profile = styled(Box)<{ mode: string }>`
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 55vh;
    margin-top: 0.5rem;
    align-items: center;
  }

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

const ProfileCard = ({ username }: Props) => {
  const { mode } = useTheme();
  const { isSidebarExpanded } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const [isLensProfileSelectModalOpen, setIsLensProfileSelectModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { userData: user } = useGlobal();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [userCircles, setUserCircles] = useState([]);

  // console.log({ user });
  const circlesArray = userCircles?.map((aCircle: any) => ({
    label: aCircle?.slug,
    src: aCircle?.avatar,
  }));

  console.log({ circlesArray });

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      void fetch(`${process.env.API_HOST}/user/v1/${user?.id}/circles`)
        .then((res) =>
          res.json().then((res2) => {
            setUserCircles(res2);
          })
        )
        .catch((err) => console.log({ err }))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  return (
    <>
      {isLensProfileSelectModalOpen && (
        <LensImportModal
          handleClose={() => setIsLensProfileSelectModalOpen(false)}
        />
      )}
      <Profile mode={mode}>
        <Box cursor="pointer">
          <Avatar
            label="profile-pic"
            src={user?.avatar}
            size={{
              xs: "20",
              md: "28",
            }}
            address={user?.ethAddress}
          />
        </Box>
        <Box padding="0.5">
          <Heading>{smartTrim(user?.username || "", 16)}</Heading>
        </Box>
        {user?.lensHandle && (
          <Tag as="span" tone="purple" size="small">
            {user?.lensHandle}
          </Tag>
        )}
        {user?.ethAddress && !user?.lensHandle && (
          <Tag as="span" tone="purple" size="small">
            {user?.ethAddress?.substring(0, 6) +
              "..." +
              user?.ethAddress?.substring(user?.ethAddress?.length - 6)}
          </Tag>
        )}
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
          {user?.skillsV2?.map((skill, index) => (
            <Tag as="span" tone="accent" hover size="small" key={index}>
              {skill.title}
            </Tag>
          ))}
        </InfoBox>
        <TextInfo>
          <Text variant="label"> Bio </Text>
          <Text variant="small" align="center" as="div">
            {user?.bio}
          </Text>
          <Text variant="label"> Circles </Text>
          {circlesArray?.length > 0 && (
            <AvatarGroup limit={9} members={userCircles as any} />
          )}
        </TextInfo>
        <Footer>
          {currentUser?.id == user?.id && (
            <Box display="flex" flexDirection="column" gap="4">
              {/* {!user?.lensHandle && (
                <Button
                  variant="tertiary"
                  size="small"
                  width="full"
                  onClick={() => setIsLensProfileSelectModalOpen(true)}
                >
                  Link Lens Profile
                </Button>
              )} */}
              <Button
                variant="secondary"
                size="small"
                width="full"
                onClick={() => setIsOpen(true)}
              >
                Edit
              </Button>
            </Box>
          )}
        </Footer>
      </Profile>
      <AnimatePresence>
        {isOpen && <ProfileModal setIsOpen={setIsOpen} />}
      </AnimatePresence>
    </>
  );
};

export default ProfileCard;
