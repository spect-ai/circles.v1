import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Heading, IconDotsHorizontal, Stack, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { Hidden, Visible } from "react-grid-system";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useLocation } from "react-use";
import styled from "styled-components";
import { PopoverOption } from "../../Card/OptionPopover";
import { useCircle } from "../../Circle/CircleContext";
import AddField from "../AddField";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Embed } from "../Embed";
import { EyeOutlined, SendOutlined, ShareAltOutlined } from "@ant-design/icons";
import { smartTrim } from "@/app/common/utils/utils";
import FormSettings from "../Form/FormSettings";
import WarnConnectWallet from "./WarnConnectWallet";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function CollectionHeading() {
  const {
    localCollection: collection,
    loading,
    view,
    setView,
  } = useLocalCollection();
  const { mode } = useTheme();
  const router = useRouter();
  const { dataId } = router.query;
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { navigationBreadcrumbs } = useCircle();
  const { formActions } = useRoleGate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isWarningOpened, setIsWarningOpened] = useState(false);

  const location = useLocation();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  useEffect(() => {
    if (dataId) {
      setTimeout(() => {
        setView(1);
      }, 500);
    }
  }, [dataId, setView]);

  return (
    <Box
      width="full"
      display="flex"
      flexDirection="column"
      paddingLeft="3"
      paddingRight="8"
    >
      <Hidden xs sm>
        <Box marginLeft="4" marginTop="2">
          {navigationBreadcrumbs && (
            <Breadcrumbs crumbs={navigationBreadcrumbs} />
          )}
        </Box>
      </Hidden>
      <Box paddingTop="2">
        {!loading && (
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
            justify="space-between"
          >
            <Stack direction="horizontal" align="center">
              <Box
                width="full"
                paddingLeft={{
                  xs: "0",
                  md: "4",
                }}
              >
                <Heading>{smartTrim(collection?.name, 20)}</Heading>
              </Box>
              <FormSettings />
              <Hidden xs sm>
                <PrimaryButton
                  // icon={<IconPencil />}
                  variant={view === 0 ? "tertiary" : "transparent"}
                  onClick={() => {
                    void router.push(location.pathname as string);
                    setView(0);
                  }}
                >
                  Edit Form
                </PrimaryButton>
                <PrimaryButton
                  variant={view === 1 ? "tertiary" : "transparent"}
                  onClick={() => {
                    if (!formActions("viewResponses")) {
                      toast.error(
                        "Your role(s) doesn't have permissions to view responses of this form"
                      );
                      return;
                    }
                    setView(1);
                  }}
                >
                  Responses
                </PrimaryButton>
                {/* <PrimaryButton onClick={() => setIsAddFieldOpen(true)}>
                  Add Field
                </PrimaryButton> */}
              </Hidden>
              <Visible xs sm>
                <Box width="5">
                  <Popover
                    butttonComponent={
                      <Box
                        cursor="pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        id="icondots"
                      >
                        <Heading>
                          <IconDotsHorizontal />
                        </Heading>
                      </Box>
                    }
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                  >
                    <Box
                      backgroundColor="background"
                      borderWidth="0.5"
                      borderRadius="2xLarge"
                    >
                      <PopoverOption onClick={() => {}}>
                        <PrimaryButton
                          onClick={() => {
                            void navigator.clipboard.writeText(
                              `https://circles.spect.network/r/${collection?.slug}`
                            );
                            toast.success("Copied to clipboard");
                            process.env.NODE_ENV === "production" &&
                              mixpanel.track("Share Form", {
                                user: currentUser?.username,
                                form: collection?.name,
                              });
                          }}
                        >
                          Share
                        </PrimaryButton>
                      </PopoverOption>
                      <PopoverOption
                        onClick={() => {
                          setIsAddFieldOpen(true);
                          setIsOpen(false);
                        }}
                      >
                        Add Field
                      </PopoverOption>
                      {/* <Embed /> */}
                      {view === 1 && (
                        <PopoverOption
                          onClick={() => {
                            setView(0);
                            setIsOpen(false);
                          }}
                        >
                          Edit Form
                        </PopoverOption>
                      )}
                      {view === 0 && (
                        <PopoverOption
                          onClick={() => {
                            setView(1);
                            setIsOpen(false);
                          }}
                        >
                          Responses
                        </PopoverOption>
                      )}
                      <a
                        href={`/r/${collection?.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <PopoverOption
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          Preview
                        </PopoverOption>
                      </a>
                    </Box>
                  </Popover>
                </Box>
              </Visible>
            </Stack>
            <Hidden xs sm>
              <Stack
                direction="horizontal"
                space={{
                  xs: "2",
                  md: "4",
                }}
                align="center"
              >
                <Popover
                  butttonComponent={
                    <PrimaryButton
                      icon={
                        <SendOutlined
                          rotate={-40}
                          style={{ marginBottom: "0.3rem" }}
                        />
                      }
                      onClick={() => {
                        setIsWarningOpened(true);
                      }}
                    >
                      Share
                    </PrimaryButton>
                  }
                  isOpen={isShareOpen}
                  setIsOpen={setIsShareOpen}
                >
                  <Box
                    backgroundColor="background"
                    borderWidth="0.5"
                    borderRadius="2xLarge"
                  >
                    <PopoverOption
                      onClick={() => {
                        void navigator.clipboard.writeText(
                          `https://circles.spect.network/r/${collection?.slug}`
                        );
                        toast.success("Copied to clipboard");
                        process.env.NODE_ENV === "production" &&
                          mixpanel.track("Share Form", {
                            user: currentUser?.username,
                            form: collection?.name,
                          });
                        setIsShareOpen(false);
                      }}
                    >
                      Copy Link
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        setIsShareOpen(false);
                        setIsEmbedModalOpen(true);
                      }}
                    >
                      Embed
                    </PopoverOption>
                    <a
                      href={`/r/${collection?.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <PopoverOption
                        onClick={() => {
                          setIsShareOpen(false);
                        }}
                      >
                        Preview
                      </PopoverOption>
                    </a>
                  </Box>
                </Popover>
              </Stack>
            </Hidden>
          </Stack>
        )}
        {loading && (
          <Skeleton
            enableAnimation
            style={{
              height: "2rem",
              width: "15rem",
              borderRadius: "0.5rem",
            }}
            baseColor={mode === "dark" ? "rgb(20,20,20)" : "rgb(255,255,255)"}
            highlightColor={
              mode === "dark" ? "rgb(255,255,255,0.1)" : "rgb(20,20,20,0.1)"
            }
          />
        )}
      </Box>
      <AnimatePresence>
        {isAddFieldOpen && (
          <AddField handleClose={() => setIsAddFieldOpen(false)} />
        )}
        {isEmbedModalOpen && (
          <Embed
            isOpen={isEmbedModalOpen}
            setIsOpen={setIsEmbedModalOpen}
            component="form"
            routeId={collection.slug}
          />
        )}
        {isWarningOpened && (
          <WarnConnectWallet
            onYes={() => {
              setIsWarningOpened(false);
              setIsShareOpen(!isShareOpen);
            }}
            onNo={() => {
              setIsWarningOpened(false);
            }}
          />
        )}
      </AnimatePresence>
    </Box>
  );
}

export default memo(CollectionHeading);
