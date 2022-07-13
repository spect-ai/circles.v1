import { useState, FunctionComponent } from "react";
import { Box, Avatar, Tag, Text, Button } from "degen";
import { ProjectOutlined, StarOutlined, FieldTimeOutlined, StarFilled } from "@ant-design/icons";
import styled from "styled-components";

interface Props {
  toggle: String;
  setToggle: Function;
}

const ScrollContainer = styled(Box)`
  overflow: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 65px;
  margin-top: 1rem;
  padding: 0.8rem 1rem 0;
  border-radius: 0.5rem;
  background-color: rgb(20,20,20);
  border: solid 2px rgba(255, 255, 255, .1);
  &:hover {
    border: solid 2px rgb(191,90,242);
    transition-duration: 0.7s;
  }
  position: relative;
`

const ToggleButton = styled.button<{bgcolor: boolean}>`
  border-radius: 2rem;
  border: none;
  padding: 0.4rem 1rem;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  font-family: Inter;
  color: ${(props) => (props.bgcolor? "white" :"rgb(191,90,242)")};
  background-color: ${(props) => (props.bgcolor? "rgb(191,90,242)" :"rgba(54, 34, 64, 1)")};
`

const GigInfo = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 2rem;
  gap: 0.6rem;
`

const Toggle: FunctionComponent<Props> = ({toggle, setToggle}) => {
  return (
    <>
      <Box
        style={{
          display: "block",
          padding: "0.2rem", 
          backgroundColor: "rgba(54, 34, 64, 1)", 
          borderRadius: "2rem",
          margin: "0.7rem 200px"
          }}>
        <ToggleButton onClick={()=> setToggle('Assignee')} bgcolor={toggle == 'Assignee'? true: false}>
          As Assignee
        </ToggleButton>
        <ToggleButton onClick={()=> setToggle('Reviewer')} bgcolor={toggle == 'Reviewer'? true: false}>
          As Reviewer
        </ToggleButton>
      </Box>
    </>
  )
}

const WorkCards: FunctionComponent<Props> = ({toggle}) => {
  return(
    <>
      {toggle == 'Assignee' ? (
      <Card>
        <Text weight="semiBold" variant="large">
          Assignee Card
        </Text>
        <GigInfo>
        <Avatar 
          label="profile-pic"
          placeholder
          size="8"
        />
        <Avatar 
          label="profile-pic"
          src="/og.jpg"
          size="8"
        />
        <Text variant="label">02:45pm</Text>
        </GigInfo>
      </Card> 
      ):(
      <Card>
        <Text weight="semiBold" variant="large">
          Reviewer Card
        </Text>
        <GigInfo>
        <Avatar 
          label="profile-pic"
          placeholder
          size="8"
        />
        <Avatar 
          label="profile-pic"
          src="/og.jpg"
          size="8"
        />
        <Text variant="label">02:45pm</Text>
        </GigInfo>
      </Card>
      )}
    </>
  )
}

const Activity = () => {
  return(
    <>
      <Box 
        style={{ 
        display: "flex", 
        flexDirection: "row", 
        gap: "0.4rem", 
        alignItems: "center", 
        paddingTop: 
        "1rem"}}
      >
        <Avatar 
          label="profile-pic"
          src="/og.jpg"
          size="5"
        />
        <Text variant="base" weight="semiBold">Spect.network</Text>
        <Text variant="small" >commented on your submission</Text>
        <Text variant="label">12:34PM</Text>
      </Box>
    </>
  )
}

const BookMarks = () => {
  return(
    <>
      <Card>
        <Text weight="semiBold" variant="large">
          Bookmarks Card
        </Text>
        <GigInfo>
        <Text variant="label">02:45pm</Text>
        <Avatar 
          label="profile-pic"
          src="/og.jpg"
          size="8"
        />
        <StarFilled style={{ fontSize: '24px', color: 'rgb(191,90,242)' }}/>
        </GigInfo>
      </Card>
    </>
  )
}

const QuickProfileTabs = () => {

  const [ panelTab, setPanelTab] = useState('Work');
  const [toggle, setToggle] = useState('Assignee');

  return(
    <>
      <Box
        display="flex"
        flexDirection="row"
        width="96"
        paddingTop="2"
        justifyContent="space-between">
        <Button
          size="small"
          prefix={<ProjectOutlined />}
          variant={ panelTab === "Work" ? "tertiary" : "transparent"}
          onClick={()=> setPanelTab('Work')}
        >
        Work
        </Button>
        <Button
          size="small"
          prefix={<FieldTimeOutlined />}
          variant={ panelTab === "Activity" ? "tertiary" : "transparent"}  
          onClick={()=> setPanelTab('Activity')}
        >
        Activity
        </Button>
        <Button
          size="small"
          prefix={<StarOutlined />}
          variant={ panelTab === "Bookmarks" ? "tertiary" : "transparent"}  
          onClick={()=> setPanelTab('Bookmarks')}
        >
          Bookmarks
        </Button>
      </Box>
      { panelTab === "Work" && 
        <>
          <Toggle toggle={toggle} setToggle={setToggle}/>
          <ScrollContainer overflow={"auto"}>
            <WorkCards toggle={toggle} setToggle={setToggle}/>
          </ScrollContainer>
        </>}
      { panelTab == "Activity" && 
        <ScrollContainer overflow={"auto"}>
          <Activity/>
        </ScrollContainer>}
      { panelTab == "Bookmarks" && 
      <ScrollContainer overflow={"auto"}>
        <BookMarks/>
      </ScrollContainer>
      }
    </>
  )
}

export default QuickProfileTabs;