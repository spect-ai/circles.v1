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
import {
  BehanceOutlined,
  GithubOutlined,
  LinkOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import ProfileModal from "../../ProfileSettings";
import { AnimatePresence } from "framer-motion";
import { smartTrim } from "@/app/common/utils/utils";
import LensImportModal from "../LensImportModal";
import { useAtom } from "jotai";
import { userDataAtom } from "@/app/state/global";

const Profile = styled(Box)<{ mode: string }>`
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 55vh;
    margin-top: 0.5rem;
    align-items: center;
    padding: 0.5rem 0rem;
  }
  @media (max-width: 1028px) and (min-width: 768px) {
    width: 100%;
    padding: 1rem;
    margin: 1rem;
    height: 90vh;
    align-items: center;
  }
  height: 90vh;
  width: 23vw;
  margin: 2rem;
  padding: 1.3rem;
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
  align-items: flex-start;
  position: relative;
  transition: all 0.5s ease-in-out;
`;

const InfoBox = styled(Box)<{ gap: string }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${(props) => props.gap}rem;
  padding-bottom: 1rem;
  justify-content: flex-start;
  max-width: 100%;
`;

const TextInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
  padding: 1rem 0rem;
`;

const Footer = styled(Box)`
  position: absolute;
  bottom: 1rem;
  width: 90%;
`;

export const SkillTag = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
  }
  transition: all 0.3s ease-in-out;
  padding: 0.1rem 0.5rem;
  justify-content: center;
  align-items: center;
`;

const ProfileCard = () => {
  const { mode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLensProfileSelectModalOpen, setIsLensProfileSelectModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUserData] = useAtom(userDataAtom);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [userCircles, setUserCircles] = useState([]);

  // // console.log({ user });
  // const circlesArray = userCircles?.map((aCircle: any) => ({
  //   label: aCircle?.slug,
  //   src: aCircle?.avatar,
  // }));

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
        <Box
          display="flex"
          flexDirection="row"
          gap="2"
          width={{
            xs: "full",
            lg: "full",
          }}
          marginLeft={{
            xs: "8",
            lg: "0",
          }}
        >
          <Avatar
            label={user?.username}
            src={
              user?.avatar ||
              `https://api.dicebear.com/5.x/thumbs/svg?seed=${user?.username}`
            }
            size={{
              xs: "20",
              md: "28",
            }}
            address={user?.ethAddress}
          />
          <Box>
            <Box padding="0.5">
              <Heading>{smartTrim(user?.username || "", 16)}</Heading>
            </Box>
            {user?.ethAddress && (
              <Tag size="small" tone="accent" hover>
                {smartTrim(user?.ethAddress, 12)}
              </Tag>
            )}
            <InfoBox gap="1" marginTop="2">
              {user?.githubId && !user?.github && (
                <a
                  href={`https://github.com/${user?.githubId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <GithubOutlined
                    style={{ color: "grey", fontSize: "1.2rem" }}
                  />
                </a>
              )}
              {user?.github && (
                <a
                  href={`${user.github}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <GithubOutlined
                    style={{ color: "grey", fontSize: "1.2rem" }}
                  />
                </a>
              )}
              {user?.twitterId && !user?.twitter && (
                <a
                  href={`https://twitter.com/${user?.twitterId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <TwitterOutlined
                    style={{ color: "grey", fontSize: "1.2rem" }}
                  />
                </a>
              )}
              {user?.twitter && (
                <a
                  href={`${user.twitter}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <TwitterOutlined
                    style={{ color: "grey", fontSize: "1.2rem" }}
                  />
                </a>
              )}
              {user?.behance && (
                <a
                  href={`${user.behance}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <BehanceOutlined
                    style={{ color: "grey", fontSize: "1.2rem" }}
                  />
                </a>
              )}
              {user?.website && (
                <a
                  href={`${user.website}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <LinkOutlined style={{ color: "grey", fontSize: "1.2rem" }} />
                </a>
              )}
            </InfoBox>
          </Box>
        </Box>

        {user?.lensHandle && (
          <Tag as="span" tone="purple" size="small">
            {user?.lensHandle}
          </Tag>
        )}

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          paddingY="1"
          paddingX={{
            xs: "4",
            lg: "0",
          }}
          width="full"
        >
          <TextInfo>
            <Text variant="label"> About Me </Text>
            <Text variant="base" as="div">
              {user?.bio}
            </Text>
            {!user?.bio && <Text variant="small"> Not added </Text>}

            {/* <Text variant="label"> Circles </Text>
          {circlesArray?.length > 0 && (
            <AvatarGroup limit={9} members={circlesArray as any} />
          )} */}
          </TextInfo>
          <Text variant="label"> Skills </Text>
          <InfoBox gap="0.5" paddingTop="2">
            {user?.skillsV2?.slice(0, 10).map((skill: any, index: any) => (
              <SkillTag mode={mode} key={index}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text variant="small">{skill.title}</Text>
                </Box>
              </SkillTag>
            ))}
            {!user?.skillsV2?.length && (
              <Text variant="small"> No skills added </Text>
            )}
          </InfoBox>
        </Box>
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
