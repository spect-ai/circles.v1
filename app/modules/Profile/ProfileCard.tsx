import { Box, Avatar, Tag, Text, AvatarGroup, Button, Heading, useTheme } from "degen";
import styled from "styled-components";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { UserType } from "@/app/types";
import Link from "next/link";
import { useGlobal } from "@/app/context/globalContext";

interface Props{
  userData: UserType;
}

const Profile = styled(Box)<{mode: string}>`
  width: 23vw;
  height: 90vh;
  margin: 2rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0px 1px 6px ${(props) => props.mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    box-shadow: 0px 3px 10px ${(props) => props.mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.25)"};
    transition-duration: 0.7s;
  }
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: center;
  position: relative;
`;

const InfoBox = styled(Box)<{gap: string}>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${(props) => props.gap}rem;
  padding-bottom: 1rem;
  justify-content: center;
`

const TextInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`

const Footer = styled(Box)`
  position: absolute;
  bottom: 1rem;
  width: 90%;
`

const FollowCount = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1rem;
`

const ProfileCard = ({userData} : Props) => {

  const {mode} = useTheme();
  const {openQuickProfile} = useGlobal()
  
  return (
    <>
      <Profile mode={mode}>
        <Box cursor="pointer"  onClick={()=> openQuickProfile(userData.id)}>
          <Avatar
            label="profile-pic"
            src={userData?.avatar}
            size="28"
          />
        </Box>
        <Box padding="0.5">
          <Heading>
            {userData?.username}
          </Heading>
        </Box>
        <Tag as="span" tone="purple" size="small">
          {userData?.ethAddress.substring(0,25) + "..."}
        </Tag>
        <FollowCount >
          <Box alignItems="center" display="flex" flexDirection="column">
            <Text variant="large" weight="bold" >{userData?.followedByUsers?.length}</Text>
            <Text variant="label">Followers</Text>
          </Box>
          <Box alignItems="center" display="flex" flexDirection="column">
            <Text variant="large" weight="bold">{userData?.followedUsers?.length}</Text>
            <Text variant="label">Following</Text>
          </Box>
        </FollowCount>
        <InfoBox gap="1">
          {userData?.githubId && 
          <a href={`https://github.com/${userData?.githubId}`} target="_blank" rel="noreferrer noopener">
            <GithubOutlined style={{ color: "grey", fontSize: "1.2rem"}}/>
          </a>
          }
          {userData?.twitterId && 
          <a href={`https://twitter.com/${userData?.twitterId}`} target="_blank" rel="noreferrer noopener">
            <TwitterOutlined style={{ color: "grey", fontSize: "1.2rem"}}/>
          </a>
          }
        </InfoBox>
        <InfoBox gap="0.5">
          {userData?.skills?.map( tag => (
            <Tag as="span" tone="accent" hover size="small">{tag}</Tag>
          ))}
        </InfoBox>
        <TextInfo>
          <Text variant="label"> Bio </Text>
          <Text variant="small" align="center" as="div">
            {userData?.bio}
          </Text>
          <Text variant="label"> Circles </Text>
          <AvatarGroup
            limit={9}
            members={[
              { label: 'Noun 97', src: "/og.jpg" },
            ]}
          />
        </TextInfo>
        <Footer>
          <Button variant="secondary" size="small" width="full">
            Follow
          </Button>
        </Footer>
      </Profile>
    </>
  );
};

export default ProfileCard;
