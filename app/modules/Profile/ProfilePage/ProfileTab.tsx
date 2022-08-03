import { Box, Text, Tag, Avatar, useTheme } from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";

interface Props{
  userId : string;
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


const Activity = React.memo(({userData} : { userData : UserType ;}) => {

  const {mode} = useTheme();

  return (
    <>
      {userData?.assignedCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Tag hover>Working On</Tag>
              <Avatar label="profile-pic" src="/og.jpg" size="6" />
            </GigInfo>
          </Card>
        )
      })}
      {userData?.reviewingCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Tag hover>Reviewing</Tag>
              <Avatar label="profile-pic" src="/og.jpg" size="6" />
            </GigInfo>
          </Card>
        )
      })}
      {userData?.reviewingClosedCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Tag hover>Reviewed</Tag>
              <Avatar label="profile-pic" src="/og.jpg" size="6" />
            </GigInfo>
          </Card>
        )
      })}
      {userData?.assignedClosedCards?.map(card => {
        return(
          <Card mode={mode}>
            <Text variant="extraLarge">{card} </Text>
            <Tags><Tag as="span" size="small">polygon</Tag></Tags>
            <GigInfo>
              <Tag hover>Worked On</Tag>
              <Avatar label="profile-pic" src="/og.jpg" size="6" />
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

const ProfileTabs = ({userId} : Props) => {

  const [ tab, setProfileTab] = useState('Activity');
  const { data: userData , refetch: fetchUser } = useQuery<UserType>(
    ["user", userId],
    async() =>
      await fetch(`${process.env.API_HOST}/user/${userId}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void fetchUser();   
  }, [userData, userId, tab]);

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
        { tab === "Activity" && <Activity userData={userData as UserType} />}
        { tab === "Retro" && <Retro/>}
      </Box>
    </Box>
  )
}

export default ProfileTabs;