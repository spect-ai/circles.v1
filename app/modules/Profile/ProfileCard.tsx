import { Box, Avatar, Tag, Text, AvatarGroup, Button, Heading } from "degen";
import styled from "styled-components";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { useGlobal } from "@/app/context/globalContext";
import { useTheme } from "degen";

const Profile = styled(Box)`
  width: 20vw;
  height: 90vh;
  margin: 2rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.25);
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
  align-items: center;
  justify-content: space-between;
`

const TextInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
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

const ProfileCard = () => {
  const { isProfilePanelExpanded, setIsProfilePanelExpanded} = useGlobal();

  return (
    <>
      <Profile>
        <Box onClick={()=> {setIsProfilePanelExpanded(!isProfilePanelExpanded)}} cursor="pointer">
          <Avatar
            label="profile-pic"
            src="/og.jpg"
            size="28"
          />
        </Box>
        <Box padding="0.5">
          <Heading>
            Dude
          </Heading>
        </Box>
        <Tag as="span" tone="purple" size="small">
          dude.eth
        </Tag>
        <FollowCount>
          <Box alignItems="center" display="flex" flexDirection="column">
            <Text variant="large" weight="bold" > 200 </Text>
            <Text variant="label">Followers</Text>
          </Box>
          <Box alignItems="center" display="flex" flexDirection="column">
            <Text variant="large" weight="bold"> 200 </Text>
            <Text variant="label">Following</Text>
          </Box>
        </FollowCount>
        <InfoBox gap="1">
          <GithubOutlined style={{ color: "grey", fontSize: "1.2rem"}}/>
          <TwitterOutlined style={{ color: "grey", fontSize: "1.2rem"}}/>
        </InfoBox>
        <InfoBox gap="0.5">
          <Tag as="span" tone="purple" size="small"> Polygon </Tag>
          <Tag as="span" tone="orange" size="small"> Cosmos </Tag>
          <Tag as="span" tone="blue" size="small"> Enhancement </Tag>
        </InfoBox>
        <TextInfo>
          <Text variant="label"> Headline </Text>
          <Text variant="small" align="center" > 
            About me? Whatever Create a portfolio to track purchases with real-time pricing and analytics.
          </Text>
          <Text variant="label"> Circles </Text>
          <AvatarGroup
            limit={9}
            members={[
              { label: 'Noun 97', src: "/og.jpg" },
              { label: 'Noun 11', src: "/og.jpg" },
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
