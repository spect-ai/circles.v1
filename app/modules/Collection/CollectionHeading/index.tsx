import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  Box,
  Heading,
  IconDotsHorizontal,
  Stack,
  useTheme,
  Text,
  Button,
  IconPlug,
} from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { Hidden, Visible } from "react-grid-system";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useLocation } from "react-use";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import AddField from "../AddField";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Embed } from "../Embed";
import { SendOutlined } from "@ant-design/icons";
import { smartTrim } from "@/app/common/utils/utils";
import FormSettings from "../Form/FormSettings";
import { PopoverOption } from "../../Circle/CircleSettingsModal/DiscordRoleMapping/RolePopover";
import ViewPlugins, { isPluginAdded } from "../../Plugins/ViewPlugins";
import { ShareOnDiscord } from "../ShareOnDiscord";
import { PluginType, spectPlugins } from "../../Plugins/Plugins";

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
  const [shareOnDiscordOpen, setShareOnDiscordOpen] = useState(false);
  const [isViewPluginsOpen, setIsViewPluginsOpen] = useState(false);
  const [numPluginsAdded, setNumPlugnsAdded] = useState(0);

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

  useEffect(() => {
    setNumPlugnsAdded(
      Object.keys(spectPlugins).filter((pluginName) =>
        isPluginAdded(pluginName as PluginType, collection)
      )?.length
    );
  }, [collection.formMetadata]);

  const onViewPluginsOpen = () => {
    if (!formActions("manageSettings")) {
      toast.error(
        "Your role(s) doesn't have permissions to add plugins, ensure your role has the permission to manage settings"
      );
      return;
    }
    process.env.NODE_ENV === "production" &&
      mixpanel.track("Add Plugins", {
        collection: collection.slug,
        circle: collection.parents[0].slug,
        user: currentUser?.username,
      });
    setIsViewPluginsOpen(true);
  };

  return (
    <Box
      width="full"
      display="flex"
      flexDirection="column"
      paddingLeft="3"
      paddingRight={{
        xs: "3",
        md: "8",
      }}
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
            <Stack direction="horizontal" align="center" space="2">
              <Box
                width="full"
                paddingLeft={{
                  xs: "0",
                  md: "4",
                }}
              >
                <Text
                  size={{
                    xs: "large",
                    md: "headingThree",
                  }}
                  weight="semiBold"
                  ellipsis
                >
                  {smartTrim(collection?.name, 20)}
                </Text>
              </Box>
              <Visible xs sm>
                <Button
                  shape="circle"
                  size="small"
                  variant="transparent"
                  center
                  onClick={onViewPluginsOpen}
                >
                  <IconPlug color="accent" />
                </Button>
              </Visible>
              <FormSettings />
              <Hidden xs sm>
                <PrimaryButton
                  // icon={<IconPencil />}
                  variant={view === 0 ? "tertiary" : "transparent"}
                  onClick={() => {
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Form Edit", {
                        collection: collection?.slug,
                        circle: collection?.parents[0].slug,
                        user: currentUser?.username,
                      });
                    void router.push(location.pathname as string);
                    setView(0);
                  }}
                >
                  Edit Form
                </PrimaryButton>
                <PrimaryButton
                  variant={view === 1 ? "tertiary" : "transparent"}
                  onClick={() => {
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Form Responses", {
                        collection: collection?.slug,
                        circle: collection?.parents[0].slug,
                        user: currentUser?.username,
                      });
                    if (!formActions("viewResponses")) {
                      toast.error(
                        "Your role(s) doesn't have permissions to view responses of this form"
                      );
                      return;
                    }
                    setView(1);
                  }}
                >
                  Responses ({Object.keys(collection.data || {})?.length})
                </PrimaryButton>
                <PrimaryButton
                  variant={view === 2 ? "tertiary" : "transparent"}
                  onClick={() => {
                    // if (collection.parents[0].pricingPlan === 0) {
                    //   toast.error(
                    //     "Analytics are only available for paid plans, please upgrade to view analytics"
                    //   );
                    //   return;
                    // }
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Form Analytics", {
                        collection: collection?.slug,
                        circle: collection?.parents[0].slug,
                        user: currentUser?.username,
                      });
                    setView(2);
                  }}
                >
                  Analytics
                </PrimaryButton>
                {/* <PrimaryButton onClick={() => setIsAddFieldOpen(true)}>
                  Add Field
                </PrimaryButton> */}
              </Hidden>
              <Visible xs sm>
                <Box width="8">
                  <Popover
                    butttonComponent={
                      <Button
                        shape="circle"
                        size="small"
                        variant="transparent"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <Heading>
                          <IconDotsHorizontal />
                        </Heading>
                      </Button>
                    }
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
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
                        }}
                      >
                        Share link
                      </PopoverOption>
                      <PopoverOption
                        onClick={() => {
                          if (!formActions("manageSettings")) {
                            toast.error(
                              "You don't have permissions to share this form, your role needs to have manage settings permissions"
                            );
                            return;
                          }
                          setShareOnDiscordOpen(true);
                          setIsOpen(false);
                        }}
                      >
                        Share on Discord 🔥
                      </PopoverOption>
                      <PopoverOption
                        onClick={() => {
                          process.env.NODE_ENV === "production" &&
                            mixpanel.track("Form Embed", {
                              collection: collection?.slug,
                              circle: collection?.parents[0].slug,
                              user: currentUser?.username,
                            });
                          setIsOpen(false);
                          setIsEmbedModalOpen(true);
                        }}
                      >
                        Embed
                      </PopoverOption>
                      <PopoverOption
                        onClick={() => {
                          onViewPluginsOpen();
                          setIsOpen(false);
                        }}
                      >
                        {numPluginsAdded > 0
                          ? ` Plugins (${numPluginsAdded} added)`
                          : `Add Plugins`}
                      </PopoverOption>
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
                      {view !== 1 && (
                        <PopoverOption
                          onClick={() => {
                            setView(1);
                            setIsOpen(false);
                          }}
                        >
                          Responses
                        </PopoverOption>
                      )}
                      {view !== 0 && (
                        <PopoverOption
                          onClick={() => {
                            setView(0);
                            setIsOpen(false);
                          }}
                        >
                          Edit Form
                        </PopoverOption>
                      )}
                      {view !== 2 && (
                        <PopoverOption
                          onClick={() => {
                            setView(2);
                            setIsOpen(false);
                          }}
                        >
                          Analytics
                        </PopoverOption>
                      )}
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
                <PrimaryButton
                  variant={"tertiary"}
                  onClick={onViewPluginsOpen}
                  icon={<IconPlug color="text" />}
                >
                  {numPluginsAdded > 0
                    ? ` Plugins (${numPluginsAdded} added)`
                    : `Add Plugins`}
                </PrimaryButton>
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
                        process.env.NODE_ENV === "production" &&
                          mixpanel.track("Share popover open", {
                            collection: collection?.slug,
                            circle: collection?.parents[0].slug,
                            user: currentUser?.username,
                          });
                        setIsShareOpen(!isShareOpen);
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
                        if (!formActions("manageSettings")) {
                          toast.error(
                            "You don't have permissions to share this form, your role needs to have manage settings permissions"
                          );
                          return;
                        }
                        setShareOnDiscordOpen(true);
                        setIsShareOpen(false);
                      }}
                    >
                      Share on Discord 🔥
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        process.env.NODE_ENV === "production" &&
                          mixpanel.track("Form Embed", {
                            collection: collection?.slug,
                            circle: collection?.parents[0].slug,
                            user: currentUser?.username,
                          });
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
                          process.env.NODE_ENV === "production" &&
                            mixpanel.track("Form Preview", {
                              collection: collection?.slug,
                              circle: collection?.parents[0].slug,
                              user: currentUser?.username,
                            });
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
            setIsOpen={setIsEmbedModalOpen}
            embedRoute={`https://circles.spect.network/r/${collection.slug}/embed?`}
          />
        )}

        {shareOnDiscordOpen && (
          <ShareOnDiscord
            isOpen={shareOnDiscordOpen}
            setIsOpen={setShareOnDiscordOpen}
          />
        )}
        {isViewPluginsOpen && (
          <ViewPlugins handleClose={() => setIsViewPluginsOpen(false)} />
        )}
      </AnimatePresence>
    </Box>
  );
}

export default memo(CollectionHeading);
