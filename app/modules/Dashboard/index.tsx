import {
  Box,
  Avatar,
  Tag,
  Text,
  Button,
  IconTokens,
  Heading,
  Stack,
  IconMoon,
  IconSun,
  useTheme,
  IconDotsHorizontal,
} from "degen";
import { useGlobal } from "@/app/context/globalContext";
import { UserType, CircleType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import React, { memo, useEffect, useState } from "react";
import Logout from "@/app/common/components/LogoutButton";
import { QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons";
import YourCircles from "./CirclesTab";
import { AnimatePresence } from "framer-motion";
import Loader from "@/app/common/components/Loader";
import useJoinCircle from "@/app/services/JoinCircle/useJoinCircle";
import ProfileModal from "../Profile/ProfileSettings";
import { Hidden, Visible } from "react-grid-system";
import { smartTrim } from "@/app/common/utils/utils";
import Popover from "@/app/common/components/Popover";
import { PopoverOption } from "../Card/OptionPopover";
import { useRouter } from "next/router";
import ResponsesTab from "./ResponsesTab";
import FAQModal from "./FAQModal";
import { toast, ToastContainer } from "react-toastify";
import { Grid } from "react-feather";
import styled from "styled-components";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useLocation } from "react-use";
import ConnectDiscordButton from "@/app/common/components/ConnectDiscordButton";

function Dashboard() {
  const { setIsProfilePanelExpanded } = useGlobal();
  useJoinCircle();
  const { hostname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { data: circles, isLoading } = useQuery<CircleType[]>(
    "dashboardCircles",
    {
      enabled: false,
    }
  );
  const [panelTab, setPanelTab] = useState("circles");
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { mode, setMode } = useTheme();
  const router = useRouter();

  const { tab } = router.query;

  useEffect(() => {
    if (tab) setPanelTab(tab as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !currentUser?.id)
    return <Loader loading={isLoading} text="Fetching circles" />;

  const SetModeButton = () => {
    if (mode === "dark") {
      return (
        <Button
          shape="circle"
          variant="secondary"
          size="small"
          onClick={() => {
            localStorage.setItem("lightMode", "true");
            document.documentElement.style.setProperty(
              "--dsg-cell-background-color",
              "rgb(255, 255, 255)"
            );
            document.documentElement.style.setProperty(
              "--dsg-border-color",
              "rgb(20,20,20,0.1)"
            );
            document.documentElement.style.setProperty(
              "--dsg-cell-text-color",
              "rgb(20,20,20,0.9)"
            );
            setMode("light");
          }}
        >
          <IconSun size="5" />
        </Button>
      );
    }
    return (
      <Button
        shape="circle"
        variant="secondary"
        size="small"
        onClick={() => {
          localStorage.removeItem("lightMode");
          document.documentElement.style.setProperty(
            "--dsg-cell-background-color",
            "rgb(20,20,20)"
          );
          document.documentElement.style.setProperty(
            "--dsg-border-color",
            "rgb(255,255,255,0.1)"
          );
          document.documentElement.style.setProperty(
            "--dsg-cell-text-color",
            "rgb(255,255,255,0.9)"
          );
          setMode("dark");
        }}
      >
        <IconMoon size="5" />
      </Button>
    );
  };

  if (circles) {
    return (
      <>
        <Box padding="4">
          <ToastContainer
            toastStyle={{
              backgroundColor: `${
                mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
              }`,
              color: `${
                mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
              }`,
            }}
          />
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
            justify="space-between"
          >
            <Stack direction="horizontal" align="center">
              <Avatar
                label="profile-pic"
                src={currentUser?.avatar}
                size={{
                  xs: "14",
                  md: "20",
                }}
                address={currentUser?.ethAddress}
              />
              <Box style={{ gap: "1.5rem" }}>
                <Heading>{currentUser?.username}</Heading>
                <Tag tone="purple" size="small">
                  {smartTrim(currentUser?.ethAddress, 12)}
                </Tag>
              </Box>
              <Visible xs sm>
                <Popover
                  butttonComponent={
                    <Box
                      cursor="pointer"
                      onClick={() => {
                        setIsPopoverOpen(!isPopoverOpen);
                      }}
                      color="foreground"
                    >
                      <IconDotsHorizontal color="textSecondary" />
                    </Box>
                  }
                  isOpen={isPopoverOpen}
                  setIsOpen={setIsPopoverOpen}
                >
                  <Box
                    backgroundColor="background"
                    borderWidth="0.5"
                    borderRadius="2xLarge"
                  >
                    <PopoverOption
                      onClick={() => {
                        setIsPopoverOpen(false);
                      }}
                    >
                      <SetModeButton />
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        setIsPopoverOpen(false);
                        setIsOpen(true);
                      }}
                    >
                      Settings
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        setIsPopoverOpen(false);
                        void router.push(`/profile/${currentUser?.username}`);
                      }}
                    >
                      View Profile
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        setIsPopoverOpen(false);
                      }}
                    >
                      <Logout />
                    </PopoverOption>
                  </Box>
                </Popover>
              </Visible>
            </Stack>
            <Hidden xs sm>
              <Stack direction="horizontal">
                <SetModeButton />
                <Button
                  data-tour="profile-settings-button"
                  shape="circle"
                  size="small"
                  variant="transparent"
                  onClick={() => setIsOpen(true)}
                >
                  <SettingOutlined
                    style={{
                      color: "rgb(191, 90, 242, 0.8)",
                      fontSize: "1.2rem",
                    }}
                  />
                </Button>
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
                <Logout />
              </Stack>
            </Hidden>
          </Stack>
          {(!currentUser.discordUsername ||
            currentUser.discordUsername === "undefined#undefined") && (
            <Box
              marginY={"3"}
              padding={"3"}
              display="flex"
              flexDirection={{
                lg: "row",
                xs: "column",
                md: "column",
                sm: "column",
              }}
              gap="3"
              justifyContent="space-between"
              alignItems={"center"}
              boxShadow="0.5"
              borderRadius={"large"}
            >
              <Text>
                {!currentUser.discordUsername
                  ? "Want to explore your favourite DAOs on Spect ? Unlock countless opportunities by connecting your Discord account."
                  : "Looks like your Discord isn't connected properly. Try connecting it again."}
              </Text>
              <ConnectDiscordButton width="fit" />
            </Box>
          )}
          <Box
            marginTop={{
              xs: "2",
              md: "4",
            }}
          />
          <Stack direction="horizontal" wrap>
            <Button
              size="small"
              prefix={<IconTokens />}
              variant={panelTab === "circles" ? "tertiary" : "transparent"}
              onClick={() => {
                void router.push("/");
                setPanelTab("circles");
              }}
            >
              Organizations
            </Button>
            <Button
              size="small"
              prefix={
                <Grid
                  size={18}
                  style={{
                    marginTop: 4,
                  }}
                />
              }
              variant={panelTab === "responses" ? "tertiary" : "transparent"}
              onClick={() => {
                void router.push("?tab=responses");
                setPanelTab("responses");
              }}
            >
              Form Responses
            </Button>
            {/* <Button
              size="small"
              prefix={<ProjectOutlined />}
              variant={panelTab === "Project" ? "tertiary" : "transparent"}
              onClick={() => setPanelTab("Project")}
            >
              Projects
            </Button> */}
            {/* <Button
            size="small"
            prefix={<IconCollection size={"5"} />}
            variant={panelTab === "Card" ? "tertiary" : "transparent"}
            onClick={() => setPanelTab("Card")}
          >
            Cards
          </Button> */}
          </Stack>
          <Box>
            {panelTab === "circles" && (
              <YourCircles
                circles={circles}
                isLoading={isLoading}
                height={currentUser?.discordUsername}
              />
            )}
            {panelTab === "responses" && <ResponsesTab />}
            {/* {panelTab == "Project" && (
              <YourProjects circles={circles} isLoading={isLoading} />
            )} */}
            {/* {panelTab == "Card" && (
            <YourCards
              circles={circles}
              isLoading={isLoading}
              currentUser={currentUser}
            />
          )} */}
          </Box>
        </Box>
        <Box
          style={{
            position: "absolute",
            right: "2rem",
            bottom: "1rem",
            zIndex: "1",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setFaqOpen(true)}
            shape="circle"
          >
            <QuestionCircleOutlined style={{ fontSize: "1.5rem" }} />
          </Button>
        </Box>
        <AnimatePresence>
          {faqOpen && <FAQModal handleClose={() => setFaqOpen(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {isOpen && <ProfileModal setIsOpen={setIsOpen} />}
        </AnimatePresence>
      </>
    );
  }

  return <Loader loading={isLoading} text="Fetching circles" />;
}

const UnderlinedText = styled(Box)`
  text-decoration: underline;
`;

export default memo(Dashboard);
