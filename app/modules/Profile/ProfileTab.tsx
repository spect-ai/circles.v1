import { Box, Text, Tag, Avatar } from "degen";
import { useState } from "react";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";


const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 60vw;
  height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  background-color: rgb(20,20,20);
  border: solid 2px rgba(255, 255, 255, .1);
  &:hover {
    border: solid 2px rgb(191,90,242);
    transition-duration: 0.7s;
  }
  position: relative;
`

const Tags = styled(Box)`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 0.7rem;
  gap: 1rem;
`

const GigInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  right: 0.7rem;
  gap: 1rem;
`

const Activity = () => {
  return (
    <Card>
      <Text variant="extraLarge">Card Name</Text>
      <Tags>
        <Tag as="span" tone="purple" size="small">polygon</Tag>
        <Tag as="span" tone="purple" size="small">GitHub</Tag>
        <Tag as="span" tone="purple" size="small">Coding</Tag>
        <Tag as="span" tone="purple" size="small">Enhancement</Tag>
      </Tags>
      <GigInfo>
        <Text variant="label">Worked On</Text>
        <Avatar 
          label="profile-pic"
          src="/og.jpg"
          size="8"
        />
      </GigInfo>
    </Card>
  )
}

const Retro = () => {
  return(
    <Card>
      <Text variant="extraLarge">Retro Name</Text>
      <Text variant="small">84% votes</Text>
      <GigInfo>
        <Text variant="label">updated 28 days ago</Text>
        <Avatar 
          label="profile-pic"
          src="/og.jpg"
          size="8"
        />
      </GigInfo>
    </Card>
  )
}

const ProfileTabs = () => {

  const [ tab, setProfileTab] = useState('Activity');

  return(
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        width="44"
        paddingTop="10"
        justifyContent="space-between">
        <PrimaryButton 
          variant={ tab === "Activity" ? "tertiary" : "transparent"} 
          onClick={()=> setProfileTab('Activity')}
        >
        Activity
        </PrimaryButton>
        <PrimaryButton 
          variant={ tab === "Retro" ? "tertiary" : "transparent"} 
          onClick={()=> setProfileTab('Retro')}
        >
        Retro
        </PrimaryButton>
      </Box>
      <Box>
        { tab === "Activity" && <Activity/>}
        { tab === "Retro" && <Retro/>}
      </Box>
    </Box>
  )
}

export default ProfileTabs;