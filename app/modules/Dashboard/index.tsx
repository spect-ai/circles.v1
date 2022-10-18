import {
  Box,
  Avatar,
  Tag,
  IconCollection,
  Button,
  IconTokens,
  Heading,
} from "degen";
import { useDisconnect } from "wagmi";
import { useGlobal } from "@/app/context/globalContext";
import { UserType, BucketizedCircleType, CircleType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import React, { memo, useState, useEffect } from "react";
import queryClient from "@/app/common/utils/queryClient";
import { ProjectOutlined } from "@ant-design/icons";
import { useAtom } from "jotai";
import { authStatusAtom } from "@/pages/_app";
import YourCircles from "./CirclesTab";
import YourProjects from "./ProjectsTab";
import YourCards from "./CardsTab";
import Loader from "@/app/common/components/Loader";

function Dashboard() {
  const { setIsProfilePanelExpanded, disconnectUser, connectedUser } =
    useGlobal();
  const [circles, setCircles] = useState([] as CircleType[]);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const {
    data: circlesArray,
    isLoading,
    refetch,
  } = useQuery<BucketizedCircleType>("exploreCircles", {
    enabled: false,
  });
  const { disconnect } = useDisconnect();
  const [panelTab, setPanelTab] = useState("Circle");
  const [authenticationStatus, setAuthenticationStatus] =
    useAtom(authStatusAtom);

  useEffect(() => {
    if (circlesArray?.memberOf.length == 0) void refetch();
    if (circlesArray) setCircles(circlesArray?.memberOf);
  }, [circlesArray, connectedUser, refetch]);

  console.log(currentUser);

  if (isLoading || !currentUser?.id)
    return <Loader loading={isLoading} text="Fetching circles" />;

  return (
    <Box padding="4">
      <Box
        paddingBottom="4"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          position: "relative",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, .1)",
        }}
      >
        <Avatar
          label="profile-pic"
          src={currentUser?.avatar}
          size="20"
          address={currentUser?.ethAddress}
        />
        <Box style={{ gap: "1.5rem" }}>
          <Heading>{currentUser?.username}</Heading>
          <Tag tone="purple" size="small">
            {currentUser?.ethAddress}
          </Tag>
        </Box>
        <Box
          style={{ position: "absolute", right: "1rem" }}
          display="flex"
          flexDirection="row"
          gap="1.5"
        >
          <Link href={`/profile/${currentUser?.username}`}>
            <Button
              size="small"
              variant="secondary"
              onClick={() => {
                setIsProfilePanelExpanded(false);
              }}
            >
              View Profile
            </Button>
          </Link>
          <Button
            size="small"
            variant="tertiary"
            onClick={async () => {
              setIsProfilePanelExpanded(false);
              await fetch(`${process.env.API_HOST}/auth/disconnect`, {
                method: "POST",
                credentials: "include",
              });
              disconnect();
              queryClient.setQueryData("getMyUser", null);
              void queryClient.invalidateQueries("getMyUser");
              localStorage.removeItem("connectorIndex");
              setAuthenticationStatus("unauthenticated");
              disconnectUser();
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        width="112"
        paddingTop="2"
        justifyContent="space-between"
      >
        <Button
          size="small"
          prefix={<IconTokens />}
          variant={panelTab === "Circle" ? "tertiary" : "transparent"}
          onClick={() => setPanelTab("Circle")}
        >
          Your Circles
        </Button>
        <Button
          size="small"
          prefix={<ProjectOutlined />}
          variant={panelTab === "Project" ? "tertiary" : "transparent"}
          onClick={() => setPanelTab("Project")}
        >
          Your Projects
        </Button>
        <Button
          size="small"
          prefix={<IconCollection size={"5"} />}
          variant={panelTab === "Card" ? "tertiary" : "transparent"}
          onClick={() => setPanelTab("Card")}
        >
          Your Cards
        </Button>
      </Box>
      <Box>
        {/* {panelTab === "Work" && (
          <Box>
            <Toggle toggle={toggle} setToggle={setToggle} />
            <WorkCards
              toggle={toggle}
              setToggle={setToggle}
              userData={userData}
            />
          </Box>
        )} */}
        {panelTab == "Circle" && (
          <YourCircles circles={circles} isLoading={isLoading} />
        )}
        {panelTab == "Project" && (
          <YourProjects circles={circles} isLoading={isLoading} />
        )}
        {panelTab == "Card" && (
          <YourCards
            circles={circles}
            isLoading={isLoading}
            currentUser={currentUser}
          />
        )}
      </Box>
    </Box>
  );
}

export default memo(Dashboard);
