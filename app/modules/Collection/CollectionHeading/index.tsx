import PrimaryButton from "@/app/common/components/PrimaryButton";
import { ShareAltOutlined, TableOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconDocuments,
  IconList,
  IconPencil,
  Stack,
  Text,
  useTheme,
} from "degen";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import styled from "styled-components";
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
                  onClick={() => setView(0)}
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
              </Stack>
            </Box>
            <Box width="1/4" justifyContent="center">
              <Stack direction="horizontal" space="8" align="center">
                <PrimaryButton
                  // icon={<IconDocuments />}
                  variant={"transparent"}
                  onClick={() => {
                    window.open(
                      `https://spect.network/form/${collection?.slug}`,
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
        {/* <Box
          display="flex"
          flexDirection="row"
          borderWidth="0.375"
          borderRadius="large"
          backgroundColor="foregroundSecondary"
        >
          <IconButton
            color="textSecondary"
            paddingX="2"
            paddingY="1"
            borderRightRadius="large"
            backgroundColor={view === 0 ? "foregroundSecondary" : "background"}
            onClick={() => {
              setView(0);
            }}
          >
            <IconList />
          </IconButton>
          <IconButton
            color="textSecondary"
            paddingX="2"
            paddingY="1"
            borderRightRadius="large"
            backgroundColor={view === 1 ? "foregroundSecondary" : "background"}
            onClick={() => {
              setView(1);
            }}
          >
            <TableOutlined style={{ fontSize: "1.3rem" }} />
          </IconButton>
        </Box> */}
      </Box>
    </Box>
  );
}

export default memo(CollectionHeading);
