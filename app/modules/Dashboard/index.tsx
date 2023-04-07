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
import { UserType, CircleType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import { memo, useState } from "react";
import Logout from "@/app/common/components/LogoutButton";
import { SettingOutlined } from "@ant-design/icons";
import { AnimatePresence } from "framer-motion";
import Loader from "@/app/common/components/Loader";
import useJoinCircle from "@/app/services/JoinCircle/useJoinCircle";
import { Hidden, Visible } from "react-grid-system";
import { smartTrim } from "@/app/common/utils/utils";
import Popover from "@/app/common/components/Popover";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { Grid } from "react-feather";
import ConnectDiscordButton from "@/app/common/components/ConnectDiscordButton";
import Help from "@/app/common/components/Help";
import { isProfilePanelExpandedAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import FAQModal from "./FAQModal";
import ResponsesTab from "./ResponsesTab";
import ProfileModal from "../Profile/ProfileSettings";
import YourCircles from "./CirclesTab";
import { PopoverOption } from "../Circle/CircleSettingsModal/DiscordRoleMapping/RolePopover";

const SetModeButton = () => {
  const { mode, setMode } = useTheme();

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

const Dashboard = () => {
  const [, setIsProfilePanelExpanded] = useAtom(isProfilePanelExpandedAtom);
  useJoinCircle();
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
  const { mode } = useTheme();
  const router = useRouter();

  if (isLoading || !currentUser?.id) {
    return <Loader loading={isLoading} text="Fetching circles" />;
  }

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
                src={
                  currentUser?.avatar ||
                  `https://api.dicebear.com/5.x/thumbs/svg?seed=${currentUser.id}`
                }
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
                        router.push(`/profile/${currentUser?.username}`);
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
              marginY="3"
              padding="3"
              display="flex"
              flexDirection={{
                lg: "row",
                xs: "column",
                md: "column",
                sm: "column",
              }}
              gap="3"
              justifyContent="space-between"
              alignItems="center"
              boxShadow="0.5"
              borderRadius="large"
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
                router.push("/");
                setPanelTab("circles");
              }}
            >
              Spaces
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
                router.push("?tab=responses");
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
          </Box>
        </Box>
        <Help setFaqOpen={setFaqOpen} />
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
};
export default memo(Dashboard);
