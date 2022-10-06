import { TableOutlined } from "@ant-design/icons";
import { Box, Button, IconList, Text, useTheme } from "degen";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
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
      // borderBottomWidth="0.375"
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
          <Button variant="transparent" size="small">
            <Text size="headingTwo" weight="semiBold" ellipsis>
              {collection?.name}
            </Text>
          </Button>
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
        <Box
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
        </Box>
      </Box>
    </Box>
  );
}

export default memo(CollectionHeading);
