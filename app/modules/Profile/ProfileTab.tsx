import { Box, Text, Tag, Avatar, useTheme } from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";
import React, { useState } from "react";
import { UserType } from "@/app/types";

interface Props{
  userData : UserType;
}

const Card = styled(Box)<{mode: string}>`
  display: flex;
  flex-direction: column;
  width: 60vw;
  height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px ${(props) => props.mode === "dark" ? "rgb(255, 255, 255, 0.05)" : "rgb(20, 20, 20, 0.1)"};
  &:hover {
    border: solid 2px rgb(191,90,242);
    transition-duration: 0.7s;
    cursor: pointer;
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


const Activity = React.memo(({userData} : Props) => {

  const {mode} = useTheme();

  return (
    <>
      {userData?.assignedCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" tone="purple" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Text variant="label">Working On</Text>
              <Avatar label="profile-pic" src="/og.jpg" size="8" />
            </GigInfo>
          </Card>
        )
      })}
      {userData?.reviewingCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" tone="purple" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Text variant="label">Reviewing</Text>
              <Avatar label="profile-pic" src="/og.jpg" size="8" />
            </GigInfo>
          </Card>
        )
      })}
      {userData?.reviewingClosedCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" tone="purple" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Text variant="label">Reviewed</Text>
              <Avatar label="profile-pic" src="/og.jpg" size="8" />
            </GigInfo>
          </Card>
        )
      })}
      {userData?.assignedClosedCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" tone="purple" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Text variant="label">Worked On</Text>
              <Avatar label="profile-pic" src="/og.jpg" size="8" />
            </GigInfo>
          </Card>
        )
      })}
    </>
  )
});

const Retro = () => {

  const {mode} = useTheme();

  return (
    <Card mode={mode}>
      <Text variant="extraLarge"> </Text>
      <Text variant="small"> </Text>
      <GigInfo>
        <Text variant="label"> </Text>
        <Avatar 
          label="profile-pic"
          src="/og.jpg"
          size="8"
        />
      </GigInfo>
    </Card>
  )
}

const ProfileTabs = ({userData} : Props) => {

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
        { tab === "Activity" && <Activity userData={userData} />}
        { tab === "Retro" && <Retro/>}
      </Box>
    </Box>
  )
}

export default ProfileTabs;