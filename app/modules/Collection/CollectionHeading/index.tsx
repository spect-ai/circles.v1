import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { DownloadOutlined, TwitterOutlined } from "@ant-design/icons";
import { Box, Button, IconDotsHorizontal, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { Hidden, Visible } from "react-grid-system";
import Skeleton from "react-loading-skeleton";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import { useLocation } from "react-use";
import styled from "styled-components";
import { PopoverOption } from "../../Card/OptionPopover";
import { useCircle } from "../../Circle/CircleContext";
import { ScrollContainer } from "../../Sidebar";
import AddField from "../AddField";
import { useLocalCollection } from "../Context/LocalCollectionContext";

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
  const { responses } = router.query;
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { navigationBreadcrumbs } = useCircle();

  const location = useLocation();

  useEffect(() => {
    if (typeof responses === "string") {
      setView(1);
    }
  }, [responses, setView]);

  return (
    <Box
      width="full"
      display="flex"
      flexDirection="column"
      paddingLeft="3"
      paddingRight="5"
    >
      <Box marginLeft="4" marginTop="2">
        {navigationBreadcrumbs && (
          <Breadcrumbs crumbs={navigationBreadcrumbs} />
        )}
      </Box>
      <Box
        width="full"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingTop="2"
      >
        {!loading && (
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
          >
            <Stack direction="horizontal" align="center">
              <Button
                variant="transparent"
                size="small"
                onClick={() => setView(0)}
              >
                <Text size="headingTwo" weight="semiBold" ellipsis>
                  {collection?.name}
                </Text>
              </Button>
              <Hidden xs md>
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
                  // icon={<IconDocuments />}
                  variant={view === 1 ? "tertiary" : "transparent"}
                  onClick={() => setView(1)}
                >
                  Responses
                </PrimaryButton>
                <PrimaryButton onClick={() => setIsAddFieldOpen(true)}>
                  Add Field
                </PrimaryButton>{" "}
              </Hidden>
              <Visible xs md>
                <Popover
                  butttonComponent={
                    <Box
                      cursor="pointer"
                      onClick={() => setIsOpen(!isOpen)}
                      color="foreground"
                    >
                      <IconDotsHorizontal color="textSecondary" />
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
                    <PopoverOption
                      onClick={() => {
                        setIsAddFieldOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      Add Field
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        setView(0);
                        setIsOpen(false);
                      }}
                    >
                      Edit Form
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        setView(1);
                        setIsOpen(false);
                      }}
                    >
                      Responses
                    </PopoverOption>
                  </Box>
                </Popover>
              </Visible>
            </Stack>
            <Stack
              direction="horizontal"
              space={{
                xs: "2",
                md: "8",
              }}
              align="center"
            >
              <PrimaryButton
                // icon={<IconDocuments />}
                variant={"transparent"}
                onClick={() => {
                  // void router.push(`/r/${collection?.slug}`);
                  // uncomment this when pushing to prod, need the above line while we are testing
                  window.open(
                    `https://circles.spect.network/r/${collection?.slug}`,
                    "_blank"
                  );
                }}
              >
                Preview
              </PrimaryButton>
              <PrimaryButton
                // icon={<ShareAltOutlined />}
                onClick={() => {
                  void navigator.clipboard.writeText(
                    `https://circles.spect.network/r/${collection?.slug}`
                  );
                  toast.success("Copied to clipboard");
                }}
              >
                Share
              </PrimaryButton>
            </Stack>
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
      </AnimatePresence>
    </Box>
  );
}

export default memo(CollectionHeading);
