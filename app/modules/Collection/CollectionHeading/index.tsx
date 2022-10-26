import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useLocation } from "react-use";
import styled from "styled-components";
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
      alignItems="center"
      paddingLeft="3"
      paddingRight="5"
    >
      <Box
        width="full"
        height="16"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{
          paddingTop: "0.5rem",
          paddingBottom: "0.0rem",
        }}
      >
        {!loading && (
          <Box display="flex" flexDirection="row" width="full">
            <Box width="3/4">
              <Stack direction="horizontal">
                <Button
                  variant="transparent"
                  size="small"
                  onClick={() => setView(0)}
                >
                  <Text size="headingTwo" weight="semiBold" ellipsis>
                    {collection?.name}
                  </Text>
                </Button>
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
              </Stack>
            </Box>
            <Box width="1/4" justifyContent="center">
              <Stack direction="horizontal" space="8" align="center">
                <PrimaryButton
                  // icon={<IconDocuments />}
                  variant={"transparent"}
                  onClick={() => {
                    void router.push(`/r/${collection?.slug}`);
                    // uncomment this when pushing to prod, need the above line while we are testing
                    // window.open(
                    //   `https://circles.spect.network/r/${collection?.slug}`,
                    //   "_blank"
                    // );
                  }}
                >
                  Preview
                </PrimaryButton>
                <PrimaryButton
                  // icon={<ShareAltOutlined />}
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `https://spect.network/form/${collection?.slug}`
                    );
                    toast.success("Copied to clipboard");
                  }}
                >
                  Share
                </PrimaryButton>
              </Stack>
            </Box>
          </Box>
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
