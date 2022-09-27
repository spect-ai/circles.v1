import { useState, useEffect } from "react";
import { Box, Button } from "degen";
import {
  ProjectOutlined,
  StarOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import WorkCards, { Toggle } from "./Work";
import BookMarks from "./Bookmarks";
import Notifications from "./Notifications";

interface UserProps {
  userData: UserType;
  tab: string;
}

export const ScrollContainer = styled(Box)`
  overflow: auto;
  height: 60vh;
  padding-right: 1rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

export const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 630px;
  // max-height: 300px;
  padding: 0.6rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
  }
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

export const GigInfo = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 1rem;
  gap: 0.4rem;
`;

export const TextBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  width: 510px;
`;

const TaskWalletTabs = ({ userData, tab }: UserProps) => {
  const [notifIds, setNotifIds] = useState([] as string[]);
  const [panelTab, setPanelTab] = useState(tab);
  const [toggle, setToggle] = useState("Assignee");

  useEffect(() => {
    if (userData?.notifications?.length > 0) {
      userData?.notifications?.map((notif) => {
        if (notif.read == false) setNotifIds([...notifIds, notif.id]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, userData?.notifications]);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        width="72"
        paddingTop="2"
        justifyContent="space-between"
      >
        <Button
          size="small"
          prefix={<ProjectOutlined />}
          variant={panelTab === "Work" ? "tertiary" : "transparent"}
          onClick={() => setPanelTab("Work")}
        >
          Work
        </Button>
        {currentUser?.id == userData?.id && (
          <>
            <Button
              size="small"
              prefix={<FieldTimeOutlined />}
              variant={
                panelTab === "Notifications" ? "tertiary" : "transparent"
              }
              onClick={() => setPanelTab("Notifications")}
            >
              Notifications{" "}
              {notifIds.length > 0
                ? "(" + notifIds.length.toString() + ")"
                : ""}
            </Button>
            {/* <Button
              size="small"
              prefix={<StarOutlined />}
              variant={panelTab === "Bookmarks" ? "tertiary" : "transparent"}
              onClick={() => setPanelTab("Bookmarks")}
            >
              Bookmarks
            </Button> */}
          </>
        )}
      </Box>
      <Box>
        {panelTab === "Work" && (
          <Box>
            <Toggle toggle={toggle} setToggle={setToggle} />
            <WorkCards
              toggle={toggle}
              setToggle={setToggle}
              userData={userData}
            />
          </Box>
        )}
        {panelTab == "Notifications" && <Notifications notifIds={notifIds} />}
        {/* {panelTab == "Bookmarks" && (
        <ScrollContainer overflow={"auto"}>
          <BookMarks />
        </ScrollContainer>
      )} */}
      </Box>
    </>
  );
};

export default TaskWalletTabs;
